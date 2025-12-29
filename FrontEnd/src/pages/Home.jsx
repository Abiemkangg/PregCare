import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-background-soft">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-text-dark mb-4">
            Wujudkan Impian Keluarga Bahagia
          </h1>
          <p className="text-xl text-text-light mb-8 max-w-2xl mx-auto">
            Platform AI-powered untuk mendampingi perjalanan kehamilan Anda dengan PregCare. Ditentramkan AI untuk memahami siklus tubuhmu, membangun bonding dengan pasangan, dan menemukan komunitas yang mendukung.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/dashboard" className="px-8 py-4 bg-gradient-to-r from-primary-pink to-primary-purple text-white rounded-button text-lg font-semibold hover:shadow-lg transition-shadow">
              Mulai Program
            </Link>
            <Link to="/ai-assistant" className="px-8 py-4 bg-white text-text-dark rounded-button text-lg font-semibold hover:shadow-lg transition-shadow border-2 border-gray-200">
              Chat dengan AI
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Feature 1 */}
          <Link to="/ai-assistant" className="bg-white rounded-card shadow-card p-8 hover:shadow-card-hover transition-shadow cursor-pointer">
            <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">AI Smart Companion</h3>
            <p className="text-text-light">
              Teman AI yang memahami dan memberikan dukungan personal
            </p>
          </Link>

          {/* Feature 2 */}
          <Link to="/daily-checkin" className="bg-white rounded-card shadow-card p-8 hover:shadow-card-hover transition-shadow cursor-pointer">
            <div className="bg-gradient-to-r from-primary-green to-accent-blue rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">Daily Check-In</h3>
            <p className="text-text-light">
              Catat kondisi harian dan dapatkan insight AI tentang kesuburanmu
            </p>
          </Link>

          {/* Feature 3 */}
          <Link to="/misi-pasangan" className="bg-white rounded-card shadow-card p-8 hover:shadow-card-hover transition-shadow cursor-pointer">
            <div className="bg-gradient-to-r from-primary-pink to-accent-orange rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">Misi Pasangan</h3>
            <p className="text-text-light">
              Aktivitas seru untuk mempercepat bonding dengan pasangan
            </p>
          </Link>

          {/* Feature 4 */}
          <Link to="/fertility-tracker" className="bg-white rounded-card shadow-card p-8 hover:shadow-card-hover transition-shadow cursor-pointer">
            <div className="bg-gradient-to-r from-primary-purple to-accent-blue rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">Fertility Tracker</h3>
            <p className="text-text-light">
              Pantau siklus dan masa subur dengan prediksi AI
            </p>
          </Link>

          {/* Feature 5 */}
          <Link to="/komunitas" className="bg-white rounded-card shadow-card p-8 hover:shadow-card-hover transition-shadow cursor-pointer">
            <div className="bg-gradient-to-r from-accent-yellow to-accent-orange rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">Komunitas Cerita</h3>
            <p className="text-text-light">
              Berbagi pengalaman dengan komunitas yang supportif
            </p>
          </Link>

          {/* Feature 6 */}
          <Link to="/dashboard" className="bg-white rounded-card shadow-card p-8 hover:shadow-card-hover transition-shadow cursor-pointer">
            <div className="bg-gradient-to-r from-primary-green to-primary-purple rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">Dashboard</h3>
            <p className="text-text-light">
              Monitor progress dan achievement dalam satu tempat
            </p>
          </Link>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-card p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Perjalanan?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Bergabung dengan ribuan pasangan yang telah mewujudkan impian memiliki buah hati dengan dukungan teknologi dan komunitas yang hangat.
          </p>
          <Link to="/dashboard" className="inline-block px-8 py-4 bg-white text-primary-pink rounded-button text-lg font-semibold hover:shadow-lg transition-shadow">
            Mulai Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
