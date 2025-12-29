import { Link } from 'react-router-dom';

const Testimoni = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah & Andi',
      location: 'Jakarta',
      avatar: 'SA',
      story: 'Setelah 8 bulan menggunakan PregCare, kami akhirnya berhasil! Fitur tracking yang akurat dan dukungan dari AI Mira sangat membantu kami memahami siklus dengan lebih baik. Terima kasih PregCare!',
      achievement: 'Berhasil Hamil',
      duration: '8 bulan',
      rating: 5,
    },
    {
      id: 2,
      name: 'Dina & Rama',
      location: 'Bandung',
      avatar: 'DR',
      story: 'Misi pasangan benar-benar game changer! Kami jadi lebih dekat dan komunikasi membaik. Stres berkurang dan 6 bulan kemudian kami mendapat kabar bahagia. PregCare luar biasa!',
      achievement: 'Berhasil Hamil',
      duration: '6 bulan',
      rating: 5,
    },
    {
      id: 3,
      name: 'Putri & Adi',
      location: 'Surabaya',
      avatar: 'PA',
      story: 'AI Mira seperti teman yang selalu ada saat kami butuh motivasi. Daily check-in membantu kami stay consistent. Sekarang kami sedang menunggu kelahiran baby pertama kami!',
      achievement: 'Sedang Hamil',
      duration: '10 bulan',
      rating: 5,
    },
    {
      id: 4,
      name: 'Lina & Budi',
      location: 'Yogyakarta',
      avatar: 'LB',
      story: 'Komunitas PregCare sangat supportif! Berbagi cerita dengan pasangan lain membuat kami tidak merasa sendirian. Setelah 1 tahun, kami akhirnya berhasil!',
      achievement: 'Berhasil Hamil',
      duration: '12 bulan',
      rating: 5,
    },
    {
      id: 5,
      name: 'Maya & Rudi',
      location: 'Medan',
      avatar: 'MR',
      story: 'Fertility tracker dengan AI prediction sangat akurat. Kami bisa planning dengan lebih baik dan 5 bulan kemudian test pack menunjukkan 2 garis! Alhamdulillah!',
      achievement: 'Berhasil Hamil',
      duration: '5 bulan',
      rating: 5,
    },
    {
      id: 6,
      name: 'Siti & Haris',
      location: 'Makassar',
      avatar: 'SH',
      story: 'Dashboard yang lengkap membuat kami mudah monitor progress. Tips dari AI Mira juga sangat membantu. 9 bulan menggunakan PregCare dan sekarang kami sedang menanti kelahiran!',
      achievement: 'Sedang Hamil',
      duration: '9 bulan',
      rating: 5,
    },
  ];

  const stats = [
    { number: '2,847', label: 'Pasangan Aktif' },
    { number: '342', label: 'Success Stories' },
    { number: '88%', label: 'Tingkat Keberhasilan' },
    { number: '4.9/5', label: 'Rating Pengguna' },
  ];

  return (
    <div className="min-h-screen bg-background-soft">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-dark mb-4">Testimoni & Success Stories</h1>
          <p className="text-xl text-text-light max-w-3xl mx-auto">
            Cerita inspiratif dari ribuan pasangan yang telah mewujudkan impian mereka bersama PregCare
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-card shadow-card p-6 text-center">
              <div className="text-3xl font-bold text-primary-pink mb-1">{stat.number}</div>
              <div className="text-sm text-text-light">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-card shadow-card p-6 hover:shadow-card-hover transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-pink to-primary-purple flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">{testimonial.name}</h3>
                    <p className="text-sm text-text-light">{testimonial.location}</p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent-yellow" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Story */}
              <p className="text-text-light text-sm leading-relaxed mb-4">
                "{testimonial.story}"
              </p>

              {/* Achievement Badge */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-primary-green">{testimonial.achievement}</span>
                </div>
                <span className="text-sm text-text-light">{testimonial.duration}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonials */}
        <div className="bg-white rounded-card shadow-card p-8 mb-16">
          <h2 className="text-3xl font-bold text-text-dark mb-8 text-center">Video Testimoni</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((video) => (
              <div key={video} className="aspect-video bg-gradient-to-br from-primary-pink/10 to-primary-purple/10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary-pink" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-light">Video Testimoni #{video}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-gradient-to-br from-primary-pink/5 to-primary-purple/5 rounded-card p-8 mb-16">
          <h2 className="text-3xl font-bold text-text-dark mb-8 text-center">
            Apa yang Membuat PregCare Berbeda?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-pink flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-1">AI yang Akurat</h3>
                <p className="text-sm text-text-light">
                  Prediksi masa subur dengan akurasi 88% berdasarkan data personal
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-green flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-1">Dukungan 24/7</h3>
                <p className="text-sm text-text-light">
                  AI Mira siap membantu dan memberikan motivasi kapan saja
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-purple flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-1">Komunitas Aktif</h3>
                <p className="text-sm text-text-light">
                  Ribuan pasangan yang saling support dan berbagi pengalaman
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-blue flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-dark mb-1">Holistik Approach</h3>
                <p className="text-sm text-text-light">
                  Tidak hanya tracking, tapi juga mental health dan bonding pasangan
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-card p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Wujudkan Impian Anda Bersama PregCare</h2>
          <p className="text-lg mb-8 opacity-90">
            Bergabunglah dengan ribuan pasangan yang telah berhasil
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

export default Testimoni;
