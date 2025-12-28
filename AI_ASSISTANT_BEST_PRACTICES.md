# 🤖 PregCare AI Assistant - Best Practices

## 📝 Cara Menggunakan AI Assistant yang Benar

### ✅ DO (Lakukan)

#### 1. **Pertanyaan Spesifik tentang Kehamilan**
Gunakan pertanyaan yang jelas dan spesifik tentang kehamilan:

**Contoh BAIK:**
- ✅ "Makanan apa yang baik untuk trimester pertama?"
- ✅ "Bagaimana cara mengatasi mual saat hamil?"
- ✅ "Apakah nanas muda aman untuk ibu hamil?"
- ✅ "Vitamin apa yang perlu dikonsumsi saat hamil?"
- ✅ "Olahraga apa yang aman untuk bumil trimester 2?"

#### 2. **Tunggu 4-5 Detik Antar Pertanyaan**
- Sistem memiliki rate limiter otomatis
- Jeda 4-5 detik mencegah error "sistem sibuk"
- Biarkan loading selesai sebelum kirim pertanyaan baru

#### 3. **Gunakan Semantic Cache**
- Pertanyaan yang SAMA atau MIRIP akan instant (0.1 detik)
- Hemat token dan waktu
- Contoh:
  * "Makanan sehat ibu hamil" → Generate baru
  * "Makanan sehat untuk ibu hamil" → Dari cache (instant!)

#### 4. **Pertanyaan Singkat dan Jelas**
- Maksimal 2-3 kalimat
- Fokus pada 1 topik
- Gunakan kata kunci: hamil, kehamilan, bumil, janin, kandungan

**Contoh:**
```
❌ "Kak aku mau tanya dong soal makanan yang bagus buat kesehatan 
    terus juga vitamin apa yang harus diminum sama olahraga apa yang boleh"

✅ "Makanan apa yang baik untuk kesehatan ibu hamil?"
(tunggu jawaban, lalu tanya berikutnya)
✅ "Vitamin apa yang harus dikonsumsi saat hamil?"
```

---

### ❌ DON'T (Jangan)

#### 1. **Jangan Spam Request**
- ❌ Klik berulang-ulang dalam waktu singkat
- ❌ Kirim pertanyaan berturut-turut tanpa jeda
- ✅ Tunggu jawaban selesai sebelum pertanyaan baru

#### 2. **Jangan Pertanyaan di Luar Kehamilan**
Sistem akan menolak pertanyaan tentang:
- ❌ Politik, game, film, musik
- ❌ Resep masakan umum (bukan untuk bumil)
- ❌ Topik umum tidak terkait kehamilan

**Contoh DITOLAK:**
```
❌ "Berapa agama di Indonesia?"
❌ "Cara main Mobile Legend"
❌ "Film apa yang bagus?"
```

#### 3. **Jangan Pertanyaan Terlalu Panjang**
- Maksimal 500 karakter
- Fokus pada 1 topik per pertanyaan
- Pecah pertanyaan kompleks jadi beberapa pertanyaan

---

## 🎯 Tips Mendapatkan Jawaban Terbaik

### 1. **Gunakan Konteks yang Tepat**
```
❌ Kurang spesifik: "Apa yang harus dilakukan?"
✅ Spesifik: "Apa yang harus dilakukan saat mual di trimester pertama?"
```

### 2. **Manfaatkan Conversation History**
- Sistem mengingat 2 percakapan terakhir
- Bisa lanjut pertanyaan dengan konteks sebelumnya
- Contoh:
  ```
  Q1: "Makanan apa yang baik untuk trimester pertama?"
  A1: [jawaban lengkap]
  
  Q2: "Berapa porsi yang direkomendasikan?" 
  ← Sistem tahu merujuk ke makanan di Q1
  ```

### 3. **Clear Chat untuk Topik Baru**
- Klik tombol "Clear" sebelum ganti topik
- Mencegah konteks lama mengganggu jawaban baru
- Refresh conversation history

---

## ⚡ Memahami Response Time

### Response Time Normal:
- **0.1 - 0.5s** → Cache hit (pertanyaan mirip sudah pernah)
- **4-8s** → Generate baru dari AI (normal)
- **> 10s** → Tunggu rate limit, coba lagi nanti

### Badge "Cached":
- 💚 **Cached** = Instant, tidak pakai token baru
- Pertanyaan yang persis sama atau sangat mirip
- Hemat kuota API

---

## 🔥 Troubleshooting

### "Sistem sedang sibuk karena banyak permintaan"
**Penyebab:** Rate limit dari Gemini API (15 request/minute)

**Solusi:**
1. ✅ Tunggu 1 menit penuh
2. ✅ Jangan spam pertanyaan
3. ✅ Tunggu 4-5 detik antar pertanyaan
4. ✅ Gunakan cache (tanya pertanyaan mirip)

### "Maaf ya, aku cuma bisa bantu pertanyaan seputar kehamilan"
**Penyebab:** Pertanyaan tidak terkait kehamilan

**Solusi:**
1. ✅ Pastikan ada kata: hamil, kehamilan, bumil, janin, kandungan
2. ✅ Fokus pada topik kesehatan ibu hamil
3. ✅ Hindari kata forbidden: politik, game, film, dll

### Response Tidak Relevan
**Solusi:**
1. ✅ Clear chat history
2. ✅ Pertanyaan lebih spesifik
3. ✅ Gunakan kata kunci yang tepat

---

## 📊 Quota Management

### Gemini Free Tier Limits:
- **15 requests per minute (RPM)**
- **1,500 requests per day (RPD)**
- **Auto rate limiter aktif:** 4 detik per request

### Strategi Hemat Quota:
1. ✅ Manfaatkan cache (pertanyaan mirip)
2. ✅ Pertanyaan spesifik (1 topik = 1 request)
3. ✅ Tunggu 4-5 detik antar pertanyaan
4. ✅ Hindari pertanyaan berulang

---

## 💡 Contoh Sesi Chat yang Baik

```
[User clear chat dulu]

21:00 → Q: "Makanan apa yang baik untuk trimester pertama?"
21:08 → A: [Jawaban lengkap tentang makanan...]

[Tunggu 5 detik]

21:13 → Q: "Berapa porsi sayur yang direkomendasikan?"
21:17 → A: [Jawaban dengan konteks pertanyaan sebelumnya...]

[Tunggu 5 detik]

21:22 → Q: "Apakah boleh makan nanas saat hamil muda?"
21:26 → A: [Jawaban spesifik tentang nanas...]

[Tunggu 5 detik]

21:31 → Q: "Apakah boleh makan nanas saat hamil muda?" [pertanyaan sama]
21:31 → A: [CACHED - Instant 0.1s] ✨
```

---

## 🎓 Summary

**Golden Rules:**
1. 🎯 Pertanyaan spesifik tentang kehamilan
2. ⏱️ Tunggu 4-5 detik antar pertanyaan
3. 🔄 Manfaatkan cache untuk pertanyaan mirip
4. 🧹 Clear chat untuk topik baru
5. 🚫 Jangan spam request

**Expected Behavior:**
- ✅ Rate limiter otomatis mencegah error
- ✅ Cache membuat pertanyaan mirip instant
- ✅ Response time 4-8 detik untuk pertanyaan baru
- ✅ Sistem menolak pertanyaan non-kehamilan

---

## 📞 Support

Jika masih mengalami masalah:
1. Clear browser cache
2. Refresh halaman
3. Tunggu 1-2 menit
4. Coba lagi dengan best practices di atas

---

**Happy Chatting! 🤰💬**
