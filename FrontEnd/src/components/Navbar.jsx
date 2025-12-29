import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsMenuOpen(false);
    navigate('/');
  };
  
  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'AI Assistant', path: '/ai-assistant' },
    { name: 'Daily Check-In', path: '/daily-checkin' },
    { name: 'Misi Pasangan', path: '/misi-pasangan' },
    { name: 'Fertility Tracker', path: '/fertility-tracker' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-full p-2">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-pink to-primary-purple bg-clip-text text-transparent">
              PregCare
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-primary-pink text-white'
                    : 'text-text-dark hover:bg-background-soft'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm text-text-muted">
                  Hi, {user.full_name ? user.full_name.split(' ')[0] : user.username || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-pink rounded-lg text-sm font-medium hover:bg-pink-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-primary-pink to-primary-purple text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-background-soft"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-2 pb-4">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center ${
                    location.pathname === item.path
                      ? 'bg-primary-pink text-white'
                      : 'text-text-dark hover:bg-background-soft'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile User Menu */}
              <div className="border-t border-gray-100 mt-2 pt-2">
                {user ? (
                  <div className="px-4 py-2">
                    <p className="text-sm text-text-muted mb-2">
                      Hi, {user.full_name ? user.full_name.split(' ')[0] : user.username || 'User'}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 px-4">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-center text-primary-pink border border-primary-pink rounded-lg text-sm font-medium hover:bg-pink-50 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-center bg-gradient-to-r from-primary-pink to-primary-purple text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
                    >
                      Daftar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
