from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class FertilityProfile(models.Model):
    """Profile untuk tracking fertility per user"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='fertility_profile')
    average_cycle_length = models.IntegerField(default=28, help_text="Rata-rata panjang siklus dalam hari")
    average_period_length = models.IntegerField(default=5, help_text="Rata-rata lama menstruasi dalam hari")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fertility_profiles'
        verbose_name = 'Fertility Profile'
        verbose_name_plural = 'Fertility Profiles'

    def __str__(self):
        return f"Fertility Profile - {self.user.username}"


class MenstrualCycle(models.Model):
    """Data siklus menstruasi"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='menstrual_cycles')
    start_date = models.DateField(help_text="Hari pertama menstruasi")
    end_date = models.DateField(null=True, blank=True, help_text="Hari terakhir menstruasi")
    cycle_length = models.IntegerField(null=True, blank=True, help_text="Panjang siklus (hari)")
    period_length = models.IntegerField(null=True, blank=True, help_text="Lama menstruasi (hari)")
    
    # Prediksi fase
    ovulation_date = models.DateField(null=True, blank=True, help_text="Prediksi hari ovulasi")
    fertile_window_start = models.DateField(null=True, blank=True, help_text="Awal masa subur")
    fertile_window_end = models.DateField(null=True, blank=True, help_text="Akhir masa subur")
    next_period_date = models.DateField(null=True, blank=True, help_text="Prediksi menstruasi berikutnya")
    
    # Status
    is_current = models.BooleanField(default=True, help_text="Apakah ini siklus saat ini")
    notes = models.TextField(blank=True, help_text="Catatan tambahan")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'menstrual_cycles'
        verbose_name = 'Menstrual Cycle'
        verbose_name_plural = 'Menstrual Cycles'
        ordering = ['-start_date']

    def __str__(self):
        return f"{self.user.username} - Cycle starting {self.start_date}"

    def calculate_cycle_data(self):
        """Hitung data siklus, ovulasi, dan masa subur"""
        from datetime import timedelta
        
        # Hitung panjang menstruasi jika end_date ada
        if self.end_date and self.start_date:
            self.period_length = (self.end_date - self.start_date).days + 1
        
        # Ambil average cycle length dari profile atau default
        try:
            profile = self.user.fertility_profile
            avg_cycle = profile.average_cycle_length
        except:
            avg_cycle = 28
        
        if not self.cycle_length:
            self.cycle_length = avg_cycle
        
        # Hitung ovulasi (14 hari sebelum menstruasi berikutnya)
        self.ovulation_date = self.start_date + timedelta(days=self.cycle_length - 14)
        
        # Hitung masa subur (5 hari sebelum ovulasi sampai 1 hari setelah ovulasi)
        self.fertile_window_start = self.ovulation_date - timedelta(days=5)
        self.fertile_window_end = self.ovulation_date + timedelta(days=1)
        
        # Hitung prediksi menstruasi berikutnya
        self.next_period_date = self.start_date + timedelta(days=self.cycle_length)
        
        self.save()

    def get_phase(self, date):
        """Tentukan fase siklus pada tanggal tertentu"""
        from datetime import timedelta
        
        if not self.start_date or not self.cycle_length:
            return 'unknown'
        
        # Hitung hari ke berapa dalam siklus
        days_from_start = (date - self.start_date).days
        
        if days_from_start < 0:
            return 'before_cycle'
        
        if days_from_start >= self.cycle_length:
            return 'after_cycle'
        
        # Tentukan fase
        if self.end_date and date <= self.end_date:
            return 'menstruation'
        elif self.fertile_window_start and self.fertile_window_end:
            if self.fertile_window_start <= date <= self.fertile_window_end:
                if date == self.ovulation_date:
                    return 'ovulation'
                return 'fertile'
        
        # Fase folikuler atau luteal
        if self.period_length:
            if days_from_start < self.cycle_length - 14:
                return 'follicular'
            else:
                return 'luteal'
        
        return 'normal'


class Symptom(models.Model):
    """Gejala yang dialami"""
    CATEGORY_CHOICES = [
        ('physical', 'Physical'),
        ('mood', 'Mood'),
        ('flow', 'Flow'),
        ('other', 'Other'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='symptoms')
    date = models.DateField(help_text="Tanggal gejala dialami")
    symptom_type = models.CharField(max_length=50, help_text="Jenis gejala (misal: cramps, headache)")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='physical')
    severity = models.IntegerField(null=True, blank=True, help_text="Tingkat keparahan 1-10")
    notes = models.TextField(blank=True, help_text="Catatan tambahan")
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'symptoms'
        verbose_name = 'Symptom'
        verbose_name_plural = 'Symptoms'
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.symptom_type} on {self.date}"


class CycleAnalysis(models.Model):
    """Analisis siklus menstruasi"""
    ANALYSIS_TYPE_CHOICES = [
        ('normal', 'Normal'),
        ('irregular', 'Irregular'),
        ('short', 'Short Cycle'),
        ('long', 'Long Cycle'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cycle_analyses')
    analysis_date = models.DateField(default=timezone.now)
    
    # Data analisis
    average_cycle_length = models.FloatField(help_text="Rata-rata panjang siklus")
    cycle_variability = models.FloatField(help_text="Variasi antar siklus")
    analysis_type = models.CharField(max_length=20, choices=ANALYSIS_TYPE_CHOICES, default='normal')
    
    # Pesan dan rekomendasi
    message = models.TextField(help_text="Pesan analisis untuk user")
    recommendations = models.JSONField(default=list, help_text="List rekomendasi")
    potential_causes = models.JSONField(default=list, help_text="List kemungkinan penyebab")
    
    # Metadata
    cycles_analyzed = models.IntegerField(help_text="Jumlah siklus yang dianalisis")
    confidence_level = models.CharField(max_length=20, default='low', help_text="Tingkat kepercayaan analisis")
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cycle_analyses'
        verbose_name = 'Cycle Analysis'
        verbose_name_plural = 'Cycle Analyses'
        ordering = ['-analysis_date']

    def __str__(self):
        return f"{self.user.username} - Analysis {self.analysis_date}"

    @staticmethod
    def generate_analysis(user):
        """Generate analisis untuk user berdasarkan history siklus"""
        from datetime import timedelta
        
        cycles = MenstrualCycle.objects.filter(user=user).order_by('-start_date')[:6]
        
        if len(cycles) < 2:
            return {
                'type': 'insufficient_data',
                'message': 'Diperlukan minimal 2 siklus untuk analisis. Terus catat siklus Anda untuk mendapatkan insight yang lebih baik.',
                'recommendations': [
                    'Catat setiap siklus menstruasi secara konsisten',
                    'Perhatikan pola gejala yang Anda alami',
                    'Catat tanggal mulai dan akhir menstruasi dengan akurat'
                ],
                'potential_causes': [],
                'average_length': None,
                'variability': None,
                'confidence': 'low'
            }
        
        # Hitung rata-rata panjang siklus
        cycle_lengths = []
        for i in range(len(cycles) - 1):
            current_cycle = cycles[i]
            previous_cycle = cycles[i + 1]
            days_diff = (current_cycle.start_date - previous_cycle.start_date).days
            if 15 <= days_diff <= 45:  # Filter outliers
                cycle_lengths.append(days_diff)
        
        if not cycle_lengths:
            return {
                'type': 'insufficient_data',
                'message': 'Data siklus belum cukup untuk analisis akurat.',
                'recommendations': ['Lanjutkan pencatatan siklus'],
                'potential_causes': [],
                'average_length': None,
                'variability': None,
                'confidence': 'low'
            }
        
        avg_length = sum(cycle_lengths) / len(cycle_lengths)
        variability = max(cycle_lengths) - min(cycle_lengths) if len(cycle_lengths) > 1 else 0
        
        # Tentukan tipe analisis
        analysis_type = 'normal'
        message = ''
        recommendations = []
        potential_causes = []
        
        if avg_length < 21:
            analysis_type = 'short'
            message = f'Siklus Anda cenderung pendek dengan rata-rata {avg_length:.0f} hari. Rentang normal adalah 21-35 hari.'
            potential_causes = [
                'Stres berlebihan',
                'Gangguan hormon tiroid',
                'Perimenopause',
                'Kondisi kesehatan tertentu'
            ]
            recommendations = [
                'Konsultasikan dengan dokter kandungan untuk evaluasi',
                'Kelola stres dengan teknik relaksasi',
                'Perhatikan pola tidur dan nutrisi',
                'Catat gejala lain yang menyertai'
            ]
        elif avg_length > 35:
            analysis_type = 'long'
            message = f'Siklus Anda cenderung panjang dengan rata-rata {avg_length:.0f} hari. Rentang normal adalah 21-35 hari.'
            potential_causes = [
                'Sindrom ovarium polikistik (PCOS)',
                'Gangguan hormon tiroid',
                'Stres berkepanjangan',
                'Perubahan berat badan signifikan'
            ]
            recommendations = [
                'Konsultasikan dengan dokter kandungan',
                'Jaga berat badan ideal',
                'Olahraga teratur dengan intensitas sedang',
                'Perhatikan pola makan seimbang'
            ]
        elif variability > 7:
            analysis_type = 'irregular'
            message = f'Siklus Anda tidak teratur dengan variasi hingga {variability:.0f} hari antar siklus.'
            potential_causes = [
                'Stres',
                'Perubahan berat badan',
                'Gangguan hormonal',
                'Efek samping obat atau kontrasepsi'
            ]
            recommendations = [
                'Catat siklus lebih detail untuk pola',
                'Evaluasi faktor gaya hidup',
                'Konsultasi jika berlanjut lebih dari 3 bulan',
                'Kelola stres dengan baik'
            ]
        else:
            message = f'Siklus Anda teratur dengan rata-rata {avg_length:.0f} hari dalam rentang normal (21-35 hari).'
            recommendations = [
                'Terus pantau siklus secara konsisten',
                'Jaga pola hidup sehat',
                'Perhatikan perubahan gejala',
                'Catat aktivitas yang mempengaruhi siklus'
            ]
        
        # Tentukan confidence level
        confidence = 'high' if len(cycle_lengths) >= 5 else 'medium' if len(cycle_lengths) >= 3 else 'low'
        
        # Simpan ke database
        analysis = CycleAnalysis.objects.create(
            user=user,
            average_cycle_length=avg_length,
            cycle_variability=variability,
            analysis_type=analysis_type,
            message=message,
            recommendations=recommendations,
            potential_causes=potential_causes,
            cycles_analyzed=len(cycle_lengths),
            confidence_level=confidence
        )
        
        return {
            'id': analysis.id,
            'type': analysis_type,
            'message': message,
            'recommendations': recommendations,
            'potential_causes': potential_causes,
            'average_length': avg_length,
            'variability': variability,
            'confidence': confidence,
            'cycles_analyzed': len(cycle_lengths)
        }
