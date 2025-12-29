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
    { id: 'cramps', name: 'Kram Perut', category: 'physical' },
    { id: 'headache', name: 'Sakit Kepala', category: 'physical' },
    { id: 'backpain', name: 'Sakit Punggung', category: 'physical' },
    { id: 'bloating', name: 'Kembung', category: 'physical' },
    { id: 'fatigue', name: 'Kelelahan', category: 'physical' },
    { id: 'breast_tender', name: 'Payudara Nyeri', category: 'physical' },
    { id: 'acne', name: 'Jerawat', category: 'physical' },
    { id: 'nausea', name: 'Mual', category: 'physical' },
    { id: 'happy', name: 'Bahagia', category: 'mood' },
    { id: 'sad', name: 'Sedih', category: 'mood' },
    { id: 'irritable', name: 'Mudah Tersinggung', category: 'mood' },
    { id: 'anxious', name: 'Cemas', category: 'mood' },
    { id: 'mood_swings', name: 'Mood Swing', category: 'mood' },
    { id: 'energetic', name: 'Berenergi', category: 'mood' },
    { id: 'cravings', name: 'Ngidam Makanan', category: 'other' },
    { id: 'insomnia', name: 'Susah Tidur', category: 'other' },
    { id: 'heavy_flow', name: 'Aliran Deras', category: 'flow' },
    { id: 'medium_flow', name: 'Aliran Sedang', category: 'flow' },
    { id: 'light_flow', name: 'Aliran Ringan', category: 'flow' },
    { id: 'spotting', name: 'Flek', category: 'flow' },
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
      phase = { ...phase, name: 'Menstruasi', color: 'red', description: 'Fase peluruhan dinding rahim' };
    } else if (currentPhaseType === 'follicular') {
      phase = { ...phase, name: 'Folikuler', color: 'blue', description: 'Folikel berkembang di ovarium' };
    } else if (currentPhaseType === 'ovulation') {
      phase = { ...phase, name: 'Ovulasi', color: 'purple', description: 'Sel telur dilepaskan - puncak kesuburan' };
    } else if (currentPhaseType === 'fertile') {
      phase = { ...phase, name: 'Masa Subur', color: 'green', description: 'Waktu optimal untuk program hamil' };
    } else if (currentPhaseType === 'luteal') {
      phase = { ...phase, name: 'Luteal', color: 'orange', description: 'Tubuh mempersiapkan kemungkinan kehamilan' };
    } else {
      phase = { ...phase, name: 'Normal', color: 'gray', description: 'Fase normal siklus' };
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
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="relative inline-flex mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-pink to-primary-purple flex items-center justify-center shadow-lg shadow-pink-200/50">
              <svg className="w-8 h-8 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary-pink to-primary-purple opacity-30 blur-md animate-pulse"></div>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Memuat Data</h3>
          <p className="text-slate-500 text-sm">Menyiapkan informasi siklus Anda...</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary-pink animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary-purple animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-red-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-50 to-rose-50 px-6 py-5 border-b border-red-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-lg shadow-red-200/50">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800">Terjadi Kesalahan</h3>
                <p className="text-sm text-red-600">Tidak dapat memuat data siklus</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-600 text-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-200/60 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Muat Ulang
            </button>
          </div>
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
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-dark mb-2">Fertility Tracker</h1>
          <p className="text-text-light">Pantau siklus menstruasi dan masa subur Anda</p>
          <div className="mt-3 max-w-2xl mx-auto p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-600">
              <strong>Penting:</strong> Fitur ini bersifat edukatif dan membantu tracking siklus. 
              Tidak memberikan klaim medis atau jaminan kehamilan. Konsultasikan dengan dokter untuk masalah kesehatan reproduksi.
            </p>
          </div>
        </div>

        {/* Modal Setup Awal - Enhanced Design */}
        {showSetupModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
            if (!cycleHistory.length && !currentCycle) {
              if (confirm('Anda belum memiliki data siklus. Yakin ingin keluar tanpa input data?')) {
                setShowSetupModal(false);
              }
            } else {
              setShowSetupModal(false);
            }
          }}>
            <div 
              className="bg-gradient-to-b from-white to-rose-50/30 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-rose-100" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary-pink/10 via-primary-purple/5 to-transparent px-6 py-5 border-b border-rose-100">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-pink to-primary-purple flex items-center justify-center shadow-lg shadow-pink-200/50">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Mulai Tracking Siklus
                      </h2>
                      <p className="text-sm text-slate-500">Masukkan data menstruasi terakhir</p>
                    </div>
                  </div>
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
                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Date Input Cards */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">1</span>
                    Hari Pertama Menstruasi (Day 1)
                  </label>
                  <input
                    type="date"
                    value={periodStartDate}
                    onChange={(e) => setPeriodStartDate(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:bg-white transition-all duration-200 text-slate-700"
                  />
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">2</span>
                    Hari Terakhir Menstruasi
                  </label>
                  <input
                    type="date"
                    value={periodEndDate}
                    onChange={(e) => setPeriodEndDate(e.target.value)}
                    min={periodStartDate}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:bg-white transition-all duration-200 text-slate-700"
                  />
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">3</span>
                    Rata-rata Panjang Siklus
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="21"
                      max="40"
                      value={averageCycleLength}
                      onChange={(e) => setAverageCycleLength(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg appearance-none cursor-pointer accent-primary-purple"
                    />
                    <div className="w-16 h-12 bg-gradient-to-br from-primary-purple to-violet-600 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-xl font-bold text-white">{averageCycleLength}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Normal: 21-35 hari. Rata-rata umum: 28 hari
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-white border-t border-slate-100 space-y-3">
                <button
                  onClick={handleSubmitCycle}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-primary-pink to-primary-purple text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-200/60 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Mulai Tracking
                    </>
                  )}
                </button>

                {(cycleHistory.length > 0 || currentCycle) && (
                  <button
                    onClick={() => setShowSetupModal(false)}
                    className="w-full py-2.5 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal Edit Cycle - Enhanced Design */}
        {isEditingCycle && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsEditingCycle(null)}>
            <div 
              className="bg-gradient-to-b from-white to-rose-50/30 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-rose-100" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary-pink/10 via-primary-purple/5 to-transparent px-6 py-5 border-b border-rose-100">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-200/50">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Edit Tanggal Siklus
                      </h2>
                      <p className="text-sm text-slate-500">Perhitungan akan diperbarui otomatis</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingCycle(null)}
                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">1</span>
                    Hari Pertama Menstruasi
                  </label>
                  <input
                    type="date"
                    defaultValue={isEditingCycle.start_date}
                    onChange={(e) => setIsEditingCycle({...isEditingCycle, start_date: e.target.value})}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:bg-white transition-all duration-200 text-slate-700"
                  />
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                    <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">2</span>
                    Hari Terakhir Menstruasi
                  </label>
                  <input
                    type="date"
                    defaultValue={isEditingCycle.end_date}
                    onChange={(e) => setIsEditingCycle({...isEditingCycle, end_date: e.target.value})}
                    min={isEditingCycle.start_date}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-300 focus:border-pink-400 focus:bg-white transition-all duration-200 text-slate-700"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-white border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => handleEditCycleDates(isEditingCycle.id, isEditingCycle.start_date, isEditingCycle.end_date)}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-primary-pink to-primary-purple text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-200/60 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Simpan Perubahan
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsEditingCycle(null)}
                  disabled={saving}
                  className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Gejala - Enhanced Design */}
        {showSymptomModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowSymptomModal(false)}>
            <div 
              className="bg-gradient-to-b from-white to-rose-50/30 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-rose-100" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary-pink/10 via-primary-purple/5 to-transparent px-6 py-5 border-b border-rose-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      Catat Gejala Hari Ini
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Pilih gejala yang Anda rasakan untuk pelacakan yang lebih akurat</p>
                  </div>
                  <button
                    onClick={() => setShowSymptomModal(false)}
                    className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] space-y-6">
                {/* Gejala Fisik Section */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-800">Gejala Fisik</h3>
                      <p className="text-xs text-slate-500">Kondisi tubuh yang dirasakan</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {symptomsList.filter(s => s.category === 'physical').map((symptom) => (
                      <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                          isSymptomSelected(symptom.id)
                            ? 'border-pink-400 bg-gradient-to-br from-pink-50 to-rose-50 shadow-sm'
                            : 'border-slate-100 bg-white hover:border-pink-200 hover:bg-pink-50/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors ${
                          isSymptomSelected(symptom.id) 
                            ? 'bg-gradient-to-br from-pink-400 to-rose-500 text-white' 
                            : 'bg-slate-100 text-slate-400 group-hover:bg-pink-100 group-hover:text-pink-500'
                        }`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <p className={`text-sm font-medium text-center ${isSymptomSelected(symptom.id) ? 'text-pink-700' : 'text-slate-600'}`}>
                          {symptom.name}
                        </p>
                        {isSymptomSelected(symptom.id) && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood Section */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-800">Mood dan Emosi</h3>
                      <p className="text-xs text-slate-500">Perasaan dan suasana hati Anda</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {symptomsList.filter(s => s.category === 'mood').map((symptom) => (
                      <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                          isSymptomSelected(symptom.id)
                            ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-violet-50 shadow-sm'
                            : 'border-slate-100 bg-white hover:border-purple-200 hover:bg-purple-50/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors ${
                          isSymptomSelected(symptom.id) 
                            ? 'bg-gradient-to-br from-purple-400 to-violet-500 text-white' 
                            : 'bg-slate-100 text-slate-400 group-hover:bg-purple-100 group-hover:text-purple-500'
                        }`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className={`text-sm font-medium text-center ${isSymptomSelected(symptom.id) ? 'text-purple-700' : 'text-slate-600'}`}>
                          {symptom.name}
                        </p>
                        {isSymptomSelected(symptom.id) && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flow Section */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-red-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c0 0-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-800">Aliran Menstruasi</h3>
                      <p className="text-xs text-slate-500">Intensitas aliran saat ini</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {symptomsList.filter(s => s.category === 'flow').map((symptom) => (
                      <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                          isSymptomSelected(symptom.id)
                            ? 'border-red-400 bg-gradient-to-br from-red-50 to-rose-50 shadow-sm'
                            : 'border-slate-100 bg-white hover:border-red-200 hover:bg-red-50/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors ${
                          isSymptomSelected(symptom.id) 
                            ? 'bg-gradient-to-br from-red-400 to-rose-500 text-white' 
                            : 'bg-slate-100 text-slate-400 group-hover:bg-red-100 group-hover:text-red-500'
                        }`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c0 0-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11z" />
                          </svg>
                        </div>
                        <p className={`text-sm font-medium text-center ${isSymptomSelected(symptom.id) ? 'text-red-700' : 'text-slate-600'}`}>
                          {symptom.name}
                        </p>
                        {isSymptomSelected(symptom.id) && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other Symptoms Section */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-800">Gejala Lainnya</h3>
                      <p className="text-xs text-slate-500">Kondisi tambahan yang dirasakan</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {symptomsList.filter(s => s.category === 'other').map((symptom) => (
                      <button
                        key={symptom.id}
                        onClick={() => toggleSymptom(symptom.id)}
                        className={`group relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                          isSymptomSelected(symptom.id)
                            ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm'
                            : 'border-slate-100 bg-white hover:border-amber-200 hover:bg-amber-50/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-colors ${
                          isSymptomSelected(symptom.id) 
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' 
                            : 'bg-slate-100 text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-500'
                        }`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <p className={`text-sm font-medium text-center ${isSymptomSelected(symptom.id) ? 'text-amber-700' : 'text-slate-600'}`}>
                          {symptom.name}
                        </p>
                        {isSymptomSelected(symptom.id) && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Summary */}
                {todaySymptoms.length > 0 && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-200">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold text-emerald-800">
                        {todaySymptoms.length} gejala tercatat hari ini
                      </span>
                    </div>
                    <p className="text-xs text-emerald-600">Data gejala akan membantu menganalisis pola siklus Anda</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-white border-t border-slate-100">
                <button
                  onClick={() => setShowSymptomModal(false)}
                  className="w-full bg-gradient-to-r from-primary-pink to-primary-purple text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-pink-200/50 hover:shadow-xl hover:shadow-pink-200/60 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Simpan Gejala
                </button>
              </div>
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
                      <span className={`w-4 h-4 rounded-full bg-${currentPhase.color}-500`}></span>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-2xl font-semibold text-text-dark">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
                  className="text-primary-pink hover:text-primary-purple flex items-center"
                >
                  Lihat Semua
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
                          {symptom.name}
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
                    <div className="w-8 h-8 bg-gray-100 rounded-full mx-auto"></div>
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
                  <svg className="w-6 h-6 mr-2 text-primary-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
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
                      {cycleAnalysis.analysis_type === 'short' && 'Siklus Pendek'}
                      {cycleAnalysis.analysis_type === 'long' && 'Siklus Panjang'}
                      {cycleAnalysis.analysis_type === 'irregular' && 'Siklus Tidak Teratur'}
                      {cycleAnalysis.analysis_type === 'normal' && 'Siklus Normal'}
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
                <svg className="w-6 h-6 mr-2 text-primary-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-lg font-semibold text-text-dark">Fase Siklus</h2>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <h3 className="font-semibold text-red-600">Menstruasi</h3>
                  <p className="text-xs text-text-light">Hari 1-7: Peluruhan dinding rahim</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <h3 className="font-semibold text-blue-600">Folikuler</h3>
                  <p className="text-xs text-text-light">Hari 8-13: Folikel berkembang</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <h3 className="font-semibold text-green-600">Masa Subur</h3>
                  <p className="text-xs text-text-light">Hari 10-17: Waktu optimal kehamilan</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-purple-600">Ovulasi</h3>
                  <p className="text-xs text-text-light">Hari 14-16: Pelepasan sel telur</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <h3 className="font-semibold text-orange-600">Luteal</h3>
                  <p className="text-xs text-text-light">Hari 17-28: Persiapan kehamilan</p>
                </div>
              </div>
            </div>

            {/* Riwayat Siklus */}
            {cycleHistory.length > 0 && (
              <div className="bg-white rounded-card shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2 text-primary-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
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
                              Edit
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
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
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
