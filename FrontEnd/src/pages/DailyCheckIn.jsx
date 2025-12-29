/**
 * Enhanced Daily Check-In Component
 * Modern UI with Framer Motion animations, pastel colors, and smooth interactions
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge } from '../components/ui';
import { StepProgress } from '../components/ui/ProgressBar';
import {
  ClipboardIcon,
  SunIcon,
  CloudIcon,
  MoonIcon,
  CheckCircleIcon,
  HeartIcon,
  BoltIcon,
  DropIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '../components/ui/Icons';

const DailyCheckIn = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { 
      id: 'sangat-baik', 
      label: 'Sangat Baik', 
      description: 'Berenergi & Bahagia',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      icon: SunIcon,
    },
    { 
      id: 'biasa-saja', 
      label: 'Biasa Saja', 
      description: 'Stabil & Tenang',
      color: 'from-amber-400 to-orange-400',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      icon: CloudIcon,
    },
    { 
      id: 'kurang-baik', 
      label: 'Kurang Baik', 
      description: 'Butuh Istirahat',
      color: 'from-rose-400 to-pink-500',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-300',
      icon: MoonIcon,
    },
  ];

  const symptoms = [
    { id: 'kram-perut', label: 'Kram Perut', category: 'physical' },
    { id: 'mual', label: 'Mual', category: 'physical' },
    { id: 'pusing', label: 'Pusing', category: 'physical' },
    { id: 'nyeri-payudara', label: 'Nyeri Payudara', category: 'physical' },
    { id: 'kelelahan', label: 'Kelelahan', category: 'physical' },
    { id: 'perubahan-mood', label: 'Perubahan Mood', category: 'mood' },
    { id: 'susah-tidur', label: 'Susah Tidur', category: 'physical' },
    { id: 'tidak-ada', label: 'Tidak Ada Gejala', category: 'none' },
  ];

  const activities = [
    { id: 'olahraga', label: 'Olahraga', description: 'Min. 30 menit aktivitas fisik', icon: BoltIcon },
    { id: 'vitamin', label: 'Konsumsi Vitamin', description: 'Asam folat & suplemen', icon: HeartIcon },
    { id: 'tidur', label: 'Tidur Cukup', description: '7-8 jam tidur berkualitas', icon: MoonIcon },
    { id: 'air', label: 'Minum Air', description: '8 gelas air putih', icon: DropIcon },
    { id: 'stres', label: 'Kelola Stres', description: 'Meditasi atau relaksasi', icon: CloudIcon },
    { id: 'pasangan', label: 'Quality Time', description: 'Waktu berkualitas bersama', icon: HeartIcon },
  ];

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
  };

  const handleSymptomToggle = (symptomId) => {
    if (symptomId === 'tidak-ada') {
      setSelectedSymptoms(['tidak-ada']);
    } else {
      const newSymptoms = selectedSymptoms.filter(id => id !== 'tidak-ada');
      if (newSymptoms.includes(symptomId)) {
        setSelectedSymptoms(newSymptoms.filter((id) => id !== symptomId));
      } else {
        setSelectedSymptoms([...newSymptoms, symptomId]);
      }
    }
  };

  const handleActivityToggle = (activityId) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter((id) => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Check-in completed:', {
      mood: selectedMood,
      symptoms: selectedSymptoms,
      activities: selectedActivities,
      date: new Date().toISOString(),
    });
    
    setIsSubmitting(false);
    navigate('/dashboard');
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedMood !== null;
    if (currentStep === 2) return selectedSymptoms.length > 0;
    if (currentStep === 3) return selectedActivities.length > 0;
    return false;
  };

  const stepLabels = ['Mood', 'Gejala', 'Aktivitas'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.3 }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-soft via-white to-background-light">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-pink to-primary-purple rounded-2xl shadow-lg shadow-primary-pink/30 mb-4">
            <ClipboardIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-dark mb-2">Daily Check-In</h1>
          <p className="text-text-light">Catat kondisimu hari ini untuk analisis yang lebih akurat</p>
          
          {/* Date Badge */}
          <Badge variant="pastelPink" size="medium" className="mt-4">
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </Badge>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex justify-center mb-4">
            <StepProgress 
              steps={stepLabels} 
              currentStep={currentStep - 1} 
              variant="primary" 
            />
          </div>
          <div className="flex justify-center gap-12 text-sm text-text-light">
            {stepLabels.map((label, i) => (
              <span 
                key={label}
                className={`font-medium transition-colors ${
                  i + 1 <= currentStep ? 'text-primary-pink' : 'text-text-light'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Content Card */}
        <Card variant="gradient" padding="large" className="mb-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Mood Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-text-dark mb-2">
                    Bagaimana perasaanmu hari ini?
                  </h2>
                  <p className="text-text-light">Pilih yang paling menggambarkan kondisimu</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {moods.map((mood, index) => {
                    const IconComponent = mood.icon;
                    const isSelected = selectedMood === mood.id;
                    
                    return (
                      <motion.button
                        key={mood.id}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMoodSelect(mood.id)}
                        className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                          isSelected
                            ? `${mood.borderColor} ${mood.bgColor} shadow-lg`
                            : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                        }`}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-primary-pink to-primary-purple rounded-full flex items-center justify-center shadow-md"
                          >
                            <CheckCircleIcon className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                        
                        {/* Icon with gradient background */}
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${mood.color} flex items-center justify-center shadow-lg`}>
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                        
                        <div className="font-semibold text-text-dark text-lg mb-1">{mood.label}</div>
                        <div className="text-sm text-text-light">{mood.description}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Symptom Selection */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-text-dark mb-2">
                    Gejala apa yang kamu rasakan?
                  </h2>
                  <p className="text-text-light">Pilih semua yang sesuai dengan kondisimu</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {symptoms.map((symptom, index) => {
                    const isSelected = selectedSymptoms.includes(symptom.id);
                    const isNoSymptom = symptom.id === 'tidak-ada';
                    
                    return (
                      <motion.button
                        key={symptom.id}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSymptomToggle(symptom.id)}
                        className={`relative p-5 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? isNoSymptom 
                              ? 'border-primary-green bg-primary-green/10 shadow-md'
                              : 'border-primary-pink bg-primary-pink/10 shadow-md'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        {/* Check indicator */}
                        <motion.div
                          initial={false}
                          animate={{ 
                            scale: isSelected ? 1 : 0,
                            opacity: isSelected ? 1 : 0
                          }}
                          className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                            isNoSymptom ? 'bg-primary-green' : 'bg-primary-pink'
                          }`}
                        >
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                        
                        <div className={`text-sm font-medium ${isSelected ? 'text-text-dark' : 'text-text-light'}`}>
                          {symptom.label}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                
                {/* Selected count */}
                <div className="text-center">
                  <Badge variant={selectedSymptoms.length > 0 ? 'success' : 'default'} size="medium">
                    {selectedSymptoms.length} gejala dipilih
                  </Badge>
                </div>
              </motion.div>
            )}

            {/* Step 3: Activity Selection */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-text-dark mb-2">
                    Aktivitas sehat apa yang sudah kamu lakukan?
                  </h2>
                  <p className="text-text-light">Catat pencapaianmu hari ini</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map((activity, index) => {
                    const IconComponent = activity.icon;
                    const isSelected = selectedActivities.includes(activity.id);
                    
                    return (
                      <motion.button
                        key={activity.id}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleActivityToggle(activity.id)}
                        className={`relative p-5 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-accent-blue bg-accent-blue/10 shadow-md'
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                            isSelected 
                              ? 'bg-gradient-to-br from-accent-blue to-primary-purple text-white' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <div className="font-medium text-text-dark">{activity.label}</div>
                            <div className="text-xs text-text-light">{activity.description}</div>
                          </div>
                          
                          {/* Checkbox */}
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-accent-blue border-accent-blue' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <motion.svg 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-4 h-4 text-white" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </motion.svg>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
                
                {/* Progress indicator */}
                <div className="text-center space-y-2">
                  <Badge variant={selectedActivities.length >= 4 ? 'solidSuccess' : 'success'} size="medium">
                    {selectedActivities.length} dari 6 aktivitas tercapai
                  </Badge>
                  {selectedActivities.length >= 4 && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-primary-green font-medium"
                    >
                      Luar biasa! Kamu sudah mencapai target harian!
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  icon={<ArrowLeftIcon className="w-4 h-4" />}
                  iconPosition="left"
                >
                  Kembali
                </Button>
              )}
            </div>
            
            <div>
              {currentStep < 3 ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!canProceed()}
                  icon={<ArrowRightIcon className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Lanjut
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={handleComplete}
                  disabled={!canProceed()}
                  loading={isSubmitting}
                  icon={<CheckCircleIcon className="w-5 h-5" />}
                  iconPosition="left"
                >
                  Simpan Check-In
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="pastel" padding="normal" hover={false}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-yellow to-accent-orange rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-text-dark mb-1">Tips Hari Ini</h4>
                <p className="text-sm text-text-light">
                  Konsistensi adalah kunci! Catat kondisimu setiap hari untuk mendapatkan analisis siklus yang lebih akurat dan personal dari AI kami.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
