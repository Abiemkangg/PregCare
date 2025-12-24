import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white mt-16 border-t border-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-full p-2">
                <span className="text-white text-xl">❤️</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-pink to-primary-purple bg-clip-text text-transparent">
                PregCare
              </span>
            </div>
            <p className="text-text-light text-sm mb-4">
              Platform AI-powered untuk mendampingi perjalanan kehamilan Anda. Wujudkan impian memiliki buah hati dengan dukungan teknologi dan komunitas yang hangat.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <a href="mailto:abiemakmal31@gmail.com" className="text-text-light hover:text-primary-pink">
                  abiemakmal31@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <a href="tel:+6282254355447" className="text-text-light hover:text-primary-pink">
                  +62 822-5435-5447
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span className="text-text-light">Balikpapan, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/tentang-kami" className="text-text-light hover:text-primary-pink">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link to="/cara-kerja" className="text-text-light hover:text-primary-pink">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-text-light hover:text-primary-pink">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h3 className="font-semibold text-text-dark mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pusat-bantuan" className="text-text-light hover:text-primary-pink">
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-text-light hover:text-primary-pink">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/hubungi-kami" className="text-text-light hover:text-primary-pink">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-text-light hover:text-primary-pink">
                  Privacy Policy
                </Link>
              </li>
            </ul>

            <h3 className="font-semibold text-text-dark mb-4 mt-6">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/panduan-kesuburan" className="text-text-light hover:text-primary-pink">
                  Panduan Kesuburan
                </Link>
              </li>
              <li>
                <Link to="/tips-artikel" className="text-text-light hover:text-primary-pink">
                  Tips & Artikel
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-text-light hover:text-primary-pink">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/webinar" className="text-text-light hover:text-primary-pink">
                  Webinar
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-primary-pink/10 to-primary-purple/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-text-dark mb-1">
                ❤️ Dapatkan Tips Kesuburan
              </h3>
              <p className="text-sm text-text-light">
                Subscribe newsletter kami untuk tips, artikel, dan update terbaru seputar program kehamilan
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="px-4 py-2 rounded-l-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-pink w-full md:w-64"
              />
              <button className="bg-gradient-to-r from-primary-pink to-primary-purple text-white px-6 py-2 rounded-r-lg font-medium hover:shadow-lg transition-shadow">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-text-light mb-4 md:mb-0">
            © 2025 PregCare. All rights reserved. Made with ❤️ for every couple's dream.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-pink to-primary-purple flex items-center justify-center text-white hover:shadow-lg transition-shadow"
            >
              📷
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-purple to-accent-blue flex items-center justify-center text-white hover:shadow-lg transition-shadow"
            >
              👥
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-blue to-primary-green flex items-center justify-center text-white hover:shadow-lg transition-shadow"
            >
              🐦
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
