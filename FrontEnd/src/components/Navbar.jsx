import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };
  
  const navItems = [
    { name: 'Beranda', path: '/', icon: '🏠' },
    { name: 'AI Assistant', path: '/ai-assistant', icon: '🤖' },
    { name: 'Daily Check-In', path: '/daily-checkin', icon: '📋' },
    { name: 'Misi Pasangan', path: '/misi-pasangan', icon: '❤️' },
    { name: 'Fertility Tracker', path: '/fertility-tracker', icon: '📊' },
    { name: 'Dashboard', path: '/dashboard', icon: '📱' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-full p-2">
              <span className="text-white text-xl">❤️</span>
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
                <span className="mr-1">{item.icon}</span>
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
          <button className="md:hidden p-2 rounded-lg hover:bg-background-soft">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
