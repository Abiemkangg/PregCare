import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DailyCheckIn = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const moods = [
    { id: 'sangat-baik', emoji: '😊', label: 'Sangat Baik' },
    { id: 'biasa-saja', emoji: '😐', label: 'Biasa Saja' },
    { id: 'kurang-baik', emoji: '😢', label: 'Kurang Baik' },
  ];

  const symptoms = [
    { id: 'kram-perut', emoji: '🤰', label: 'Kram Perut', selected: false },
    { id: 'mual', emoji: '💚', label: 'Mual', selected: false },
    { id: 'pusing', emoji: '😵', label: 'Pusing', selected: false },
    { id: 'nyeri-payudara', emoji: '❌', label: 'Nyeri Payudara', selected: false },
    { id: 'kelelahan', emoji: '😴', label: 'Kelelahan', selected: false },
    { id: 'tidak-ada', emoji: '✨', label: 'Tidak Ada Gejala', selected: false },
  ];

  const activities = [
    { id: 'olahraga', emoji: '🏃', label: 'Olahraga', icon: '✅' },
    { id: 'vitamin', emoji: '💊', label: 'Konsumsi Vitamin', icon: '✅' },
    { id: 'tidur', emoji: '😴', label: 'Tidur Cukup (7-8 jam)', icon: '✅' },
    { id: 'air', emoji: '💧', label: 'Minum Air 8 Gelas', icon: '✅' },
    { id: 'stres', emoji: '🧘', label: 'Kelola Stres', icon: '✅' },
    { id: 'pasangan', emoji: '❤️', label: 'Quality Time Pasangan', icon: '✅' },
  ];

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
  };

  const handleSymptomToggle = (symptomId) => {
    if (selectedSymptoms.includes(symptomId)) {
      setSelectedSymptoms(selectedSymptoms.filter((id) => id !== symptomId));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomId]);
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

  const handleComplete = () => {
    // Save data and navigate
    console.log('Check-in completed:', {
      mood: selectedMood,
      symptoms: selectedSymptoms,
      activities: selectedActivities,
    });
    navigate('/dashboard');
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedMood !== null;
    if (currentStep === 2) return selectedSymptoms.length > 0;
    if (currentStep === 3) return selectedActivities.length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-background-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-primary-pink to-primary-purple rounded-full p-4 mb-4">
            <span className="text-4xl">📋</span>
          </div>
          <h1 className="text-3xl font-bold text-text-dark mb-2">Daily Check-In</h1>
          <p className="text-text-light">Catat harimu dan dapatkan insight dari AI</p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    step < currentStep
                      ? 'bg-primary-green text-white'
                      : step === currentStep
                      ? 'bg-gradient-to-r from-primary-pink to-primary-purple text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-primary-green' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-card shadow-card p-8">
            {/* Step 1: Mood Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-text-dark text-center mb-6">
                  Bagaimana perasaanmu hari ini?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {moods.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`p-8 rounded-xl border-2 transition-all ${
                        selectedMood === mood.id
                          ? 'border-primary-pink bg-primary-pink/10 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-primary-pink/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-6xl mb-3">{mood.emoji}</div>
                      <div className="font-semibold text-text-dark">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Symptom Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-text-dark mb-2">
                    Gejala apa yang kamu rasakan hari ini?
                  </h2>
                  <p className="text-text-light text-sm">Pilih semua yang sesuai</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {symptoms.map((symptom) => (
                    <button
                      key={symptom.id}
                      onClick={() => handleSymptomToggle(symptom.id)}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        selectedSymptoms.includes(symptom.id)
                          ? 'border-primary-green bg-primary-green/10 shadow-lg'
                          : 'border-gray-200 hover:border-primary-green/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{symptom.emoji}</div>
                      <div className="text-sm font-medium text-text-dark">{symptom.label}</div>
                      {selectedSymptoms.includes(symptom.id) && (
                        <div className="mt-2 text-primary-green text-2xl">✓</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Activity Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold text-text-dark mb-2">
                    Aktivitas sehat apa yang sudah kamu lakukan?
                  </h2>
                  <p className="text-text-light text-sm">Catat pencapaianmu hari ini</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => handleActivityToggle(activity.id)}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        selectedActivities.includes(activity.id)
                          ? 'border-accent-blue bg-accent-blue/10 shadow-lg'
                          : 'border-gray-200 hover:border-accent-blue/50 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{activity.emoji}</span>
                          <span className="font-medium text-text-dark">{activity.label}</span>
                        </div>
                        {selectedActivities.includes(activity.id) && (
                          <span className="text-2xl text-accent-blue">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-button border-2 border-gray-200 text-text-dark font-medium hover:bg-gray-50 transition-colors"
                >
                  ← Kembali
                </button>
              )}
              <div className="flex-1"></div>
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`px-8 py-3 rounded-button font-medium transition-all ${
                    canProceed()
                      ? 'bg-gradient-to-r from-primary-pink to-primary-purple text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Lanjut →
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={!canProceed()}
                  className={`px-8 py-3 rounded-button font-medium transition-all ${
                    canProceed()
                      ? 'bg-gradient-to-r from-primary-green to-accent-blue text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  ✓ Selesai
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
