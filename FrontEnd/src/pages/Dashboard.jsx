import { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [streak, setStreak] = useState(7);
  const [missionProgress, setMissionProgress] = useState({ current: 12, total: 15 });
  const [cycleDay, setCycleDay] = useState(10);
  const [ovulationDays, setOvulationDays] = useState(5);

  const tasks = [
    { id: 1, name: 'Daily Check-In', completed: true, icon: '✅', link: '/daily-checkin' },
    { id: 2, name: 'Catat Gejala Harian', completed: true, icon: '✅', link: '/fertility-tracker' },
    { id: 3, name: 'Peluk Pasangan', completed: false, icon: '⭕', link: '/misi-pasangan' },
    { id: 4, name: 'Chat dengan AI', completed: false, icon: '⭕', link: '/ai-assistant' },
  ];

  const achievements = [
    { name: 'Love Champion', icon: '🏆', color: 'from-accent-yellow to-accent-orange' },
    { name: 'Weekly Warrior', icon: '🎖️', color: 'from-primary-pink to-primary-purple' },
    { name: 'Consistent Star', icon: '⭐', color: 'from-accent-blue to-primary-green' },
  ];

  const aiInsights = [
    {
      title: 'Masa Subur Segera Tiba!',
      description: 'Ovulasi diprediksi dalam 5 hari lagi Ini waktu optimal untuk program hamil',
      icon: '📅',
    },
    {
      title: 'Konsistensi Luar Biasa!',
      description: 'Kamu sudah check-in 7 hari berturut-turut. Keep it up!',
      icon: '🔥',
    },
    {
      title: 'Misi Pasangan Minggu Ini',
      description: 'Jangan lupa date night mingguan dengan pasangan ya!',
      icon: '❤️',
    },
  ];

  return (
    <div className="min-h-screen bg-background-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Greeting Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark mb-2">
            Halo, Papi & Mami! 👋
          </h1>
          <p className="text-text-light">
            Semangat memulai hari dengan penuh harapan ❤️
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Kesuburan Card */}
            <div className="bg-white rounded-card shadow-card p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">💓</span>
                <h2 className="text-xl font-semibold text-text-dark">Status Kesuburan</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary-pink/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary-pink mb-1">Hari ke-{cycleDay}</div>
                  <div className="text-sm text-text-light">Hari Siklus</div>
                </div>
                <div className="text-center p-4 bg-primary-purple/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary-purple mb-1">{ovulationDays} hari</div>
                  <div className="text-sm text-text-light">Ovulasi Dalam</div>
                </div>
                <div className="text-center p-4 bg-primary-green/10 rounded-lg">
                  <div className="text-2xl mb-1">📈</div>
                  <div className="text-sm text-text-light">Peluang Meningkat</div>
                </div>
              </div>
            </div>

            {/* Tugas Hari Ini */}
            <div className="bg-white rounded-card shadow-card p-6">
              <h2 className="text-xl font-semibold text-text-dark mb-4">Tugas Hari Ini</h2>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                      task.completed
                        ? 'bg-primary-green/10 border border-primary-green/20'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{task.icon}</span>
                      <span className={task.completed ? 'text-text-dark' : 'text-text-light'}>
                        {task.name}
                      </span>
                    </div>
                    {!task.completed && (
                      <Link 
                        to={task.link}
                        className="px-4 py-2 bg-gradient-to-r from-primary-pink to-primary-purple text-white rounded-button text-sm font-medium hover:shadow-lg transition-shadow"
                      >
                        Mulai
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Streak & Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Streak Card */}
              <div className="bg-gradient-to-br from-accent-orange to-accent-yellow rounded-card shadow-card p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">🔥</span>
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    Streak
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1">{streak} hari</div>
                <div className="text-sm opacity-90">Berturut-turut! Luar biasa!</div>
              </div>

              {/* Progress Misi */}
              <div className="bg-gradient-to-br from-primary-green to-accent-blue rounded-card shadow-card p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl">❤️</span>
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    Progress Misi
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1">
                  {missionProgress.current}/{missionProgress.total}
                </div>
                <div className="text-sm opacity-90">Hampir selesai minggu ini!</div>
              </div>
            </div>

            {/* Pencapaian Terbaru */}
            <div className="bg-white rounded-card shadow-card p-6">
              <h2 className="text-xl font-semibold text-text-dark mb-4">Pencapaian Terbaru</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-lg bg-gradient-to-br ${achievement.color} text-white text-center`}
                  >
                    <div className="text-5xl mb-3">{achievement.icon}</div>
                    <div className="font-semibold">{achievement.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - AI Insights & Quick Actions */}
          <div className="space-y-6">
            {/* AI Insights Panel */}
            <div className="bg-gradient-to-br from-primary-pink to-primary-purple rounded-card shadow-card p-6 text-white">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">✨</span>
                <h2 className="text-xl font-semibold">AI Insights</h2>
              </div>
              <div className="space-y-4">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{insight.icon}</span>
                      <div>
                        <h3 className="font-semibold mb-1">{insight.title}</h3>
                        <p className="text-sm opacity-90">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-card shadow-card p-6">
              <h2 className="text-xl font-semibold text-text-dark mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/daily-checkin"
                  className="block w-full bg-gradient-to-r from-primary-pink to-primary-purple text-white p-4 rounded-button text-center font-medium hover:shadow-lg transition-shadow"
                >
                  Mulai Check-In
                </Link>
                <Link
                  to="/ai-assistant"
                  className="block w-full bg-gradient-to-r from-primary-green to-accent-blue text-white p-4 rounded-button text-center font-medium hover:shadow-lg transition-shadow"
                >
                  Chat dengan AI
                </Link>
                <Link
                  to="/fertility-tracker"
                  className="block w-full bg-gradient-to-r from-primary-purple to-accent-blue text-white p-4 rounded-button text-center font-medium hover:shadow-lg transition-shadow"
                >
                  Lihat Tracker
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
