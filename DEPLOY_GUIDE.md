# 🚀 Panduan Deploy PregCare ke Vercel + Backend

## ✅ **YA, Frontend Memanggil Backend!**

Frontend PregCare **SANGAT BERGANTUNG** pada 2 backend:

### Backend yang Dipanggil:

1. **Django Backend (Port 8000)**
   - Login & Register
   - Fertility Tracker (CRUD semua data)
   - User Management
   
2. **RAG Backend - FastAPI (Port 8001)**
   - AI Assistant Chat (Gemini + RAG)
   - Chat History
   - Knowledge Base

---

## 📋 **Langkah Deploy ke Vercel**

### **Step 1: Deploy Backend Dulu!**

#### **Opsi A: Deploy ke Railway (RECOMMENDED)**

**Django Backend:**
```bash
# 1. Buat akun di https://railway.app
# 2. Install Railway CLI
npm install -g @railway/cli

# 3. Login
railway login

# 4. Deploy Django
cd backend
railway init
railway up
```

**RAG Backend:**
```bash
# Deploy FastAPI RAG backend
cd backend/app/API
railway init
railway up
```

#### **Opsi B: Deploy ke Render**
1. Buat akun di https://render.com
2. Connect GitHub repo
3. Pilih "Web Service"
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `python manage.py runserver 0.0.0.0:$PORT`

---

### **Step 2: Setup Environment Variables di Vercel**

1. **Buka Vercel Dashboard**: https://vercel.com
2. **Import Project** → Pilih folder `FrontEnd`
3. **Environment Variables** → Tambahkan:

```env
VITE_API_URL=https://your-django-backend.railway.app
VITE_CHAT_API_URL=https://your-rag-backend.railway.app
```

Ganti URL dengan URL production backend kamu!

---

### **Step 3: Deploy Frontend**

#### **Via Vercel Dashboard:**
1. Klik "Deploy"
2. Tunggu build selesai
3. Done! Frontend siap di `https://your-app.vercel.app`

#### **Via CLI:**
```bash
cd FrontEnd

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🔧 **Update CORS di Backend**

Setelah deploy, update CORS di Django:

```python
# backend/backend_project/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://your-app.vercel.app",  # Tambah ini!
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "https://your-app.vercel.app",  # Tambah ini!
]
```

---

## 🧪 **Testing Setelah Deploy**

1. **Buka frontend production**: `https://your-app.vercel.app`
2. **Test Login** dengan akun dummy:
   - Email: `admin@pregcare.com`
   - Password: `admin123`
3. **Test Fertility Tracker**: Add cycle, edit dates
4. **Test AI Assistant**: Chat dengan bot

---

## ⚠️ **Catatan Penting**

### **Database:**
- Development: SQLite (local file)
- Production: **Harus pakai PostgreSQL!**
  - Railway auto-provision PostgreSQL
  - Update `settings.py` dengan database URL

### **Environment Variables di Backend:**
```env
DATABASE_URL=postgresql://...
GEMINI_API_KEY=your-api-key
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.railway.app
```

### **Static Files:**
Django perlu serve static files di production:
```bash
python manage.py collectstatic --no-input
```

---

## 📦 **File yang Perlu Dibuat untuk Deploy**

### **Backend Django:**

**requirements.txt:**
```txt
django>=4.2
djangorestframework>=3.14
django-cors-headers>=4.3
psycopg2-binary
gunicorn
whitenoise
```

**Procfile (untuk Railway/Heroku):**
```
web: gunicorn backend_project.wsgi
```

### **Backend RAG:**

**requirements.txt:**
```txt
fastapi
uvicorn
python-multipart
sentence-transformers
google-generativeai
pyjwt
bcrypt
email-validator
```

**Procfile:**
```
web: uvicorn chat_api:app --host 0.0.0.0 --port $PORT
```

---

## 🎯 **Ringkasan**

**Untuk deploy ke Vercel:**
1. ✅ Deploy **Django Backend** ke Railway/Render
2. ✅ Deploy **RAG Backend** ke Railway/Render
3. ✅ Set **environment variables** di Vercel
4. ✅ Update **CORS** di backend
5. ✅ Deploy **Frontend** ke Vercel

**Frontend TIDAK BISA standalone!** Harus ada backend running.

---

## 🆘 **Troubleshooting**

**Frontend error "Failed to fetch":**
- Cek CORS di backend
- Cek URL environment variable
- Cek backend sudah running

**Login failed:**
- Cek database sudah ada dummy users
- Run: `python manage.py create_multiple_users --count 5`

**AI Assistant error:**
- Cek RAG backend running
- Cek Gemini API key valid
- Cek port 8001 accessible

---

**Need help?** Check:
- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- Django deployment: https://docs.djangoproject.com/en/4.2/howto/deployment/
