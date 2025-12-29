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

Jika mengalami 3+ tanda ini, segera test pack dan konsultasi dokter kandungan ya! 
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

Makan porsi kecil tapi sering (5-6x sehari) lebih baik ya! 
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

Jika muntah >5x/hari atau tidak bisa makan/minum sama sekali, segera ke dokter ya! Bisa dehidrasi. 
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

Konsultasi dokter dulu sebelum mulai program olahraga ya! ‍️
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

Jangan sembarangan minum suplemen ya, konsultasi dokter dulu! 
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

Sulit tidur normal kok bu, yang penting istirahat cukup ya! 
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

Komunikasi dengan pasangan penting ya! Kalau tidak nyaman, bilang. Libido naik-turun saat hamil itu normal kok. 
""",

    # Kesuburan (BARU - dari Pertanyaan Cepat)
    "kesuburan": """
Cara meningkatkan kesuburan:

 UNTUK WANITA:
• Kenali masa subur (ovulasi) - hari ke 12-16 siklus
• Jaga berat badan ideal (BMI 18.5-24.9)
• Konsumsi asam folat 400mcg/hari
• Makan makanan bergizi (sayur, buah, protein)
• Olahraga teratur tapi tidak berlebihan
• Hindari rokok, alkohol, kafein berlebih
• Tidur cukup 7-8 jam/malam
• Kelola stres dengan baik

 UNTUK PRIA:
• Hindari celana ketat dan suhu panas berlebih
• Konsumsi zinc dan vitamin C
• Olahraga teratur
• Hindari rokok dan alkohol
• Jaga berat badan ideal

 TIPS TAMBAHAN:
• Berhubungan 2-3x seminggu, terutama masa subur
• Posisi misionaris atau doggy direkomendasikan
• Berbaring 15-20 menit setelah berhubungan
• Gunakan pelumas yang fertility-friendly

️ Konsultasi ke dokter jika:
• Sudah mencoba 1 tahun (usia <35) atau 6 bulan (usia >35)
• Siklus haid tidak teratur
• Riwayat keguguran berulang

Jaga kesehatan dan bersabar ya! Prosesnya butuh waktu. 
""",

    # Kelahiran Prematur (BARU - dari Pertanyaan Cepat)
    "kelahiran prematur": """
Penyebab dan pencegahan kelahiran prematur:

️ FAKTOR RISIKO:
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

️ CARA MENCEGAH:
• Rutin kontrol kehamilan (ANC)
• Jaga kesehatan mulut dan gigi
• Cegah dan obati infeksi
• Konsumsi asam folat dan vitamin prenatal
• Istirahat cukup, hindari aktivitas berat
• Kelola stres dengan baik
• Jangan merokok atau minum alkohol
• Minum air putih cukup
• Makan bergizi seimbang

 TANDA BAHAYA (Segera ke RS):
• Kontraksi teratur sebelum 37 minggu
• Perdarahan atau keluarnya lendir
• Pecah ketuban dini
• Nyeri punggung bawah terus-menerus
• Tekanan di panggul

Prematur = lahir <37 minggu. Jika punya faktor risiko, dokter mungkin memberikan perawatan khusus. 
""",

    # Kualitas Sperma (BARU - untuk pasangan pria)
    "sperma": """
Cara meningkatkan kualitas sperma:

 FAKTOR KUALITAS SPERMA:
• Jumlah (minimal 15 juta/ml)
• Pergerakan (motilitas >40%)
• Bentuk normal (morfologi >4%)
• Volume ejakulasi (1.5-5 ml)

 CARA MENINGKATKAN:
• Konsumsi zinc (tiram, daging, kacang)
• Vitamin C & E (antioksidan)
• Asam folat (sayuran hijau)
• Omega-3 (ikan salmon)
• Hindari rokok & alkohol
• Olahraga teratur (tidak berlebihan)
• Tidur cukup 7-8 jam
• Kelola stres
• Hindari celana ketat
• Jauhi suhu panas (sauna, laptop di pangkuan)

⏰ WAKTU OPTIMAL:
• Abstinence 2-3 hari sebelum program hamil
• Terlalu sering (tiap hari) = sperma kurang matang
• Terlalu jarang (>7 hari) = sperma tua

️ KAPAN KE DOKTER:
• Belum hamil setelah 1 tahun mencoba
• Riwayat infeksi atau cedera testis
• Varikokel (pembengkakan pembuluh darah)

Pemeriksaan sperma (analisis semen) sangat dianjurkan untuk evaluasi kesuburan pria. ‍️
""",

    # Kesehatan Seksual (BARU)
    "kesehatan seksual": """
Kesehatan seksual untuk pasangan program hamil:

 FREKUENSI OPTIMAL:
• 2-3x per minggu secara teratur
• Setiap hari atau selang sehari saat masa subur
• Masa subur = hari ke 10-17 siklus (28 hari)

 POSISI YANG DIANJURKAN:
• Misionaris (pria di atas)
• Doggy style
• Berbaring dengan bantal di pinggul setelahnya
• Hindari posisi wanita di atas saat program hamil

⏰ WAKTU TERBAIK:
• Pagi hari (testosteron pria tertinggi)
• Saat rileks dan tidak terburu-buru
• 1-2 hari sebelum ovulasi = paling subur

 TIPS TAMBAHAN:
• Gunakan pelumas water-based yang fertility-friendly
• Hindari pelumas biasa (bisa menghambat sperma)
• Wanita berbaring 15-20 menit setelahnya
• Orgasme wanita TIDAK wajib untuk hamil
• Rileks dan nikmati prosesnya

 YANG HARUS DIHINDARI:
• Douching (bilas vagina)
• Pelumas berbahan minyak
• Berhubungan terlalu sering (>1x sehari)
• Stres berlebihan

Komunikasi dengan pasangan adalah kunci! Jika butuh bantuan, konsultasi dokter SpOG atau androlog. 
""",

    # Masa Subur (BARU)
    "masa subur": """
Menghitung masa subur untuk program hamil:

 CARA MENGHITUNG:
• Siklus 28 hari: masa subur hari ke 12-16
• Ovulasi terjadi sekitar 14 hari SEBELUM haid berikutnya
• Sel telur bertahan 12-24 jam setelah ovulasi
• Sperma bertahan 3-5 hari di dalam rahim

 TANDA-TANDA MASA SUBUR:
• Lendir serviks bening seperti putih telur
• Suhu basal tubuh naik 0.2-0.5°C
• Nyeri ringan di perut bawah (mittelschmerz)
• Payudara lebih sensitif
• Libido meningkat

 CARA TRACKING:
• Catat siklus haid 3-6 bulan
• Gunakan ovulation test kit (OPK)
• Ukur suhu basal setiap pagi
• Perhatikan lendir serviks
• Gunakan aplikasi fertility tracker

⏰ KAPAN BERHUBUNGAN:
• Mulai dari 5 hari sebelum ovulasi
• Puncak kesuburan = 1-2 hari sebelum ovulasi
• Berhubungan tiap 1-2 hari selama masa subur

 RUMUS SEDERHANA:
Hari subur pertama = Siklus terpendek - 18
Hari subur terakhir = Siklus terpanjang - 11

Tracking konsisten selama 3 bulan akan membantu mengenali pola tubuhmu! 
""",

    # Kesehatan Pria (BARU)
    "kesehatan pria": """
Kesehatan reproduksi pria untuk program hamil:

 NUTRISI PENTING:
• Zinc - tiram, daging merah, biji labu
• Selenium - kacang brazil, ikan
• Vitamin C - jeruk, kiwi, paprika
• Vitamin E - almond, bayam
• Asam folat - sayuran hijau
• Omega-3 - ikan salmon, walnut
• CoQ10 - daging organ, kacang

 GAYA HIDUP SEHAT:
• Olahraga teratur 30 menit/hari
• Tidur cukup 7-8 jam
• Kelola stres dengan baik
• Jaga berat badan ideal (BMI 20-25)
• Hindari rokok total
• Batasi alkohol (max 2 gelas/hari)

️ HINDARI PANAS BERLEBIH:
• Celana dalam longgar (boxer)
• Hindari sauna/jacuzzi
• Jangan laptop di pangkuan
• Hindari duduk terlalu lama

️ YANG MERUSAK SPERMA:
• Merokok (turunkan jumlah 23%)
• Alkohol berlebihan
• Narkoba (marijuana, kokain)
• Steroid anabolik
• Pestisida & bahan kimia
• Radiasi berlebihan
• Stres kronis

‍️ PEMERIKSAAN YANG DIANJURKAN:
• Analisis sperma
• Pemeriksaan hormon (FSH, LH, Testosteron)
• USG testis jika perlu

Kesuburan pria berkontribusi 50% dalam kehamilan. Jaga kesehatan bersama pasangan! 
""",

    # Kualitas Sperma (BARU - sangat spesifik)
    "sperma": """
Cara meningkatkan kualitas sperma:

 PARAMETER SPERMA SEHAT:
• Volume: >1.5 ml per ejakulasi
• Jumlah: >15 juta/ml
• Motilitas: >40% bergerak aktif
• Morfologi: >4% bentuk normal

 MAKANAN UNTUK SPERMA:
• Tiram & kerang (zinc tinggi)
• Kacang brazil (selenium)
• Tomat (lycopene)
• Ikan salmon (omega-3)
• Bayam & brokoli (folat)
• Jeruk & kiwi (vitamin C)
• Telur (protein & vitamin D)

 SUPLEMEN YANG MEMBANTU:
• Zinc 30-50mg/hari
• Vitamin C 500-1000mg
• CoQ10 200-300mg
• L-Carnitine 1000mg
• Asam folat 400mcg

 YANG MERUSAK SPERMA:
• Rokok (turun 23%)
• Alkohol berlebihan
• Suhu panas (sauna, laptop)
• Celana ketat
• Obesitas
• Stres kronis
• Kurang tidur

⏱️ WAKTU PRODUKSI:
Sperma butuh 74 hari untuk matang. Perubahan gaya hidup terasa setelah 3 bulan.

Pemeriksaan analisis sperma dianjurkan jika belum hamil setelah 1 tahun mencoba. 
""",

    # Menstruasi/Haid (BARU)  
    "menstruasi": """
Siklus menstruasi dan hubungannya dengan kesuburan:

 SIKLUS NORMAL:
• Durasi siklus: 21-35 hari (rata-rata 28)
• Lama haid: 3-7 hari
• Volume darah: 30-80 ml per siklus

 FASE-FASE SIKLUS:
1. Fase Menstruasi (hari 1-5) - peluruhan dinding rahim
2. Fase Folikuler (hari 6-13) - sel telur matang
3. Ovulasi (hari 14) - sel telur dilepaskan
4. Fase Luteal (hari 15-28) - persiapan kehamilan

 SIKLUS TIDAK NORMAL:
• Terlalu pendek (<21 hari) atau panjang (>35 hari)
• Tidak haid >3 bulan (amenore)
• Sangat nyeri (dismenore berat)
• Perdarahan sangat banyak
• Spotting di luar siklus

 CARA MENJAGA SIKLUS:
• Jaga berat badan ideal
• Olahraga teratur (tidak berlebihan)
• Tidur cukup
• Kelola stres
• Makan bergizi seimbang
• Hindari diet ekstrem

️ KAPAN KE DOKTER:
• Siklus sangat tidak teratur
• Nyeri haid yang mengganggu aktivitas
• Tidak haid tapi tidak hamil
• Perdarahan di luar siklus

Catat siklus haidmu untuk membantu program hamil dan deteksi dini masalah. 
""",
}

def get_fallback_answer(question: str) -> str:
    """
    Get fallback answer ONLY for very common/general questions.
    Returns None for specific questions so API can provide accurate answers.
    """
    question_lower = question.lower().strip()
    
    # HANYA match untuk pertanyaan yang PERSIS atau SANGAT umum
    # Pertanyaan spesifik akan pakai API untuk jawaban akurat
    
    # Exact match patterns (pertanyaan umum yang sering ditanya)
    exact_patterns = {
        "tanda": [
            "apa saja tanda-tanda kehamilan awal",
            "apa saja tanda kehamilan awal",
            "tanda tanda kehamilan",
            "tanda kehamilan awal",
            "ciri ciri hamil",
            "ciri-ciri hamil",
        ],
        "makanan sehat": [
            "makanan apa yang baik untuk ibu hamil",
            "makanan yang baik untuk ibu hamil",
            "makanan sehat untuk ibu hamil",
            "makanan sehat ibu hamil",
        ],
        "kelahiran prematur": [
            "apa yang menyebabkan kelahiran prematur",
            "penyebab kelahiran prematur",
            "penyebab bayi lahir prematur",
        ],
        "kesuburan": [
            "bagaimana cara meningkatkan kesuburan",
            "cara meningkatkan kesuburan",
            "tips meningkatkan kesuburan",
        ],
    }
    
    # Check exact patterns first (untuk Pertanyaan Cepat di UI)
    for topic, patterns in exact_patterns.items():
        for pattern in patterns:
            if pattern in question_lower or question_lower in pattern:
                if topic in FALLBACK_ANSWERS:
                    return FALLBACK_ANSWERS[topic].strip()
    
    # Untuk pertanyaan lain, return None agar pakai API
    # API akan memberikan jawaban yang lebih akurat dan spesifik
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
