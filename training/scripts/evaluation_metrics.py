"""
Evaluation Metrics untuk RAG Pipeline
Mengukur kualitas jawaban: Faithfulness, Answer Relevancy, Context Recall
"""
import re
from typing import List, Dict, Tuple
from dataclasses import dataclass

try:
    from sentence_transformers import SentenceTransformer, util
except ImportError:
    SentenceTransformer = None
    util = None


@dataclass
class EvaluationResult:
    """Hasil evaluasi RAG"""
    faithfulness: float  # 0-1: Apakah jawaban sesuai dengan context
    answer_relevancy: float  # 0-1: Apakah jawaban relevan dengan pertanyaan
    context_recall: float  # 0-1: Apakah context mencakup info penting
    overall_score: float  # Average dari 3 metrics
    details: Dict


class RAGEvaluator:
    """
    Evaluator untuk RAG pipeline.
    Menggunakan similarity-based metrics untuk menilai kualitas jawaban.
    """
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        if SentenceTransformer is None:
            raise ImportError("sentence-transformers required for evaluation")
        
        self.model = SentenceTransformer(model_name)
    
    def evaluate_faithfulness(self, answer: str, context: str) -> Tuple[float, Dict]:
        """
        Faithfulness: Apakah jawaban didukung oleh context?
        
        Method:
        1. Extract klaim/fakta dari jawaban
        2. Check apakah setiap klaim ada di context
        3. Score = % klaim yang didukung context
        
        Returns: (score 0-1, details dict)
        """
        # Split answer into sentences (klaim)
        sentences = self._split_sentences(answer)
        
        if not sentences:
            return 0.0, {"error": "No sentences in answer"}
        
        # Encode context and sentences
        context_embedding = self.model.encode(context, convert_to_tensor=True)
        sentence_embeddings = self.model.encode(sentences, convert_to_tensor=True)
        
        # Calculate similarity for each sentence
        similarities = util.cos_sim(sentence_embeddings, context_embedding)
        
        # Threshold: consider supported if similarity > 0.6
        threshold = 0.6
        supported_count = sum(1 for sim in similarities if sim.item() > threshold)
        
        faithfulness_score = supported_count / len(sentences)
        
        details = {
            "total_claims": len(sentences),
            "supported_claims": supported_count,
            "unsupported_claims": len(sentences) - supported_count,
            "threshold": threshold,
            "claim_similarities": [sim.item() for sim in similarities]
        }
        
        return faithfulness_score, details
    
    def evaluate_answer_relevancy(self, answer: str, question: str) -> Tuple[float, Dict]:
        """
        Answer Relevancy: Apakah jawaban relevan dengan pertanyaan?
        
        Method:
        1. Encode question dan answer
        2. Hitung cosine similarity
        3. Bonus jika jawaban mengandung kata kunci dari pertanyaan
        
        Returns: (score 0-1, details dict)
        """
        # Semantic similarity
        question_embedding = self.model.encode(question, convert_to_tensor=True)
        answer_embedding = self.model.encode(answer, convert_to_tensor=True)
        
        semantic_sim = util.cos_sim(question_embedding, answer_embedding).item()
        
        # Keyword overlap bonus
        question_words = set(self._extract_keywords(question))
        answer_words = set(self._extract_keywords(answer))
        
        if question_words:
            keyword_overlap = len(question_words & answer_words) / len(question_words)
        else:
            keyword_overlap = 0.0
        
        # Combined score (70% semantic, 30% keyword)
        relevancy_score = 0.7 * semantic_sim + 0.3 * keyword_overlap
        
        details = {
            "semantic_similarity": semantic_sim,
            "keyword_overlap": keyword_overlap,
            "matched_keywords": list(question_words & answer_words),
            "total_question_keywords": len(question_words)
        }
        
        return relevancy_score, details
    
    def evaluate_context_recall(
        self, 
        question: str, 
        context: str, 
        expected_info: List[str] = None
    ) -> Tuple[float, Dict]:
        """
        Context Recall: Apakah context mencakup informasi penting untuk pertanyaan?
        
        Method:
        1. Encode question dan context
        2. Hitung semantic similarity
        3. Jika expected_info diberikan, check coverage
        
        Returns: (score 0-1, details dict)
        """
        # Semantic relevance of context to question
        question_embedding = self.model.encode(question, convert_to_tensor=True)
        context_embedding = self.model.encode(context, convert_to_tensor=True)
        
        semantic_relevance = util.cos_sim(question_embedding, context_embedding).item()
        
        # If expected_info provided, check coverage
        coverage_score = 1.0
        covered_items = []
        
        if expected_info:
            context_lower = context.lower()
            for info in expected_info:
                if info.lower() in context_lower:
                    covered_items.append(info)
            
            coverage_score = len(covered_items) / len(expected_info) if expected_info else 1.0
        
        # Combined score
        recall_score = 0.7 * semantic_relevance + 0.3 * coverage_score
        
        details = {
            "semantic_relevance": semantic_relevance,
            "coverage_score": coverage_score,
            "covered_items": covered_items,
            "expected_items": expected_info or [],
            "context_length": len(context)
        }
        
        return recall_score, details
    
    def evaluate_full(
        self,
        question: str,
        answer: str,
        context: str,
        expected_info: List[str] = None
    ) -> EvaluationResult:
        """
        Comprehensive evaluation dengan semua metrics.
        
        Args:
            question: User question
            answer: Generated answer
            context: Retrieved context
            expected_info: Optional list of expected info in context
        
        Returns: EvaluationResult object
        """
        # Evaluate each metric
        faithfulness, faith_details = self.evaluate_faithfulness(answer, context)
        relevancy, rel_details = self.evaluate_answer_relevancy(answer, question)
        recall, recall_details = self.evaluate_context_recall(question, context, expected_info)
        
        # Overall score (weighted average)
        overall = (
            0.4 * faithfulness +   # Most important: answer must be grounded
            0.4 * relevancy +       # Answer must address question
            0.2 * recall            # Context should be relevant
        )
        
        return EvaluationResult(
            faithfulness=faithfulness,
            answer_relevancy=relevancy,
            context_recall=recall,
            overall_score=overall,
            details={
                "faithfulness": faith_details,
                "answer_relevancy": rel_details,
                "context_recall": recall_details
            }
        )
    
    def _split_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        # Simple sentence splitter
        sentences = re.split(r'[.!?]+', text)
        # Clean and filter
        sentences = [s.strip() for s in sentences if s.strip()]
        # Filter out very short sentences (likely not real claims)
        sentences = [s for s in sentences if len(s) > 20]
        return sentences
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract important keywords dari text"""
        # Remove common stopwords
        stopwords = {
            'apa', 'yang', 'di', 'ke', 'dari', 'untuk', 'dan', 'atau',
            'adalah', 'dengan', 'pada', 'dalam', 'sebagai', 'oleh',
            'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been',
            'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
            'would', 'should', 'can', 'could', 'may', 'might'
        }
        
        # Extract words
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Filter stopwords and short words
        keywords = [
            w for w in words 
            if w not in stopwords and len(w) > 3
        ]
        
        return keywords
    
    def print_evaluation(self, result: EvaluationResult):
        """Print evaluation result in readable format"""
        print("\n" + "="*60)
        print(" RAG EVALUATION RESULTS")
        print("="*60)
        
        # Overall score with color
        overall_pct = result.overall_score * 100
        if overall_pct >= 80:
            emoji = ""
            grade = "Excellent"
        elif overall_pct >= 60:
            emoji = ""
            grade = "Good"
        elif overall_pct >= 40:
            emoji = "️"
            grade = "Fair"
        else:
            emoji = ""
            grade = "Poor"
        
        print(f"\n{emoji} Overall Score: {overall_pct:.1f}% ({grade})")
        print(f"\n{'Metric':<25} {'Score':<10} {'Rating'}")
        print("-"*60)
        
        # Individual metrics
        metrics = [
            ("Faithfulness", result.faithfulness, "Context support"),
            ("Answer Relevancy", result.answer_relevancy, "Question match"),
            ("Context Recall", result.context_recall, "Info coverage")
        ]
        
        for name, score, description in metrics:
            score_pct = score * 100
            bar = "█" * int(score_pct / 5) + "░" * (20 - int(score_pct / 5))
            print(f"{name:<25} {score_pct:>5.1f}%  {bar}")
        
        # Details
        print("\n" + "-"*60)
        print(" Details:")
        
        faith_details = result.details["faithfulness"]
        print(f"\n  Faithfulness:")
        print(f"    - Supported claims: {faith_details['supported_claims']}/{faith_details['total_claims']}")
        
        rel_details = result.details["answer_relevancy"]
        print(f"\n  Answer Relevancy:")
        print(f"    - Semantic similarity: {rel_details['semantic_similarity']:.3f}")
        print(f"    - Keyword overlap: {rel_details['keyword_overlap']:.3f}")
        if rel_details['matched_keywords']:
            print(f"    - Matched: {', '.join(rel_details['matched_keywords'][:5])}")
        
        recall_details = result.details["context_recall"]
        print(f"\n  Context Recall:")
        print(f"    - Semantic relevance: {recall_details['semantic_relevance']:.3f}")
        print(f"    - Context length: {recall_details['context_length']} chars")
        
        print("\n" + "="*60 + "\n")


# Example usage
if __name__ == "__main__":
    evaluator = RAGEvaluator()
    
    # Test case
    question = "Apa makanan terbaik untuk ibu hamil?"
    
    context = """
    Ibu hamil membutuhkan nutrisi yang cukup untuk mendukung pertumbuhan janin.
    Makanan yang direkomendasikan termasuk sayuran hijau yang kaya asam folat,
    ikan salmon yang mengandung omega-3, susu dan produk dairy untuk kalsium,
    daging tanpa lemak untuk protein dan zat besi, serta buah-buahan untuk vitamin.
    """
    
    answer = """
    Makanan terbaik untuk ibu hamil meliputi:
    1. Sayuran hijau seperti bayam dan brokoli yang kaya asam folat
    2. Ikan salmon untuk omega-3 yang baik untuk perkembangan otak bayi
    3. Produk susu untuk memenuhi kebutuhan kalsium
    4. Daging tanpa lemak untuk protein dan zat besi
    Konsultasikan dengan dokter untuk rekomendasi yang sesuai kondisi Anda.
    """
    
    # Evaluate
    result = evaluator.evaluate_full(
        question=question,
        answer=answer,
        context=context,
        expected_info=["asam folat", "omega-3", "kalsium", "protein"]
    )
    
    # Print results
    evaluator.print_evaluation(result)
