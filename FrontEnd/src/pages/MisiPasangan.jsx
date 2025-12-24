import { useState } from 'react';

const MisiPasangan = () => {
  const [weekProgress, setWeekProgress] = useState({ current: 12, total: 15, week: 6 });

  const badges = [
    { name: 'Love Champion', icon: '🏆', color: 'from-accent-yellow to-accent-orange', unlocked: true },
    { name: 'Weekly Warrior', icon: '🎖️', color: 'from-primary-pink to-primary-purple', unlocked: true },
    { name: 'Heart Keeper', icon: '❤️', color: 'from-gray-300 to-gray-400', unlocked: false },
    { name: 'Star Couple', icon: '⭐', color: 'from-gray-300 to-gray-400', unlocked: false },
  ];

  const [missions, setMissions] = useState([
    {
      id: 1,
      title: 'Peluk Pasanganmu Hari Ini',
      description: 'Pelukan hangat dapat meningkatkan bonding',
      icon: '💖',
      color: 'from-pink-100 to-pink-50',
      completed: true,
    },
    {
      id: 2,
      title: 'Sarapan Bersama',
      description: 'Mulai hari dengan kebersamaan',
      icon: '☕',
      color: 'from-yellow-100 to-yellow-50',
      completed: false,
    },
    {
      id: 3,
      title: 'Ucapkan 3 Hal Baik',
      description: 'Apresiasi pasangan dengan kata-kata positif',
      icon: '💬',
      color: 'from-purple-100 to-purple-50',
      completed: false,
    },
    {
      id: 4,
      title: 'Dengarkan Musik Bersama',
      description: 'Buat playlist spesial untuk kalian berdua',
      icon: '🎵',
      color: 'from-green-100 to-green-50',
      completed: false,
    },
    {
      id: 5,
      title: 'Foto Selfie Berdua',
      description: 'Abadikan momen kebersamaan hari ini',
      icon: '📷',
      color: 'from-blue-100 to-blue-50',
      completed: false,
    },
    {
      id: 6,
      title: 'Date Night Mingguan',
      description: 'Luangkan waktu khusus untuk pasangan',
      icon: '❤️',
      color: 'from-pink-100 to-pink-50',
      completed: false,
    },
  ]);

  const handleMissionStart = (missionId) => {
    setMissions(
      missions.map((mission) =>
        mission.id === missionId ? { ...mission, completed: true } : mission
      )
    );
    setWeekProgress({ ...weekProgress, current: weekProgress.current + 1 });
  };

  const progressPercentage = (weekProgress.current / weekProgress.total) * 100;

  return (
    <div className="min-h-screen bg-background-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-primary-pink to-primary-purple rounded-full p-4 mb-4">
            <span className="text-4xl">❤️</span>
          </div>
          <h1 className="text-3xl font-bold text-text-dark mb-2">Misi Pasangan Harian</h1>
          <p className="text-text-light">Perkuat bonding dengan pasangan melalui aktivitas seru</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Missions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-card shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-dark">Progress Minggu Ini</h2>
                <span className="text-sm text-text-light">
                  1 dari {weekProgress.week} misi selesai
                </span>
              </div>
              <div className="relative">
                <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-pink to-primary-purple transition-all duration-500 flex items-center justify-end pr-3"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <span className="text-xs text-white font-bold">
                      {weekProgress.current}/{weekProgress.total}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-text-light mt-2 text-right">
                  {progressPercentage.toFixed(0)}% selesai
                </p>
              </div>
            </div>

            {/* Missions Header */}
            <div>
              <h2 className="text-2xl font-semibold text-text-dark mb-4">Misi Hari Ini</h2>
            </div>

            {/* Mission Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className={`bg-gradient-to-br ${mission.color} rounded-card shadow-card p-6 relative overflow-hidden ${
                    mission.completed ? 'opacity-75' : ''
                  }`}
                >
                  {mission.completed && (
                    <div className="absolute top-4 right-4 bg-primary-green text-white rounded-full w-8 h-8 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                  <div className="text-5xl mb-4">{mission.icon}</div>
                  <h3 className="font-semibold text-text-dark mb-2">{mission.title}</h3>
                  <p className="text-sm text-text-light mb-4">{mission.description}</p>
                  {!mission.completed ? (
                    <button
                      onClick={() => handleMissionStart(mission.id)}
                      className="w-full bg-white hover:bg-gray-50 text-text-dark font-medium py-2 px-4 rounded-button transition-colors border border-gray-200"
                    >
                      Mulai
                    </button>
                  ) : (
                    <div className="w-full bg-primary-green/20 text-primary-green font-medium py-2 px-4 rounded-button text-center">
                      Selesai ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Badges & Info */}
          <div className="space-y-6">
            {/* Badge Collection */}
            <div className="bg-white rounded-card shadow-card p-6">
              <h2 className="text-xl font-semibold text-text-dark mb-4">Badge Koleksi</h2>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg bg-gradient-to-br ${badge.color} text-white text-center ${
                      !badge.unlocked ? 'grayscale opacity-50' : ''
                    }`}
                  >
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <div className="text-xs font-semibold">{badge.name}</div>
                    {badge.unlocked && (
                      <div className="text-xs mt-1 opacity-80">Unlocked</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-primary-purple/10 to-primary-pink/10 rounded-card p-6">
              <div className="flex items-start space-x-3 mb-4">
                <span className="text-3xl">💡</span>
                <div>
                  <h3 className="font-semibold text-text-dark mb-2">Tips Hari Ini</h3>
                  <p className="text-sm text-text-light">
                    Komunikasi adalah kunci! Luangkan 15 menit setiap hari untuk berbicara tentang
                    perasaan dan rencana kalian berdua.
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-white rounded-card shadow-card p-6">
              <h2 className="text-lg font-semibold text-text-dark mb-4">Statistik Bulanan</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-light">Check-in Harian</span>
                    <span className="font-semibold text-primary-pink">28/30</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-pink to-primary-purple"
                      style={{ width: '93%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-light">Konsistensi</span>
                    <span className="font-semibold text-primary-green">95%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-green"
                      style={{ width: '95%' }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-light">Akurasi Prediksi</span>
                    <span className="font-semibold text-accent-blue">88%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-blue"
                      style={{ width: '88%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisiPasangan;
