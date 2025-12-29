import { Link } from 'react-router-dom';

const TentangKami = () => {
  return (
    <div className="min-h-screen bg-background-soft">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-dark mb-4">Tentang PregCare</h1>
          <p className="text-xl text-text-light max-w-3xl mx-auto">
            Platform AI-powered yang mendampingi perjalanan kehamilan Anda dengan teknologi dan komunitas yang hangat
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-card shadow-card p-8">
            <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-dark mb-4">Misi Kami</h2>
            <p className="text-text-light leading-relaxed">
              Membantu setiap pasangan mewujudkan impian memiliki buah hati dengan menyediakan platform komprehensif yang menggabungkan teknologi AI, edukasi kesehatan reproduksi, dan dukungan komunitas yang hangat.
            </p>
          </div>

          <div className="bg-white rounded-card shadow-card p-8">
            <div className="bg-gradient-to-r from-primary-green to-accent-blue rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-text-dark mb-4">Visi Kami</h2>
            <p className="text-text-light leading-relaxed">
              Menjadi platform terdepan dalam mendukung program kehamilan di Indonesia, di mana setiap pasangan merasa didukung, terinformasi, dan diberdayakan dalam perjalanan mereka menuju kebahagiaan keluarga.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-card shadow-card p-8 mb-16">
          <h2 className="text-3xl font-bold text-text-dark mb-6 text-center">Cerita Kami</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-text-light leading-relaxed">
            <p>
              PregCare lahir dari pemahaman mendalam tentang tantangan yang dihadapi pasangan dalam program kehamilan. Kami tahu bahwa perjalanan ini tidak hanya tentang aspek medis, tetapi juga tentang dukungan emosional, informasi yang tepat, dan komunitas yang peduli.
            </p>
            <p>
              Dengan menggabungkan teknologi AI terkini dan pendekatan human-centered, kami menciptakan platform yang tidak hanya membantu tracking siklus kesuburan, tetapi juga memberikan dukungan holistik untuk kesehatan fisik dan mental pasangan.
            </p>
            <p>
              Setiap fitur dalam PregCare dirancang dengan hati-hati berdasarkan riset mendalam dan feedback dari ribuan pasangan yang telah menggunakan platform kami. Kami percaya bahwa setiap pasangan berhak mendapatkan dukungan terbaik dalam mewujudkan impian mereka.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-text-dark mb-8 text-center">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary-pink/10 to-primary-purple/10 rounded-card p-6 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-primary-pink" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-2">Empati</h3>
              <p className="text-sm text-text-light">
                Memahami dan merasakan setiap tantangan yang Anda hadapi
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-green/10 to-accent-blue/10 rounded-card p-6 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-2">Inovasi</h3>
              <p className="text-sm text-text-light">
                Menggunakan teknologi terkini untuk solusi terbaik
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent-orange/10 to-accent-yellow/10 rounded-card p-6 text-center">
              <div className="flex justify-center mb-4">
                <svg className="w-12 h-12 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-2">Komunitas</h3>
              <p className="text-sm text-text-light">
                Membangun lingkungan yang saling mendukung dan menguatkan
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white rounded-card shadow-card p-8 mb-16">
          <h2 className="text-3xl font-bold text-text-dark mb-8 text-center">Tim Kami</h2>
          <p className="text-center text-text-light mb-8 max-w-2xl mx-auto">
            Tim multidisiplin yang terdiri dari ahli kesehatan reproduksi, AI engineers, psikolog, dan product designers yang berdedikasi untuk kesuksesan Anda.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { role: 'Medical Advisor', color: 'from-primary-pink to-primary-purple' },
              { role: 'AI Engineer', color: 'from-primary-green to-accent-blue' },
              { role: 'Psikolog', color: 'from-accent-orange to-accent-yellow' },
              { role: 'Product Designer', color: 'from-primary-purple to-primary-pink' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${member.color}`}></div>
                <h4 className="font-semibold text-text-dark">{member.role}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-card p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Siap Memulai Perjalanan Bersama Kami?</h2>
          <p className="text-lg mb-8 opacity-90">
            Bergabunglah dengan ribuan pasangan yang telah mempercayai PregCare
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-8 py-4 bg-white text-primary-pink rounded-button text-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Mulai Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TentangKami;
