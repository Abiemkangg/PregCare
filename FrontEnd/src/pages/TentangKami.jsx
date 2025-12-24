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
              <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-2xl font-bold text-text-dark mb-4">Misi Kami</h2>
            <p className="text-text-light leading-relaxed">
              Membantu setiap pasangan mewujudkan impian memiliki buah hati dengan menyediakan platform komprehensif yang menggabungkan teknologi AI, edukasi kesehatan reproduksi, dan dukungan komunitas yang hangat.
            </p>
          </div>

          <div className="bg-white rounded-card shadow-card p-8">
            <div className="bg-gradient-to-r from-primary-green to-accent-blue rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <span className="text-3xl">👁️</span>
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
              <span className="text-5xl mb-4 block">❤️</span>
              <h3 className="text-xl font-semibold text-text-dark mb-2">Empati</h3>
              <p className="text-sm text-text-light">
                Memahami dan merasakan setiap tantangan yang Anda hadapi
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-green/10 to-accent-blue/10 rounded-card p-6 text-center">
              <span className="text-5xl mb-4 block">🔬</span>
              <h3 className="text-xl font-semibold text-text-dark mb-2">Inovasi</h3>
              <p className="text-sm text-text-light">
                Menggunakan teknologi terkini untuk solusi terbaik
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent-orange/10 to-accent-yellow/10 rounded-card p-6 text-center">
              <span className="text-5xl mb-4 block">🤝</span>
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
              { role: 'Medical Advisor', icon: '👨‍⚕️' },
              { role: 'AI Engineer', icon: '👨‍💻' },
              { role: 'Psikolog', icon: '👩‍⚕️' },
              { role: 'Product Designer', icon: '🎨' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-3">{member.icon}</div>
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
