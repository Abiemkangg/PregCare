import { Link } from 'react-router-dom';

const CaraKerja = () => {
  const steps = [
    {
      number: '1',
      title: 'Daftar & Buat Profil',
      description: 'Buat akun dan lengkapi profil kesehatan Anda dengan mudah dan aman',
      color: 'from-primary-pink to-primary-purple',
    },
    {
      number: '2',
      title: 'Daily Check-In',
      description: 'Catat kondisi harian, gejala, dan aktivitas untuk tracking yang akurat',
      color: 'from-primary-green to-accent-blue',
    },
    {
      number: '3',
      title: 'AI Analysis',
      description: 'AI Mira menganalisis data Anda dan memberikan insight personal',
      color: 'from-primary-purple to-accent-blue',
    },
    {
      number: '4',
      title: 'Fertility Tracking',
      description: 'Monitor siklus dan masa subur dengan kalender cerdas',
      color: 'from-accent-orange to-accent-yellow',
    },
    {
      number: '5',
      title: 'Misi Pasangan',
      description: 'Lakukan aktivitas bonding untuk memperkuat hubungan',
      color: 'from-primary-pink to-accent-orange',
    },
    {
      number: '6',
      title: 'Komunitas Support',
      description: 'Berbagi cerita dan dapatkan dukungan dari komunitas',
      color: 'from-primary-green to-primary-pink',
    },
  ];

  return (
    <div className="min-h-screen bg-background-soft">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-dark mb-4">Cara Kerja PregCare</h1>
          <p className="text-xl text-text-light max-w-3xl mx-auto">
            6 langkah mudah untuk memulai perjalanan program kehamilan Anda bersama PregCare
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative mb-12 last:mb-0">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-24 bg-gradient-to-b from-primary-pink to-primary-purple opacity-30 hidden md:block"></div>
              )}

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Number Circle */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {step.number}
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white rounded-card shadow-card p-6 hover:shadow-card-hover transition-shadow">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-text-dark mb-2">{step.title}</h3>
                    <p className="text-text-light leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Detail */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-text-dark mb-8 text-center">Fitur Lengkap PregCare</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-card shadow-card p-6">
              <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">AI Smart Companion</h3>
              <p className="text-sm text-text-light">
                Asisten AI yang siap menjawab pertanyaan dan memberikan dukungan 24/7
              </p>
            </div>

            <div className="bg-white rounded-card shadow-card p-6">
              <div className="bg-gradient-to-r from-primary-green to-accent-blue rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">Prediksi Akurat</h3>
              <p className="text-sm text-text-light">
                AI memprediksi masa subur dengan akurasi tinggi berdasarkan data personal Anda
              </p>
            </div>

            <div className="bg-white rounded-card shadow-card p-6">
              <div className="bg-gradient-to-r from-accent-orange to-accent-yellow rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">Dashboard Lengkap</h3>
              <p className="text-sm text-text-light">
                Monitor semua aspek program kehamilan dalam satu dashboard yang intuitif
              </p>
            </div>

            <div className="bg-white rounded-card shadow-card p-6">
              <div className="bg-gradient-to-r from-primary-purple to-accent-blue rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">Gamification</h3>
              <p className="text-sm text-text-light">
                Sistem badge dan achievement untuk memotivasi konsistensi Anda
              </p>
            </div>

            <div className="bg-white rounded-card shadow-card p-6">
              <div className="bg-gradient-to-r from-primary-pink to-accent-orange rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">Privasi Terjamin</h3>
              <p className="text-sm text-text-light">
                Data kesehatan Anda terenkripsi dan dijaga kerahasiaannya
              </p>
            </div>

            <div className="bg-white rounded-card shadow-card p-6">
              <div className="bg-gradient-to-r from-primary-green to-primary-pink rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">Komunitas Aktif</h3>
              <p className="text-sm text-text-light">
                Ribuan pasangan yang saling mendukung dan berbagi pengalaman
              </p>
            </div>
          </div>
        </div>

        {/* How AI Works */}
        <div className="bg-white rounded-card shadow-card p-8 mb-16">
          <h2 className="text-3xl font-bold text-text-dark mb-6 text-center">Bagaimana AI Mira Bekerja?</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-pink/20 flex items-center justify-center text-primary-pink font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-text-dark mb-1">Pengumpulan Data</h4>
                <p className="text-text-light text-sm">
                  AI mengumpulkan data dari daily check-in, tracking siklus, dan aktivitas harian Anda
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-green/20 flex items-center justify-center text-primary-green font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-text-dark mb-1">Analisis Pattern</h4>
                <p className="text-text-light text-sm">
                  Machine learning menganalisis pola siklus dan gejala untuk memahami tubuh Anda lebih baik
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-purple/20 flex items-center justify-center text-primary-purple font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-text-dark mb-1">Personalisasi Insight</h4>
                <p className="text-text-light text-sm">
                  AI memberikan rekomendasi dan insight yang dipersonalisasi untuk kondisi unik Anda
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-text-dark mb-1">Continuous Learning</h4>
                <p className="text-text-light text-sm">
                  Semakin lama digunakan, AI semakin akurat dalam memprediksi dan memberikan saran
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-card p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Mencoba PregCare?</h2>
          <p className="text-lg mb-8 opacity-90">
            Mulai perjalanan Anda hari ini dan rasakan perbedaannya
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-4 bg-white text-primary-pink rounded-button text-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Mulai Gratis
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaraKerja;
