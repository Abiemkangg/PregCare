import { useState, useEffect } from 'react';
import { sendMessage, getHistory, clearHistory, getStats, checkHealth } from '../services/chatService';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Halo! Aku PregniBot, sahabat virtual yang siap menemanimu dalam perjalanan kehamilan. Ada yang bisa kubantu hari ini?',
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedMood, setSelectedMood] = useState('Senang');
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ online: false, ready: false });
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [userId] = useState(`user_${Date.now()}`);

  const moods = [
    { name: 'Senang', emoji: '😊', color: 'bg-accent-yellow' },
    { name: 'Sedih', emoji: '😢', color: 'bg-accent-blue' },
    { name: 'Cemas', emoji: '😰', color: 'bg-primary-purple' },
    { name: 'Lelah', emoji: '😴', color: 'bg-text-light' },
    { name: 'Optimis', emoji: '⚡', color: 'bg-primary-green' },
  ];

  const quickQuestions = [
    'Apa saja tanda-tanda kehamilan awal?',
    'Bagaimana cara meningkatkan kesuburan?',
    'Makanan apa yang baik untuk ibu hamil?',
    'Apa yang menyebabkan kelahiran prematur?',
  ];

  // Check backend health and clear history on mount/refresh
  useEffect(() => {
    const initializeChat = async () => {
      // Clear backend history for fresh session
      await clearHistory();
      
      // Check backend health
      const result = await checkHealth();
      if (result.success) {
        setBackendStatus({ 
          online: true, 
          ready: result.ragReady,
          docsCount: result.localDocsCount 
        });
      }
    };
    initializeChat();
  }, []);

  // Handle send message with real backend
  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Call backend API
    const result = await sendMessage(inputMessage);

    if (result.success) {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: result.answer,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        cached: result.cached,
        responseTime: result.responseTime,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } else {
      // Error handling
      const errorResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: `Maaf, terjadi kesalahan: ${result.error}. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorResponse]);
    }

    setIsLoading(false);
  };

  const handleQuickQuestion = async (question) => {
    if (isLoading) return;
    
    setInputMessage(question);
    // Trigger send after setting input
    setTimeout(async () => {
      await handleSendMessage();
    }, 100);
  };

  // Handle clear history
  const handleClearHistory = async () => {
    const result = await clearHistory();
    if (result.success) {
      setMessages([
        {
          id: 1,
          sender: 'ai',
          text: 'Riwayat percakapan telah dihapus. Ada yang bisa kubantu?',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  // Handle load stats
  const handleLoadStats = async () => {
    const result = await getStats();
    if (result.success) {
      setStats(result.stats);
      setShowStats(true);
    }
  };

  return (
    <div className="min-h-screen bg-background-soft">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-card shadow-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-pink to-primary-purple rounded-full p-3">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-dark">AI Smart Companion</h1>
                <p className="text-text-light text-sm">Teman AI yang memahami dan memberikan dukungan personal</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full ${backendStatus.online ? 'bg-primary-green animate-pulse' : 'bg-red-500'}`}></span>
                <span className="ml-2 text-sm text-text-light">
                  {backendStatus.online ? 'Online' : 'Offline'}
                </span>
              </div>
              {backendStatus.online && (
                <>
                  <button
                    onClick={handleLoadStats}
                    className="text-sm text-primary-pink hover:text-primary-purple transition-colors"
                  >
                    📊 Statistik
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="text-sm text-text-light hover:text-red-500 transition-colors"
                  >
                    🗑️ Clear
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-card shadow-card overflow-hidden flex flex-col" style={{ height: '600px' }}>
              {/* Mood Selector */}
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm text-text-light mb-3">Bagaimana perasaanmu hari ini?</p>
                <div className="flex space-x-2 overflow-x-auto">
                  {moods.map((mood) => (
                    <button
                      key={mood.name}
                      onClick={() => setSelectedMood(mood.name)}
                      className={`px-4 py-2 rounded-full flex items-center space-x-2 whitespace-nowrap transition-all ${
                        selectedMood === mood.name
                          ? 'bg-gradient-to-r from-primary-pink to-primary-purple text-white shadow-lg'
                          : 'bg-gray-100 text-text-dark hover:bg-gray-200'
                      }`}
                    >
                      <span>{mood.emoji}</span>
                      <span className="text-sm font-medium">{mood.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-primary-pink to-primary-purple text-white'
                          : message.isError
                          ? 'bg-red-100 text-red-700 border border-red-300'
                          : 'bg-gray-100 text-text-dark'
                      } rounded-2xl px-4 py-3`}
                    >
                      {message.sender === 'ai' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xl">{message.isError ? '⚠️' : '🤖'}</span>
                          <span className="text-sm font-semibold">PregniBot</span>
                          {message.cached && (
                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                              📦 Cached
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p
                          className={`text-xs ${
                            message.sender === 'user' ? 'text-white/70' : 'text-text-light'
                          }`}
                        >
                          {message.time}
                        </p>
                        {message.responseTime && (
                          <p className="text-xs text-text-light">
                            ⚡ {message.responseTime.toFixed(2)}s
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">🤖</span>
                        <span className="text-sm font-semibold">PregniBot</span>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <div className="w-2 h-2 bg-primary-pink rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-pink rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary-pink rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-100">
                {!backendStatus.online && (
                  <div className="mb-2 text-center text-sm text-red-500">
                    ⚠️ Backend tidak terhubung. Pastikan server RAG berjalan di port 8000.
                  </div>
                )}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                    placeholder={isLoading ? "Menunggu jawaban..." : "Ketik pertanyaanmu di sini..."}
                    disabled={isLoading || !backendStatus.online}
                    className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-pink disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !backendStatus.online}
                    className="bg-gradient-to-r from-primary-pink to-primary-purple text-white p-3 rounded-full hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Questions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-card shadow-card p-6">
              <h2 className="text-lg font-semibold text-text-dark mb-4">Pertanyaan Cepat</h2>
              <div className="space-y-3">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left px-4 py-3 bg-primary-pink/10 hover:bg-primary-pink/20 rounded-lg text-sm text-primary-pink font-medium transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Display */}
            {showStats && stats ? (
              <div className="bg-white rounded-card shadow-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-text-dark">📊 Statistik Cache</h2>
                  <button
                    onClick={() => setShowStats(false)}
                    className="text-text-light hover:text-text-dark"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-light">Total Query:</span>
                    <span className="font-semibold">{stats.totalQueries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-light">Cache Hits:</span>
                    <span className="font-semibold text-green-600">{stats.cacheHits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-light">Cache Misses:</span>
                    <span className="font-semibold text-red-600">{stats.cacheMisses}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-light">Hit Rate:</span>
                    <span className="font-semibold text-primary-purple">
                      {(stats.hitRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-light">Time Saved:</span>
                    <span className="font-semibold">{stats.timeSaved.toFixed(2)}s</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-light">Est. Cost Saved:</span>
                      <span className="font-semibold text-primary-green">
                        ${stats.estimatedCostSaved.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary-purple/10 to-primary-pink/10 rounded-card p-6">
                <div className="text-center">
                  <span className="text-4xl mb-3 block">💡</span>
                  <h3 className="font-semibold text-text-dark mb-2">
                    AI Assistant dengan RAG System
                  </h3>
                  <p className="text-sm text-text-light mb-3">
                    PregniBot menggunakan Retrieval Augmented Generation untuk memberikan jawaban akurat 
                    berdasarkan knowledge base medis.
                  </p>
                  {backendStatus.online && (
                    <div className="text-xs text-text-light bg-white rounded-lg p-3">
                      <p>📚 {backendStatus.docsCount || 224} dokumen tersedia</p>
                      <p className="mt-1">🧠 Model: Gemini 2.0 Flash</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
