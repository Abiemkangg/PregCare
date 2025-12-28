# fallback_responses.py
# Pre-written responses for common pregnancy questions to save API calls

FALLBACK_ANSWERS = {
    # Tanda kehamilan - gunakan berbagai keyword variations
    "tanda": """
Tanda-tanda kehamilan awal yang umum:

- Telat menstruasi (tanda utama)
- Mual atau muntah (morning sickness) - biasanya minggu 6-12
- Payudara terasa nyeri dan membesar
- Sering buang air kecil
- Mudah lelah dan mengantuk
- Perubahan mood
- Ngidam atau sensitif terhadap bau
- Bercak darah ringan (implantasi)

Jika mengalami 3+ tanda ini, segera test pack dan konsultasi dokter kandungan ya! 💕
""",
    
    # Makanan sehat
    "makanan sehat": """
Makanan sehat untuk ibu hamil:

WAJIB:
- Sayuran hijau (bayam, kangkung, brokoli) - asam folat
- Buah-buahan (jeruk, pisang, apel, alpukat)
- Protein (telur, ikan salmon, ayam, tempe, tahu)
- Susu dan produk dairy (kalsium)
- Kacang-kacangan (almond, kacang hijau)
- Air putih 8-10 gelas/hari

BATASI:
- Kafein (max 200mg/hari)
- Gula berlebihan
- Makanan mentah/setengah matang

HINDARI:
- Alkohol
- Ikan tinggi merkuri (tuna besar, hiu)
- Daging/telur mentah

Makan porsi kecil tapi sering (5-6x sehari) lebih baik ya! 🥗
""",
    
    # Mual muntah
    "mual muntah": """
Tips mengatasi mual muntah saat hamil:

- Makan porsi kecil tapi sering (tiap 2-3 jam)
- Crackers atau biskuit plain sebelum bangun tidur
- Hindari makanan berminyak, pedas, atau berbau menyengat
- Minum air putih sedikit-sedikit tapi sering
- Jahe (teh jahe, permen jahe) sangat membantu
- Vitamin B6 sesuai anjuran dokter
- Istirahat cukup
- Hindari perut kosong
- Permen mint atau lemon
- Udara segar (buka jendela, jalan pagi)

Jika muntah >5x/hari atau tidak bisa makan/minum sama sekali, segera ke dokter ya! Bisa dehidrasi. 💚
""",
    
    # Olahraga
    "olahraga": """
Olahraga aman untuk ibu hamil:

AMAN & DIANJURKAN:
- Jalan kaki (30 menit/hari)
- Berenang
- Yoga prenatal
- Senam hamil
- Stretching ringan
- Pilates prenatal

TIPS:
- Pemanasan 5-10 menit
- Intensitas ringan-sedang
- Jangan sampai terengah-engah
- Hindari gerakan melompat/benturan
- Minum air cukup
- Pakai sepatu nyaman
- Stop jika pusing/sakit

HINDARI:
- Olahraga kontak (bola, martial arts)
- Scuba diving
- Hot yoga
- Angkat beban berat
- Olahraga risiko jatuh

Konsultasi dokter dulu sebelum mulai program olahraga ya! 🏃‍♀️
""",
    
    # Vitamin
    "vitamin": """
Vitamin penting untuk ibu hamil:

WAJIB:
- Asam Folat (400-800 mcg) - cegah cacat tabung saraf
- Zat Besi (27 mg) - cegah anemia
- Kalsium (1000 mg) - tulang bayi
- Vitamin D (600 IU) - penyerapan kalsium
- DHA/Omega-3 - perkembangan otak bayi

TAMBAHAN:
- Vitamin B kompleks
- Vitamin C
- Zinc
- Iodine

PENTING:
- Konsumsi vitamin prenatal sesuai resep dokter
- Minum dengan air putih, hindari teh/kopi
- Zat besi lebih baik diminum saat perut kosong
- Kalsium jangan bareng zat besi (jarak 2 jam)

Jangan sembarangan minum suplemen ya, konsultasi dokter dulu! 💊
""",
    
    # Tidur
    "tidur posisi": """
Posisi tidur terbaik untuk ibu hamil:

PALING BAIK:
- Miring kiri (meningkatkan aliran darah ke plasenta)
- Gunakan bantal di antara kaki
- Bantal di bawah perut juga boleh
- Kepala sedikit lebih tinggi (jika heartburn)

BOLEH:
- Miring kanan (kalau tidak nyaman kiri)
- Semi duduk (jika sesak nafas)

HINDARI:
- Telentang (trimester 2-3) - bisa tekan pembuluh darah
- Tengkurap - tidak nyaman dan berbahaya

TIPS:
- Pakai pregnancy pillow (U-shaped)
- Kasur tidak terlalu empuk
- Tidur 7-9 jam/hari
- Power nap 20-30 menit siang hari OK

Sulit tidur normal kok bu, yang penting istirahat cukup ya! 😴
""",
    
    # Hubungan intim
    "hubungan intim": """
Hubungan intim saat hamil:

AMAN jika:
- Kehamilan sehat, tidak ada komplikasi
- Tidak ada perdarahan
- Tidak ada riwayat keguguran
- Air ketuban tidak pecah
- Leher rahim tidak terbuka

POSISI AMAN:
- Woman on top
- Spooning (miring)
- Doggy style (hati-hati, tidak terlalu dalam)
- Hindari posisi menekan perut

MANFAAT:
- Mempererat hubungan
- Mengurangi stress
- Latihan otot panggul

KAPAN STOP:
- Perdarahan
- Nyeri perut
- Cairan keluar
- Dokter melarang

Komunikasi dengan pasangan penting ya! Kalau tidak nyaman, bilang. Libido naik-turun saat hamil itu normal kok. 💑
""",

    # Kesuburan (BARU - dari Pertanyaan Cepat)
    "kesuburan": """
Cara meningkatkan kesuburan:

🔬 UNTUK WANITA:
• Kenali masa subur (ovulasi) - hari ke 12-16 siklus
• Jaga berat badan ideal (BMI 18.5-24.9)
• Konsumsi asam folat 400mcg/hari
• Makan makanan bergizi (sayur, buah, protein)
• Olahraga teratur tapi tidak berlebihan
• Hindari rokok, alkohol, kafein berlebih
• Tidur cukup 7-8 jam/malam
• Kelola stres dengan baik

🔬 UNTUK PRIA:
• Hindari celana ketat dan suhu panas berlebih
• Konsumsi zinc dan vitamin C
• Olahraga teratur
• Hindari rokok dan alkohol
• Jaga berat badan ideal

💡 TIPS TAMBAHAN:
• Berhubungan 2-3x seminggu, terutama masa subur
• Posisi misionaris atau doggy direkomendasikan
• Berbaring 15-20 menit setelah berhubungan
• Gunakan pelumas yang fertility-friendly

⚠️ Konsultasi ke dokter jika:
• Sudah mencoba 1 tahun (usia <35) atau 6 bulan (usia >35)
• Siklus haid tidak teratur
• Riwayat keguguran berulang

Jaga kesehatan dan bersabar ya! Prosesnya butuh waktu. 💪
""",

    # Kelahiran Prematur (BARU - dari Pertanyaan Cepat)
    "kelahiran prematur": """
Penyebab dan pencegahan kelahiran prematur:

⚠️ FAKTOR RISIKO:
• Riwayat persalinan prematur sebelumnya
• Kehamilan kembar
• Infeksi (vagina, saluran kemih, gusi)
• Tekanan darah tinggi/preeklamsia
• Diabetes tidak terkontrol
• Usia ibu <17 atau >35 tahun
• Jarak kehamilan terlalu dekat (<18 bulan)
• Stres berat
• Berat badan kurang/berlebih
• Merokok, alkohol, narkoba
• Kelainan rahim/serviks

🛡️ CARA MENCEGAH:
• Rutin kontrol kehamilan (ANC)
• Jaga kesehatan mulut dan gigi
• Cegah dan obati infeksi
• Konsumsi asam folat dan vitamin prenatal
• Istirahat cukup, hindari aktivitas berat
• Kelola stres dengan baik
• Jangan merokok atau minum alkohol
• Minum air putih cukup
• Makan bergizi seimbang

🚨 TANDA BAHAYA (Segera ke RS):
• Kontraksi teratur sebelum 37 minggu
• Perdarahan atau keluarnya lendir
• Pecah ketuban dini
• Nyeri punggung bawah terus-menerus
• Tekanan di panggul

Prematur = lahir <37 minggu. Jika punya faktor risiko, dokter mungkin memberikan perawatan khusus. 🏥
""",
}

def get_fallback_answer(question: str) -> str:
    """Get fallback answer if question matches common topics"""
    question_lower = question.lower()
    
    # Define keyword mappings for better matching
    keyword_map = {
        "tanda": ["tanda", "ciri", "gejala", "sign", "kehamilan awal"],
        "makanan sehat": ["makanan", "makan", "menu", "food", "nutrisi", "gizi", "diet"],
        "mual muntah": ["mual", "muntah", "morning sickness", "eneg"],
        "olahraga": ["olahraga", "senam", "exercise", "fitness", "yoga", "gerak"],
        "vitamin": ["vitamin", "suplemen", "asam folat", "zat besi"],
        "tidur posisi": ["tidur", "posisi", "sleep", "sleeping", "istirahat"],
        "hubungan intim": ["hubungan", "intim", "sex", "berhubungan"],
        "kesuburan": ["kesuburan", "subur", "fertility", "meningkatkan kesuburan", "program hamil", "promil"],
        "kelahiran prematur": ["prematur", "premature", "lahir dini", "kelahiran dini", "persalinan dini"],
    }
    
    # Check each topic with flexible keyword matching
    for topic, answer in FALLBACK_ANSWERS.items():
        if topic in keyword_map:
            keywords = keyword_map[topic]
        else:
            keywords = [topic]
        
        # Match if ANY keyword found
        if any(kw in question_lower for kw in keywords):
            return answer.strip()
    
    return None

def add_fallback_to_cache(cache):
    """Pre-populate cache with fallback answers"""
    if not cache:
        return
    
    for topic, answer in FALLBACK_ANSWERS.items():
        # Create sample questions for each topic
        sample_questions = {
            "tanda": [
                "apa saja tanda-tanda kehamilan awal?",
                "ciri-ciri hamil muda itu apa?",
                "gejala hamil apa saja?"
            ],
            "makanan sehat": [
                "makanan apa yang baik untuk ibu hamil?",
                "menu sehat untuk bumil",
                "makanan yang harus dihindari saat hamil"
            ],
            "mual muntah": [
                "cara mengatasi mual saat hamil",
                "morning sickness gimana ngatasinnya?",
                "muntah terus saat hamil"
            ],
            "olahraga": [
                "olahraga apa yang aman untuk ibu hamil?",
                "boleh senam tidak saat hamil?",
                "bumil boleh olahraga tidak?"
            ],
            "vitamin": [
                "vitamin apa yang penting untuk ibu hamil?",
                "suplemen apa yang perlu diminum bumil?",
                "asam folat untuk apa?"
            ],
            "tidur posisi": [
                "posisi tidur yang baik untuk ibu hamil",
                "bumil tidur miring kiri atau kanan?",
                "bolehkah ibu hamil tidur telentang?"
            ],
            "hubungan intim": [
                "bolehkah berhubungan saat hamil?",
                "aman tidak hubungan intim saat hamil?",
                "posisi aman saat hamil"
            ],
            "kesuburan": [
                "bagaimana cara meningkatkan kesuburan?",
                "tips agar cepat hamil",
                "program hamil yang benar"
            ],
            "kelahiran prematur": [
                "apa yang menyebabkan kelahiran prematur?",
                "pencegahan bayi lahir prematur",
                "tanda-tanda persalinan dini"
            ],
        }
        
        if topic in sample_questions:
            for q in sample_questions[topic]:
                cache.set(q, answer.strip(), response_time=0.0)
