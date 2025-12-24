# 🚀 CARA JALANKAN BACKEND (Super Mudah!)

## Cara 1: Double Click Script (PALING MUDAH!)

1. Buka folder: `backend`
2. **Double click** file: `START_BACKEND.ps1`
3. Backend langsung jalan di window PowerShell baru!

## Cara 2: Lewat Terminal (Manual)

Buka PowerShell, ketik:

```powershell
cd "C:\Users\chris\Documents\SEMESTER 5\IPPL\backend"
..\\.venv\Scripts\python.exe manage.py runserver
```

**Done!** Backend jalan di http://localhost:8000

## Cara Stop Backend

- Tekan **CTRL + C** di window PowerShell
- Atau tutup window PowerShell langsung

## Cek Backend Sudah Running?

Buka browser: http://localhost:8000/admin

Kalau muncul halaman Django admin = Backend sudah jalan! ✅

## Login Dummy Accounts

Semua password: **admin123**

| Email | Username |
|-------|----------|
| admin@pregcare.com | admin |
| siti@test.com | siti |
| rani@test.com | rani |
| dewi@test.com | dewi |
| maya@test.com | maya |

## Troubleshooting

**"Port 8000 already in use"**
- Backend sudah running! Ga perlu jalankan lagi

**"Module not found"**
- Install dependencies dulu:
```powershell
..\\.venv\Scripts\pip.exe install django djangorestframework django-cors-headers
```

**Database error**
- Run migrations:
```powershell
..\\.venv\Scripts\python.exe manage.py migrate
```
