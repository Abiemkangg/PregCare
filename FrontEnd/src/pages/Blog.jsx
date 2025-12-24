const Blog = () => {
  const articles = [
    {
      id: 1,
      title: 'Tips Meningkatkan Kesuburan Secara Alami',
      excerpt: 'Panduan lengkap tentang cara meningkatkan kesuburan melalui pola hidup sehat, nutrisi yang tepat, dan manajemen stres.',
      category: 'Tips Kesehatan',
      date: '15 Nov 2024',
      readTime: '5 min',
      image: '🌱',
      author: 'Dr. Sarah Wellness',
    },
    {
      id: 2,
      title: 'Memahami Siklus Menstruasi dan Masa Subur',
      excerpt: 'Pelajari cara mengenali tanda-tanda masa subur dan bagaimana tracking siklus dapat membantu program kehamilan Anda.',
      category: 'Edukasi',
      date: '12 Nov 2024',
      readTime: '7 min',
      image: '📅',
      author: 'Dr. Budi Fertility',
    },
    {
      id: 3,
      title: 'Pentingnya Dukungan Pasangan dalam Program Hamil',
      excerpt: 'Bagaimana komunikasi dan dukungan emosional dari pasangan dapat meningkatkan peluang keberhasilan program kehamilan.',
      category: 'Psikologi',
      date: '10 Nov 2024',
      readTime: '6 min',
      image: '❤️',
      author: 'Psikolog Linda',
    },
    {
      id: 4,
      title: 'Nutrisi Terbaik untuk Program Kehamilan',
      excerpt: 'Daftar makanan dan suplemen yang direkomendasikan untuk meningkatkan kesuburan dan mempersiapkan kehamilan yang sehat.',
      category: 'Nutrisi',
      date: '8 Nov 2024',
      readTime: '8 min',
      image: '🥗',
      author: 'Nutritionist Rina',
    },
    {
      id: 5,
      title: 'Mengatasi Stres dalam Program Kehamilan',
      excerpt: 'Teknik relaksasi dan manajemen stres yang terbukti efektif untuk pasangan yang sedang menjalani program kehamilan.',
      category: 'Mental Health',
      date: '5 Nov 2024',
      readTime: '6 min',
      image: '🧘',
      author: 'Psikolog Linda',
    },
    {
      id: 6,
      title: 'Olahraga yang Aman untuk Meningkatkan Kesuburan',
      excerpt: 'Jenis-jenis olahraga yang dapat membantu meningkatkan kesuburan tanpa memberikan tekanan berlebihan pada tubuh.',
      category: 'Fitness',
      date: '2 Nov 2024',
      readTime: '5 min',
      image: '🏃',
      author: 'Coach Fitri',
    },
  ];

  const categories = ['Semua', 'Tips Kesehatan', 'Edukasi', 'Psikologi', 'Nutrisi', 'Mental Health', 'Fitness'];

  return (
    <div className="min-h-screen bg-background-soft">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-dark mb-4">Blog PregCare</h1>
          <p className="text-xl text-text-light max-w-3xl mx-auto">
            Artikel, tips, dan panduan lengkap seputar program kehamilan dari para ahli
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-primary-pink to-primary-purple text-white shadow-lg'
                  : 'bg-white text-text-dark hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <div className="bg-white rounded-card shadow-card overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-video md:aspect-auto bg-gradient-to-br from-primary-pink/20 to-primary-purple/20 flex items-center justify-center">
              <span className="text-9xl">🌟</span>
            </div>
            <div className="p-8">
              <span className="inline-block px-3 py-1 bg-accent-yellow/20 text-accent-orange rounded-full text-sm font-medium mb-3">
                Featured
              </span>
              <h2 className="text-3xl font-bold text-text-dark mb-3">
                Panduan Lengkap Program Kehamilan untuk Pemula
              </h2>
              <p className="text-text-light mb-4 leading-relaxed">
                Mulai perjalanan program kehamilan Anda dengan panduan komprehensif ini. Pelajari semua yang perlu Anda ketahui dari persiapan hingga tips sukses.
              </p>
              <div className="flex items-center justify-between text-sm text-text-light mb-4">
                <span>Dr. Sarah Wellness</span>
                <span>15 min read</span>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-primary-pink to-primary-purple text-white rounded-button font-medium hover:shadow-lg transition-shadow">
                Baca Selengkapnya
              </button>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-card shadow-card overflow-hidden hover:shadow-card-hover transition-shadow">
              {/* Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary-pink/10 to-primary-purple/10 flex items-center justify-center">
                <span className="text-6xl">{article.image}</span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-primary-pink px-3 py-1 bg-primary-pink/10 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-text-light">{article.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-text-dark mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-sm text-text-light mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-pink to-primary-purple flex items-center justify-center text-white text-xs">
                      {article.author.charAt(0)}
                    </div>
                    <div className="text-xs">
                      <div className="font-medium text-text-dark">{article.author}</div>
                      <div className="text-text-light">{article.date}</div>
                    </div>
                  </div>
                  <button className="text-primary-pink hover:text-primary-purple transition-colors">
                    →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-card p-12 text-white text-center mt-16">
          <h2 className="text-3xl font-bold mb-4">Subscribe Newsletter Kami</h2>
          <p className="text-lg mb-8 opacity-90">
            Dapatkan tips dan artikel terbaru langsung ke email Anda
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="flex-1 px-6 py-3 rounded-l-button text-text-dark focus:outline-none"
            />
            <button className="px-8 py-3 bg-white text-primary-pink rounded-r-button font-semibold hover:shadow-lg transition-shadow">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
