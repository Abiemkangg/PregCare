import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AIAssistant from './pages/AIAssistant';
import DailyCheckIn from './pages/DailyCheckIn';
import MisiPasangan from './pages/MisiPasangan';
import FertilityTracker from './pages/FertilityTracker';
import Login from './pages/Login';
import Register from './pages/Register';
import TentangKami from './pages/TentangKami';
import CaraKerja from './pages/CaraKerja';
import Testimoni from './pages/Testimoni';
import Blog from './pages/Blog';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/daily-checkin" element={<DailyCheckIn />} />
            <Route path="/misi-pasangan" element={<MisiPasangan />} />
            <Route path="/fertility-tracker" element={<FertilityTracker />} />
            <Route path="/tentang-kami" element={<TentangKami />} />
            <Route path="/cara-kerja" element={<CaraKerja />} />
            <Route path="/testimoni" element={<Testimoni />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
