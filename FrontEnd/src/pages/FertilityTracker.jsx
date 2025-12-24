import { useState, useEffect } from 'react';
import fertilityAPI from '../services/fertilityService';

const FertilityTracker = () => {
  // State untuk input siklus
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [periodStartDate, setPeriodStartDate] = useState('');
  const [periodEndDate, setPeriodEndDate] = useState('');
  const [averageCycleLength, setAverageCycleLength] = useState(28);
  const [isEditingCycle, setIsEditingCycle] = useState(null);
  
  // State untuk data backend
  const [currentCycle, setCurrentCycle] = useState(null);
  const [cycleHistory, setCycleHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  
  // State untuk gejala
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showSymptomModal, setShowSymptomModal] = useState(false);
  const [todaySymptoms, setTodaySymptoms] = useState([]);
  
  // State untuk kalender
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  
  // State untuk analisis
  const [cycleAnalysis, setCycleAnalysis] = useState(null);
  const [currentPhase, setCurrentPhase] = useState(null);
  
  // State untuk loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Daftar gejala lengkap
  const symptomsList = [
    { id: 'cramps', name: 'Kram Perut', icon: '😣', category: 'physical' },
    { id: 'headache', name: 'Sakit Kepala', icon: '🤕', category: 'physical' },
    { id: 'backpain', name: 'Sakit Punggung', icon: '😩', category: 'physical' },
    { id: 'bloating', name: 'Kembung', icon: '🫄', category: 'physical' },
    { id: 'fatigue', name: 'Kelelahan', icon: '😴', category: 'physical' },
    { id: 'breast_tender', name: 'Payudara Nyeri', icon: '💔', category: 'physical' },
    { id: 'acne', name: 'Jerawat', icon: '😔', category: 'physical' },
    { id: 'nausea', name: 'Mual', icon: '🤢', category: 'physical' },
    { id: 'happy', name: 'Bahagia', icon: '😊', category: 'mood' },
    { id: 'sad', name: 'Sedih', icon: '😢', category: 'mood' },
    { id: 'irritable', name: 'Mudah Tersinggung', icon: '😤', category: 'mood' },
    { id: 'anxious', name: 'Cemas', icon: '😰', category: 'mood' },
    { id: 'mood_swings', name: 'Mood Swing', icon: '🎭', category: 'mood' },
    { id: 'energetic', name: 'Berenergi', icon: '⚡', category: 'mood' },
    { id: 'cravings', name: 'Ngidam Makanan', icon: '🍫', category: 'other' },
    { id: 'insomnia', name: 'Susah Tidur', icon: '🌙', category: 'other' },
    { id: 'heavy_flow', name: 'Aliran Deras', icon: '💧', category: 'flow' },
    { id: 'medium_flow', name: 'Aliran Sedang', icon: '💦', category: 'flow' },
    { id: 'light_flow', name: 'Aliran Ringan', icon: '✨', category: 'flow' },
    { id: 'spotting', name: 'Flek', icon: '🔴', category: 'flow' },
  ];

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  // Load data dari backend
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load profile
      try {
        const profileData = await fertilityAPI.getProfile();
        setProfile(profileData);
        setAverageCycleLength(profileData.average_cycle_length || 28);
      } catch (err) {
        console.log('No profile found, will create on first cycle');
      }
      
      // Load current cycle
      try {
        const cycle = await fertilityAPI.getCurrentCycle();
        setCurrentCycle(cycle);
        calculateCurrentPhase(cycle);
      } catch (err) {
        console.log('No current cycle, showing setup modal');
        setShowSetupModal(true);
      }
      
      // Load cycle history
      try {
        const cycles = await fertilityAPI.getCycles();
        setCycleHistory(Array.isArray(cycles) ? cycles : cycles.results || []);
      } catch (err) {
        console.error('Error loading cycles:', err);
      }
      
      // Load analysis
      try {
        const analysis = await fertilityAPI.getLatestAnalysis();
        setCycleAnalysis(analysis);
      } catch (err) {
        console.log('No analysis yet');
      }
      
      // Load today's symptoms
      const today = new Date().toISOString().split('T')[0];
      try {
        const symptoms = await fertilityAPI.getSymptoms(today, today);
        setTodaySymptoms(Array.isArray(symptoms) ? symptoms : symptoms.results || []);
      } catch (err) {
        console.error('Error loading symptoms:', err);
      }
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Gagal memuat data. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Generate kalender dari backend
  useEffect(() => {
    loadCalendarData();
  }, [currentDate]);

  const loadCalendarData = async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const calendarData = await fertilityAPI.getCalendarData(year, month);
      
      // Convert backend data to calendar format
      const firstDay = new Date(year, month - 1, 1);
      const startingDay = firstDay.getDay();
      const days = [];
      
      // Empty slots sebelum tanggal 1
      for (let i = 0; i < startingDay; i++) {
        days.push({ date: null, status: null });
      }
      
      // Add calendar days with backend data
      calendarData.forEach((dayData) => {
        const date = new Date(dayData.date);
        days.push({
          date: date.getDate(),
          status: dayData.phase,
          fullDate: dayData.date,
          hasSymptoms: dayData.has_symptoms,
          symptoms: dayData.symptoms
        });
      });
      
      setCalendarDays(days);
    } catch (err) {
      console.error('Error loading calendar:', err);
    }
  };



  // Calculate current phase from cycle data
  const calculateCurrentPhase = (cycle) => {
    if (!cycle) return;
    
    const today = new Date();
    const cycleStart = new Date(cycle.start_date);
    const daysDiff = Math.floor((today - cycleStart) / (1000 * 60 * 60 * 24));
    const cycleDay = daysDiff + 1;
    
    let phase = {
      day: cycleDay,
      totalDays: cycle.cycle_length || 28,
      nextPeriod: cycle.next_period_date ? Math.ceil((new Date(cycle.next_period_date) - today) / (1000 * 60 * 60 * 24)) : null,
      daysToOvulation: cycle.ovulation_date ? Math.ceil((new Date(cycle.ovulation_date) - today) / (1000 * 60 * 60 * 24)) : null
    };
    
    // Determine phase based on backend calculation
    const currentPhaseType = cycle.phase || 'normal';
    
    if (currentPhaseType === 'menstruation') {
      phase = { ...phase, name: 'Menstruasi', color: 'red', icon: '🔴', description: 'Fase peluruhan dinding rahim' };
    } else if (currentPhaseType === 'follicular') {
      phase = { ...phase, name: 'Folikuler', color: 'blue', icon: '🔵', description: 'Folikel berkembang di ovarium' };
    } else if (currentPhaseType === 'ovulation') {
      phase = { ...phase, name: 'Ovulasi', color: 'purple', icon: '🟣', description: 'Sel telur dilepaskan - puncak kesuburan' };
    } else if (currentPhaseType === 'fertile') {
      phase = { ...phase, name: 'Masa Subur', color: 'green', icon: '🟢', description: 'Waktu optimal untuk program hamil' };
    } else if (currentPhaseType === 'luteal') {
      phase = { ...phase, name: 'Luteal', color: 'orange', icon: '🟠', description: 'Tubuh mempersiapkan kemungkinan kehamilan' };
    } else {
      phase = { ...phase, name: 'Normal', color: 'gray', icon: '⚪', description: 'Fase normal siklus' };
    }
    
    setCurrentPhase(phase);
  };
  
  // Handle edit cycle dates
  const handleEditCycleDates = async (cycleId, newStartDate, newEndDate) => {
    try {
      setSaving(true);
      
      // Update dates in backend
      const updatedCycle = await fertilityAPI.updateCycleDates(
        cycleId,
        newStartDate,
        newEndDate
      );
      
      setCurrentCycle(updatedCycle);
      calculateCurrentPhase(updatedCycle);
      
      // Reload calendar and analysis
      await loadCalendarData();
      
      try {
        const analysis = await fertilityAPI.generateAnalysis();
        setCycleAnalysis(analysis);
      } catch (err) {
        console.log('Not enough data for analysis');
      }
      
      setIsEditingCycle(null);
      
    } catch (err) {
      console.error('Error updating cycle:', err);
      alert('Gagal memperbarui data siklus. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };
  
  useEffect(() => {
    if (currentCycle) {
      calculateCurrentPhase(currentCycle);
    }
  }, [currentCycle]);

  // Handle submit siklus baru
  const handleSubmitCycle = async () => {
    if (!periodStartDate || !periodEndDate) {
      alert('Mohon isi tanggal awal dan akhir menstruasi');
      return;
    }

    const start = new Date(periodStartDate);
    const end = new Date(periodEndDate);
    const menstruationLength = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    if (menstruationLength < 1 || menstruationLength > 10) {
      alert('Lama menstruasi harus antara 1-10 hari');
      return;
    }

    try {
      setSaving(true);
      
      // Quick log cycle to backend
      const newCycle = await fertilityAPI.quickLogCycle(
        periodStartDate,
        periodEndDate,
        averageCycleLength
      );
      
      setCurrentCycle(newCycle);
      calculateCurrentPhase(newCycle);
      
      // Reload data
      await loadInitialData();
      await loadCalendarData();
      
      // Generate new analysis
      try {
        const analysis = await fertilityAPI.generateAnalysis();
        setCycleAnalysis(analysis);
      } catch (err) {
        console.log('Not enough data for analysis yet');
      }
      
      setShowSetupModal(false);
      setPeriodStartDate('');
      setPeriodEndDate('');
      
    } catch (err) {
      console.error('Error saving cycle:', err);
      alert('Gagal menyimpan data siklus. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle gejala dengan backend save
  const toggleSymptom = async (symptomId) => {
    const today = new Date().toISOString().split('T')[0];
    const symptomInfo = symptomsList.find(s => s.id === symptomId);
    
    // Check if already selected
    const existingSymptom = todaySymptoms.find(s => s.symptom_type === symptomId);
    
    try {
      if (existingSymptom) {
        // Delete from backend
        await fertilityAPI.deleteSymptom(existingSymptom.id);
        setTodaySymptoms(todaySymptoms.filter(s => s.id !== existingSymptom.id));
      } else {
        // Create in backend
        const newSymptom = await fertilityAPI.createSymptom({
          date: today,
          symptom_type: symptomId,
          category: symptomInfo.category
        });
        setTodaySymptoms([...todaySymptoms, newSymptom]);
      }
      
      // Reload calendar to show symptom indicators
      await loadCalendarData();
      
    } catch (err) {
      console.error('Error toggling symptom:', err);
      alert('Gagal menyimpan gejala. Silakan coba lagi.');
    }
  };

  // Cek apakah gejala sudah dipilih hari ini
  const isSymptomSelected = (symptomId) => {
    return todaySymptoms.some(s => s.symptom_type === symptomId);
  };

  // Status warna untuk kalender
  const getStatusColor = (status) => {
    switch (status) {
      case 'menstruation':
        return 'bg-red-400 text-white';
      case 'fertile':
        return 'bg-green-400 text-white';
      case 'ovulation':
        return 'bg-purple-500 text-white';
      case 'follicular':
        return 'bg-blue-300 text-white';
      case 'luteal':
        return 'bg-orange-300 text-white';
      default:
        return 'bg-white border border-gray-200';
    }
  };

  // Navigasi bulan
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background-soft flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink"></div>
          <p className="mt-4 text-text-light">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-soft flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-red-50 rounded-xl">
          <p className="text-red-600 font-semibold mb-2">⚠️ Terjadi Kesalahan</p>
          <p className="text-sm text-text-light mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-pink text-white rounded-lg hover:bg-primary-purple transition"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-gradient-to-r from-primary-pink to-primary-purple rounded-full p-4 mb-4">
            <span className="text-4xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-text-dark mb-2">Fertility Tracker</h1>
          <p className="text-text-light">Pantau siklus menstruasi dan masa subur Anda</p>
          <div className="mt-3 max-w-2xl mx-auto p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600">
              <strong>ℹ️ Penting:</strong> Fitur ini bersifat edukatif dan membantu tracking siklus. 
              Tidak memberikan klaim medis atau jaminan kehamilan. Konsultasikan dengan dokter untuk masalah kesehatan reproduksi.
            </p>
          </div>
        </div>

        {/* Modal Setup Awal */}
        {showSetupModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => {
            if (!cycleHistory.length && !currentCycle) {
              if (confirm('Anda belum memiliki data siklus. Yakin ingin keluar tanpa input data?')) {
                setShowSetupModal(false);
              }
            } else {
              setShowSetupModal(false);
            }
          }}>
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => {
                  if (!cycleHistory.length && !currentCycle) {
                    if (confirm('Anda belum memiliki data siklus. Yakin ingin keluar tanpa input data?')) {
                      setShowSetupModal(false);
                    }
                  } else {
                    setShowSetupModal(false);
                  }
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-100 rounded-full"
                title="Tutup"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-text-dark mb-4 text-center pr-8">
                🌸 Mulai Tracking Siklus
              </h2>
              <p className="text-text-light text-center mb-6">
                Masukkan informasi menstruasi terakhir Anda untuk memulai
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Hari Pertama Menstruasi (Day 1)
                  </label>
                  <input
                    type="date"
                    value={periodStartDate}
                    onChange={(e) => setPeriodStartDate(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Hari Terakhir Menstruasi
                  </label>
                  <input
                    type="date"
                    value={periodEndDate}
                    onChange={(e) => setPeriodEndDate(e.target.value)}
                    min={periodStartDate}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Rata-rata Panjang Siklus (hari)
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="21"
                      max="40"
                      value={averageCycleLength}
                      onChange={(e) => setAverageCycleLength(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-2xl font-bold text-primary-purple w-16 text-center">
                      {averageCycleLength}
                    </span>
                  </div>
                  <p className="text-xs text-text-light mt-1">
                    Normal: 21-35 hari. Rata-rata: 28 hari
                  </p>
                </div>

                <button
                  onClick={handleSubmitCycle}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-primary-pink to-primary-purple text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Mulai Tracking'}
                </button>

                {(cycleHistory.length > 0 || currentCycle) && (
                  <button
                    onClick={() => setShowSetupModal(false)}
                    className="w-full text-text-light py-2 hover:text-text-dark transition-colors"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Edit Cycle */}
        {isEditingCycle && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsEditingCycle(null)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setIsEditingCycle(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold text-text-dark mb-4 text-center pr-8">
                ✏️ Edit Tanggal Siklus
              </h2>
              <p className="text-text-light text-center mb-6">
                Sistem akan otomatis menghitung ulang fase dan prediksi
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Hari Pertama Menstruasi
                  </label>
                  <input
                    type="date"
                    defaultValue={isEditingCycle.start_date}
                    onChange={(e) => setIsEditingCycle({...isEditingCycle, start_date: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Hari Terakhir Menstruasi
                  </label>
                  <input
                    type="date"
                    defaultValue={isEditingCycle.end_date}
                    onChange={(e) => setIsEditingCycle({...isEditingCycle, end_date: e.target.value})}
                    min={isEditingCycle.start_date}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-pink focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditCycleDates(isEditingCycle.id, isEditingCycle.start_date, isEditingCycle.end_date)}
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-primary-pink to-primary-purple text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                  <button
                    onClick={() => setIsEditingCycle(null)}
                    disabled={saving}
                    className="px-6 text-text-light hover:text-text-dark disabled:opacity-50"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Gejala */}
        {showSymptomModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSymptomModal(false)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-dark">
                  📝 Catat Gejala Hari Ini
                </h2>
                <button
                  onClick={() => setShowSymptomModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Gejala Fisik */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-dark mb-3">Gejala Fisik</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {symptomsList.filter(s => s.category === 'physical').map((symptom) => (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        isSymptomSelected(symptom.id)
                          ? 'border-primary-pink bg-primary-pink/10'
                          : 'border-gray-200 hover:border-primary-pink/50'
                      }`}
                    >
                      <span className="text-2xl">{symptom.icon}</span>
                      <p className="text-sm mt-1">{symptom.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-dark mb-3">Mood</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {symptomsList.filter(s => s.category === 'mood').map((symptom) => (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        isSymptomSelected(symptom.id)
                          ? 'border-primary-purple bg-primary-purple/10'
                          : 'border-gray-200 hover:border-primary-purple/50'
                      }`}
                    >
                      <span className="text-2xl">{symptom.icon}</span>
                      <p className="text-sm mt-1">{symptom.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flow */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-dark mb-3">Aliran Menstruasi</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {symptomsList.filter(s => s.category === 'flow').map((symptom) => (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        isSymptomSelected(symptom.id)
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-200 hover:border-red-300'
                      }`}
                    >
                      <span className="text-2xl">{symptom.icon}</span>
                      <p className="text-sm mt-1">{symptom.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lainnya */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-dark mb-3">Lainnya</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {symptomsList.filter(s => s.category === 'other').map((symptom) => (
                    <button
                      key={symptom.id}
                      onClick={() => toggleSymptom(symptom.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        isSymptomSelected(symptom.id)
                          ? 'border-accent-orange bg-accent-orange/10'
                          : 'border-gray-200 hover:border-accent-orange/50'
                      }`}
                    >
                      <span className="text-2xl">{symptom.icon}</span>
                      <p className="text-sm mt-1">{symptom.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowSymptomModal(false)}
                className="w-full bg-gradient-to-r from-primary-pink to-primary-purple text-white py-3 rounded-xl font-semibold"
              >
                Simpan Gejala
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Fase Saat Ini */}
            {currentPhase && (
              <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-card shadow-card p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm opacity-80">Hari ke-{currentPhase.day} dari {currentPhase.totalDays}</div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <span>{currentPhase.icon}</span>
                      Fase {currentPhase.name}
                    </h2>
                    <p className="text-sm opacity-90 mt-1">{currentPhase.description}</p>
                  </div>
                  <button
                    onClick={() => setShowSetupModal(true)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm"
                  >
                    + Log Menstruasi
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm opacity-80">Ovulasi dalam</div>
                    <div className="text-xl font-bold">{currentPhase.daysToOvulation} hari</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-sm opacity-80">Menstruasi berikutnya</div>
                    <div className="text-xl font-bold">{currentPhase.nextPeriod} hari</div>
                  </div>
                </div>
              </div>
            )}

            {/* Kalender */}
            <div className="bg-white rounded-card shadow-card p-6">
              <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                  <span className="text-xl">←</span>
                </button>
                <h2 className="text-2xl font-semibold text-text-dark">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                  <span className="text-xl">→</span>
                </button>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-red-400"></div>
                  <span className="text-text-light">Menstruasi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-300"></div>
                  <span className="text-text-light">Folikuler</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-green-400"></div>
                  <span className="text-text-light">Subur</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span className="text-text-light">Ovulasi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-orange-300"></div>
                  <span className="text-text-light">Luteal</span>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="text-center text-sm font-semibold text-text-light py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <div key={index} className="aspect-square">
                    {day.date ? (
                      <button
                        className={`w-full h-full rounded-lg flex items-center justify-center font-medium transition-all hover:scale-105 ${getStatusColor(
                          day.status
                        )}`}
                      >
                        {day.date}
                      </button>
                    ) : (
                      <div className="w-full h-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Catat Gejala */}
            <div className="bg-white rounded-card shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-dark">Catat Gejala Hari Ini</h2>
                <button
                  onClick={() => setShowSymptomModal(true)}
                  className="text-primary-pink hover:text-primary-purple"
                >
                  Lihat Semua →
                </button>
              </div>
              
              {/* Gejala yang sudah dipilih */}
              {todaySymptoms.length > 0 && (
                <div className="mb-4 p-4 bg-primary-pink/10 rounded-xl">
                  <p className="text-sm text-text-light mb-2">Gejala hari ini:</p>
                  <div className="flex flex-wrap gap-2">
                    {todaySymptoms.map((s) => {
                      const symptom = symptomsList.find(sym => sym.id === s.symptom_type);
                      return symptom ? (
                        <span key={s.id} className="bg-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          {symptom.icon} {symptom.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {symptomsList.slice(0, 4).map((symptom) => (
                  <button
                    key={symptom.id}
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      isSymptomSelected(symptom.id)
                        ? 'border-primary-pink bg-primary-pink/10'
                        : 'border-gray-200 hover:border-primary-pink/50'
                    }`}
                  >
                    <span className="text-3xl">{symptom.icon}</span>
                    <p className="text-sm mt-2 font-medium">{symptom.name}</p>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowSymptomModal(true)}
                className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-text-light hover:border-primary-pink hover:text-primary-pink transition-all"
              >
                + Tambah Gejala Lain
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analisis Siklus */}
            {cycleAnalysis && (
              <div className="bg-white rounded-card shadow-card p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">📈</span>
                  <h2 className="text-lg font-semibold text-text-dark">Analisis Siklus</h2>
                </div>
                
                {cycleAnalysis.average_cycle_length && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm text-text-light">Rata-rata Siklus</div>
                    <div className="text-2xl font-bold text-primary-purple">
                      {cycleAnalysis.average_cycle_length.toFixed(0)} hari
                    </div>
                    {cycleAnalysis.confidence_level && (
                      <div className="text-xs text-text-light mt-1">
                        Tingkat kepercayaan: {cycleAnalysis.confidence_level}
                        {cycleAnalysis.cycles_analyzed && ` (${cycleAnalysis.cycles_analyzed} siklus)`}
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${
                    cycleAnalysis.analysis_type !== 'normal' 
                      ? 'bg-red-50 border border-red-200' 
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <h3 className={`font-semibold mb-2 ${
                      cycleAnalysis.analysis_type !== 'normal' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {cycleAnalysis.analysis_type !== 'normal' ? '⚠️' : '✅'} 
                      {cycleAnalysis.analysis_type === 'short' && ' Siklus Pendek'}
                      {cycleAnalysis.analysis_type === 'long' && ' Siklus Panjang'}
                      {cycleAnalysis.analysis_type === 'irregular' && ' Siklus Tidak Teratur'}
                      {cycleAnalysis.analysis_type === 'normal' && ' Siklus Normal'}
                    </h3>
                    <p className="text-sm text-text-dark mb-3">{cycleAnalysis.message}</p>
                    
                    <p className="text-xs text-text-light italic mb-3">
                      *Disclaimer: Analisis ini bersifat informatif dan tidak menggantikan konsultasi medis profesional. 
                      Tidak ada jaminan kehamilan atau diagnosis medis yang diberikan.
                    </p>
                    
                    {cycleAnalysis.potential_causes && cycleAnalysis.potential_causes.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-text-dark mb-1">Kemungkinan Faktor:</p>
                        <ul className="text-xs text-text-light list-disc list-inside">
                          {cycleAnalysis.potential_causes.slice(0, 4).map((cause, i) => (
                            <li key={i}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {cycleAnalysis.recommendations && cycleAnalysis.recommendations.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-text-dark mb-1">Saran Umum:</p>
                        <ul className="text-xs text-text-light list-disc list-inside">
                          {cycleAnalysis.recommendations.map((rec, i) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Fase Penjelasan */}
            <div className="bg-white rounded-card shadow-card p-6">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">📚</span>
                <h2 className="text-lg font-semibold text-text-dark">Fase Siklus</h2>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <h3 className="font-semibold text-red-600">🔴 Menstruasi</h3>
                  <p className="text-xs text-text-light">Hari 1-7: Peluruhan dinding rahim</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h3 className="font-semibold text-blue-600">🔵 Folikuler</h3>
                  <p className="text-xs text-text-light">Hari 8-13: Folikel berkembang</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h3 className="font-semibold text-green-600">🟢 Masa Subur</h3>
                  <p className="text-xs text-text-light">Hari 10-17: Waktu optimal kehamilan</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-600">🟣 Ovulasi</h3>
                  <p className="text-xs text-text-light">Hari 14-16: Pelepasan sel telur</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <h3 className="font-semibold text-orange-600">🟠 Luteal</h3>
                  <p className="text-xs text-text-light">Hari 17-28: Persiapan kehamilan</p>
                </div>
              </div>
            </div>

            {/* Riwayat Siklus */}
            {cycleHistory.length > 0 && (
              <div className="bg-white rounded-card shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">📅</span>
                    <h2 className="text-lg font-semibold text-text-dark">Riwayat</h2>
                  </div>
                  <button
                    onClick={() => setShowSetupModal(true)}
                    className="text-sm text-primary-pink hover:underline"
                  >
                    + Tambah
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cycleHistory.map((cycle) => (
                    <div key={cycle.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-text-dark">
                            {new Date(cycle.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-text-light">
                            Durasi: {cycle.period_length || '-'} hari
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-primary-pink/10 text-primary-pink px-2 py-1 rounded-full">
                            Siklus {cycle.cycle_length} hari
                          </span>
                          {cycle.is_current && (
                            <button
                              onClick={() => setIsEditingCycle(cycle)}
                              className="text-xs text-blue-500 hover:underline"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-gradient-to-br from-primary-pink to-primary-purple rounded-card shadow-card p-6 text-white">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-2">💡</span>
                <h2 className="text-lg font-semibold">Tips Sesuai Fase</h2>
              </div>
              <div className="space-y-3">
                {currentPhase?.name === 'Menstruasi' && (
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm">• Istirahat yang cukup</p>
                    <p className="text-sm">• Kompres hangat untuk kram</p>
                    <p className="text-sm">• Konsumsi makanan kaya zat besi</p>
                  </div>
                )}
                {currentPhase?.name === 'Folikuler' && (
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm">• Energi meningkat, cocok olahraga</p>
                    <p className="text-sm">• Fokus pada protein & sayuran hijau</p>
                  </div>
                )}
                {(currentPhase?.name === 'Masa Subur' || currentPhase?.name === 'Ovulasi') && (
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm">• Waktu optimal untuk program hamil</p>
                    <p className="text-sm">• Libido cenderung meningkat</p>
                    <p className="text-sm">• Perhatikan tanda ovulasi</p>
                  </div>
                )}
                {currentPhase?.name === 'Luteal' && (
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm">• Waspadai gejala PMS</p>
                    <p className="text-sm">• Kurangi kafein & garam</p>
                    <p className="text-sm">• Olahraga ringan seperti yoga</p>
                  </div>
                )}
                {!currentPhase && (
                  <div className="bg-white/10 rounded-lg p-3">
                    <p className="text-sm">Masukkan data siklus untuk mendapatkan tips personal</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FertilityTracker;
