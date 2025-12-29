/**
 * Misi Pasangan Component
 * Modern UI with Framer Motion animations and progress tracking
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge } from '../components/ui';
import { ProgressBar, CircularProgress } from '../components/ui/ProgressBar';
import {
  HeartIcon,
  TrophyIcon,
  StarIcon,
  CheckCircleIcon,
  FlameIcon,
  GiftIcon,
  UsersIcon,
  SparklesIcon,
  LightbulbIcon,
  ChartIcon,
} from '../components/ui/Icons';

const MisiPasangan = () => {
  const [weekProgress, setWeekProgress] = useState({ current: 12, total: 15, week: 6 });
  const [activeTab, setActiveTab] = useState('today');
  const [showCelebration, setShowCelebration] = useState(false);

  const [missions, setMissions] = useState([
    {
      id: 1,
      title: 'Peluk Pasanganmu Hari Ini',
      description: 'Pelukan hangat dapat meningkatkan bonding dan mengurangi stres',
      category: 'bonding',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      icon: HeartIcon,
      completed: true,
      points: 10,
    },
    {
      id: 2,
      title: 'Sarapan Bersama',
      description: 'Mulai hari dengan kebersamaan yang hangat',
      category: 'quality-time',
      color: 'from-amber-400 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      icon: GiftIcon,
      completed: false,
      points: 15,
    },
    {
      id: 3,
      title: 'Ucapkan 3 Hal Baik',
      description: 'Apresiasi pasangan dengan kata-kata positif dan tulus',
      category: 'communication',
      color: 'from-violet-400 to-purple-500',
      bgColor: 'from-violet-50 to-purple-50',
      icon: SparklesIcon,
      completed: false,
      points: 10,
    },
    {
      id: 4,
      title: 'Dengarkan Musik Bersama',
      description: 'Buat playlist spesial untuk kalian berdua',
      category: 'fun',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      icon: StarIcon,
      completed: false,
      points: 10,
    },
    {
      id: 5,
      title: 'Foto Selfie Berdua',
      description: 'Abadikan momen kebersamaan hari ini',
      category: 'memory',
      color: 'from-sky-400 to-blue-500',
      bgColor: 'from-sky-50 to-blue-50',
      icon: UsersIcon,
      completed: false,
      points: 10,
    },
    {
      id: 6,
      title: 'Date Night Mingguan',
      description: 'Luangkan waktu khusus untuk quality time bersama',
      category: 'quality-time',
      color: 'from-fuchsia-400 to-pink-500',
      bgColor: 'from-fuchsia-50 to-pink-50',
      icon: HeartIcon,
      completed: false,
      points: 25,
    },
  ]);

  const handleMissionComplete = (missionId) => {
    setMissions(
      missions.map((mission) =>
        mission.id === missionId ? { ...mission, completed: true } : mission
      )
    );
    setWeekProgress({ ...weekProgress, current: weekProgress.current + 1 });
    
    // Show celebration
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  const completedCount = missions.filter(m => m.completed).length;
  const totalPoints = missions.reduce((sum, m) => sum + (m.completed ? m.points : 0), 0);
  const maxPoints = missions.reduce((sum, m) => sum + m.points, 0);
  const progressPercentage = (weekProgress.current / weekProgress.total) * 100;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  };

  const celebrationVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: 'spring', duration: 0.5 }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-soft via-white to-background-light relative overflow-hidden">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            variants={celebrationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <div className="bg-white rounded-3xl p-10 shadow-2xl text-center">
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-accent-yellow to-accent-orange rounded-full flex items-center justify-center"
              >
                <TrophyIcon className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-text-dark mb-2">Misi Selesai!</h3>
              <p className="text-text-light">Kamu mendapatkan poin tambahan</p>
              <Badge variant="solidSuccess" size="large" className="mt-4">
                +10 Points
              </Badge>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-pink to-primary-purple rounded-2xl shadow-lg shadow-primary-pink/30 mb-4">
            <HeartIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-dark mb-2">Misi Pasangan Harian</h1>
          <p className="text-text-light">Perkuat bonding dengan pasangan melalui aktivitas seru</p>
          
          <div className="flex justify-center gap-4 mt-6">
            <Badge variant="pastelPink" size="medium">
              <FlameIcon className="w-4 h-4 mr-1" />
              {weekProgress.week} Hari Streak
            </Badge>
            <Badge variant="pastelPurple" size="medium">
              <StarIcon className="w-4 h-4 mr-1" />
              {totalPoints} Poin
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="gradient" padding="large">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-text-dark">Progress Minggu Ini</h2>
                    <p className="text-sm text-text-light mt-1">
                      {completedCount} dari {missions.length} misi selesai
                    </p>
                  </div>
                  <CircularProgress 
                    value={progressPercentage} 
                    size={72} 
                    strokeWidth={6}
                    variant="rainbow"
                    showValue
                  />
                </div>
                
                <ProgressBar 
                  value={progressPercentage} 
                  variant="rainbow" 
                  size="large"
                  animated
                  showLabel
                />
                
                <div className="flex justify-between mt-4 text-sm">
                  <span className="text-text-light">
                    {weekProgress.current} poin dari {weekProgress.total} target minggu ini
                  </span>
                  <span className="text-primary-pink font-medium">
                    {progressPercentage.toFixed(0)}% tercapai
                  </span>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex gap-2"
            >
              {['today', 'weekly', 'special'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-primary-pink to-primary-purple text-white shadow-md'
                      : 'bg-white text-text-light hover:bg-gray-50'
                  }`}
                >
                  {tab === 'today' && 'Hari Ini'}
                  {tab === 'weekly' && 'Mingguan'}
                  {tab === 'special' && 'Spesial'}
                </button>
              ))}
            </motion.div>

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text-dark">Misi Hari Ini</h2>
              <Badge variant="info" size="small">
                {missions.filter(m => !m.completed).length} tersisa
              </Badge>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {missions.map((mission) => {
                const IconComponent = mission.icon;
                
                return (
                  <motion.div
                    key={mission.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className={`relative bg-gradient-to-br ${mission.bgColor} rounded-2xl p-6 border border-white/50 shadow-soft overflow-hidden ${
                      mission.completed ? 'opacity-80' : ''
                    }`}
                  >
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/40 to-transparent rounded-full" />
                    
                    {mission.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-8 h-8 bg-primary-green rounded-full flex items-center justify-center shadow-md"
                      >
                        <CheckCircleIcon className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                    
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mission.color} flex items-center justify-center shadow-md mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <h3 className="font-semibold text-text-dark mb-1 pr-8">{mission.title}</h3>
                    <p className="text-sm text-text-light mb-4 line-clamp-2">{mission.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="pastelOrange" size="small">
                        <StarIcon className="w-3 h-3 mr-1" />
                        +{mission.points} poin
                      </Badge>
                    </div>
                    
                    {!mission.completed ? (
                      <Button
                        variant="primary"
                        fullWidth
                        size="small"
                        onClick={() => handleMissionComplete(mission.id)}
                        icon={<SparklesIcon className="w-4 h-4" />}
                        iconPosition="left"
                      >
                        Selesaikan
                      </Button>
                    ) : (
                      <div className="w-full bg-primary-green/20 text-primary-green font-medium py-2.5 px-4 rounded-xl text-center flex items-center justify-center text-sm">
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Misi Selesai
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="pastel" padding="normal" hover={false}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-yellow to-accent-orange rounded-xl flex items-center justify-center flex-shrink-0">
                    <LightbulbIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark mb-2">Tips Hari Ini</h3>
                    <p className="text-sm text-text-light leading-relaxed">
                      Komunikasi adalah kunci! Luangkan 15 menit setiap hari untuk berbicara tentang
                      perasaan dan rencana kalian berdua.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card variant="default" padding="large">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-primary-purple rounded-xl flex items-center justify-center">
                    <ChartIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-text-dark">Statistik Bulanan</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-light">Check-in Harian</span>
                      <span className="font-semibold text-primary-pink">28/30</span>
                    </div>
                    <ProgressBar value={93} variant="primary" size="medium" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-light">Konsistensi</span>
                      <span className="font-semibold text-primary-green">95%</span>
                    </div>
                    <ProgressBar value={95} variant="success" size="medium" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-light">Misi Tercapai</span>
                      <span className="font-semibold text-accent-blue">88%</span>
                    </div>
                    <ProgressBar value={88} variant="info" size="medium" />
                  </div>
                </div>
                
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-text-light">Total Poin Bulan Ini</span>
                    <div className="flex items-center gap-2">
                      <TrophyIcon className="w-5 h-5 text-accent-yellow" />
                      <span className="text-xl font-bold text-text-dark">850</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MisiPasangan;
