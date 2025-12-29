# 🔧 Cara Setup Notifikasi Email Gmail - PregCare

## ✅ Status Server
**Django Backend sudah running di:** `http://127.0.0.1:8000/`  
**Frontend Vite sudah running di:** `http://localhost:5174/`

## 📧 Setup Gmail SMTP untuk Notifikasi Email

### Langkah 1: Buat Gmail App Password

Gmail tidak mengizinkan aplikasi eksternal menggunakan password biasa. Anda harus membuat **App Password**.

1. **Buka Google Account:**  
   Kunjungi: https://myaccount.google.com/

2. **Aktifkan 2-Factor Authentication (2FA):**
   - Klik **Security** di sidebar kiri
   - Cari **2-Step Verification**
   - Ikuti langkah untuk mengaktifkan 2FA jika belum aktif

3. **Buat App Password:**
   - Setelah 2FA aktif, kembali ke **Security**
   - Cari **App passwords** atau kunjungi: https://myaccount.google.com/apppasswords
   - Pilih **Select app** → Pilih **Mail** atau **Other (Custom name)**
   - Pilih **Select device** → Pilih perangkat Anda
   - Klik **Generate**
   - Salin password 16 karakter yang muncul (format: `xxxx xxxx xxxx xxxx`)

### Langkah 2: Update File .env

1. Buka file: `backend/.env`

2. Isi dengan Gmail Anda:
```env
PREGCARE_EMAIL_USER=email-anda@gmail.com
PREGCARE_EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Contoh:**
```env
PREGCARE_EMAIL_USER=pregcare.noreply@gmail.com
PREGCARE_EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Langkah 3: Restart Django Server

Setelah mengisi .env, restart server Django:

**Via Terminal PowerShell:**
```powershell
# Stop server (Ctrl+C)
# Lalu jalankan lagi:
cd "C:\Users\chris\Documents\SEMESTER 5\IPPL"
.\.venv\Scripts\Activate.ps1
cd backend
python manage.py runserver
```

✅ **Cek apakah warning hilang:**  
Jika berhasil, Anda tidak akan melihat warning:
```
WARNING: Email credentials not configured
```

## 📨 Fitur Email yang Aktif

Setelah Gmail SMTP dikonfigurasi, notifikasi email akan otomatis dikirim untuk:

### 1. **Reminder Harian (Daily Check-in)**
- **Waktu:** Setiap hari jam 08:00 pagi
- **Konten:** Mengingatkan user untuk melakukan daily check-in
- **Lokasi Kode:** `fertility/notifications/services.py` → `send_daily_checkin_reminder()`

### 2. **Fase Subur (Fertile Window Alert)**
- **Waktu:** 2 hari sebelum masa subur
- **Konten:** Memberitahu user bahwa masa subur akan datang
- **Lokasi Kode:** `fertility/notifications/services.py` → `send_fertile_window_notification()`

### 3. **Ovulasi (Ovulation Day)**
- **Waktu:** Pada hari ovulasi
- **Konten:** Notifikasi bahwa hari ini adalah puncak kesuburan
- **Lokasi Kode:** `fertility/notifications/services.py` → `send_ovulation_notification()`

### 4. **Prediksi Menstruasi (Period Prediction)**
- **Waktu:** 2 hari sebelum menstruasi
- **Konten:** Reminder bahwa menstruasi akan datang
- **Lokasi Kode:** `fertility/notifications/services.py` → `send_period_reminder()`

### 5. **Konsistensi Tracking**
- **Waktu:** Jika user tidak tracking selama 3 hari
- **Konten:** Encouragement untuk kembali tracking
- **Lokasi Kode:** `fertility/notifications/services.py` → `send_tracking_encouragement()`

## 🔍 Testing Email Notifikasi

### Test Manual via Django Shell:

```python
python manage.py shell

# Import service
from fertility.notifications.services import send_daily_checkin_reminder
from django.contrib.auth.models import User

# Get user
user = User.objects.first()

# Send test email
send_daily_checkin_reminder(user)
```

### Test via Management Command:

Buat file: `fertility/management/commands/test_email.py`

```python
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from fertility.notifications.services import send_daily_checkin_reminder

class Command(BaseCommand):
    help = 'Test email notification'

    def handle(self, *args, **options):
        user = User.objects.first()
        if user:
            result = send_daily_checkin_reminder(user)
            self.stdout.write(self.style.SUCCESS(f'Email sent: {result}'))
        else:
            self.stdout.write(self.style.ERROR('No user found'))
```

Jalankan:
```bash
python manage.py test_email
```

## 🚨 Troubleshooting

### Problem 1: "Failed to fetch" di Frontend
**Solusi:** Pastikan Django server running di `http://127.0.0.1:8000/`

### Problem 2: CORS Error
**Sudah fixed!** CORS sudah dikonfigurasi untuk port 5173-5180

### Problem 3: Email tidak terkirim
- Cek apakah App Password benar (16 karakter tanpa spasi)
- Cek apakah 2FA aktif di Gmail
- Cek log: `backend/notification.log`

### Problem 4: SMTPAuthenticationError
- Pastikan menggunakan **App Password**, bukan password Gmail biasa
- Verifikasi email address benar

## 📂 File Penting

| File | Fungsi |
|------|--------|
| `backend/.env` | Konfigurasi Gmail SMTP |
| `backend/.env.example` | Template konfigurasi |
| `backend_project/settings.py` | Django settings (line 206-216 untuk email) |
| `fertility/notifications/services.py` | Semua fungsi kirim email |
| `fertility/notifications/models.py` | Model NotificationLog |
| `backend/notification.log` | Log email yang dikirim |

## ✅ Checklist Setup

- [x] Django server running (port 8000)
- [x] Frontend Vite running (port 5174)
- [x] CORS dikonfigurasi
- [x] Authentication app registered
- [ ] Gmail App Password dibuat
- [ ] File .env diisi dengan credentials
- [ ] Server direstart setelah .env diisi
- [ ] Test email berhasil terkirim

## 🎯 Setelah Setup

1. **Login/Register** di `http://localhost:5174/login`
2. **Input data siklus** di Fertility Tracker
3. **Tunggu notifikasi email** sesuai jadwal atau test manual

---

**Pertanyaan?** Cek kode di `fertility/notifications/services.py` untuk detail implementasi email.
