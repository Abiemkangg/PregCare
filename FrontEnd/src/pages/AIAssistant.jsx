/**
 * Enhanced AI Assistant Component
 * Modern chat UI with Framer Motion animations, typing indicators, and smooth interactions
 */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessage, clearHistory, getStats, checkHealth } from '../services/chatService';
import { Card, Button, Badge } from '../components/ui';
import { ChatMessageSkeleton } from '../components/ui/Shimmer';
import {
  ChatBubbleIcon,
  SendIcon,
  SparklesIcon,
  RefreshIcon,
  ChartIcon,
  XIcon,
  LightbulbIcon,
  BoltIcon,
} from '../components/ui/Icons';

const AIAssistant = () => {
  const messagesContainerRef = useRef(null);
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

  const moods = [
    { name: 'Senang', color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-50' },
    { name: 'Sedih', color: 'from-sky-400 to-blue-500', bg: 'bg-sky-50' },
    { name: 'Cemas', color: 'from-violet-400 to-purple-500', bg: 'bg-violet-50' },
    { name: 'Lelah', color: 'from-gray-400 to-gray-500', bg: 'bg-gray-50' },
    { name: 'Optimis', color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-50' },
  ];

  const quickQuestions = [
    { text: 'Tanda-tanda kehamilan awal?', icon: SparklesIcon },
    { text: 'Cara meningkatkan kesuburan?', icon: LightbulbIcon },
    { text: 'Makanan baik untuk ibu hamil?', icon: BoltIcon },
    { text: 'Penyebab kelahiran prematur?', icon: ChatBubbleIcon },
  ];

  // Scroll to bottom only when new messages are added (not on every render)
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Only scroll when messages array length changes
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages.length]);

  // Check backend health on mount
  useEffect(() => {
    const initializeChat = async () => {
      await clearHistory();
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
      const errorResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: `Maaf, terjadi kesalahan: ${result.error}. Silakan coba lagi.`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorResponse]);
    }

    setIsLoading(false);
  };

  const handleQuickQuestion = (question) => {
    if (isLoading) return;
    setInputMessage(question);
  };

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

  const handleLoadStats = async () => {
    const result = await getStats();
    if (result.success) {
      setStats(result.stats);
      setShowStats(true);
    }
  };

  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-soft via-white to-background-light">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <Card variant="gradient" padding="normal" className="sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-pink to-primary-purple rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary-pink/30 flex-shrink-0">
                  <ChatBubbleIcon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-text-dark">AI Smart Companion</h1>
                  <p className="text-text-light text-xs sm:text-sm hidden sm:block">Teman AI yang memahami dan memberikan dukungan personal</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                {/* Status Indicator */}
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl">
                  <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${backendStatus.online ? 'bg-primary-green animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs sm:text-sm font-medium text-text-dark">
                    {backendStatus.online ? 'Online' : 'Offline'}
                  </span>
                </div>
                
                {/* Actions */}
                {backendStatus.online && (
                  <div className="flex gap-1 sm:gap-2">
                    <Button variant="ghost" size="small" onClick={handleLoadStats}>
                      <ChartIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="small" onClick={handleClearHistory}>
                      <RefreshIcon className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card variant="elevated" padding="none" className="overflow-hidden flex flex-col h-[calc(100vh-200px)] sm:h-[600px]">
                {/* Mood Selector */}
                <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <p className="text-xs sm:text-sm text-text-light mb-2 sm:mb-3">Bagaimana perasaanmu hari ini?</p>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {moods.map((mood) => (
                      <motion.button
                        key={mood.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedMood(mood.name)}
                        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl flex items-center gap-2 whitespace-nowrap transition-all flex-shrink-0 ${
                          selectedMood === mood.name
                            ? 'bg-gradient-to-r from-primary-pink to-primary-purple text-white shadow-md'
                            : `${mood.bg} text-text-dark hover:shadow-sm border border-gray-100`
                        }`}
                      >
                        <span className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-br ${mood.color}`} />
                        <span className="text-xs sm:text-sm font-medium">{mood.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Messages Area */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-white to-gray-50/50"
                >
                  <AnimatePresence mode="popLayout">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-primary-pink to-primary-purple text-white rounded-2xl rounded-tr-md'
                              : message.isError
                              ? 'bg-red-50 text-red-700 border border-red-200 rounded-2xl rounded-tl-md'
                              : 'bg-white text-text-dark border border-gray-100 shadow-soft rounded-2xl rounded-tl-md'
                          } px-3 sm:px-5 py-3 sm:py-4`}
                        >
                          {message.sender === 'ai' && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg flex items-center justify-center ${
                                message.isError 
                                  ? 'bg-red-100' 
                                  : 'bg-gradient-to-br from-primary-pink to-primary-purple'
                              }`}>
                                <ChatBubbleIcon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${message.isError ? 'text-red-500' : 'text-white'}`} />
                              </div>
                              <span className="text-xs sm:text-sm font-semibold text-text-dark">PregniBot</span>
                              {message.cached && (
                                <Badge variant="success" size="small">Cached</Badge>
                              )}
                            </div>
                          )}
                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100/50">
                            <p className={`text-xs ${message.sender === 'user' ? 'text-white/70' : 'text-text-light'}`}>
                              {message.time}
                            </p>
                            {message.responseTime && (
                              <p className="text-xs text-text-light">
                                {message.responseTime.toFixed(2)}s
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Typing indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white border border-gray-100 shadow-soft rounded-2xl rounded-tl-md px-5 py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-pink to-primary-purple flex items-center justify-center">
                            <ChatBubbleIcon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-text-dark">PregniBot</span>
                        </div>
                        <div className="flex gap-1.5">
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                            className="w-2.5 h-2.5 bg-gradient-to-br from-primary-pink to-primary-purple rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
                            className="w-2.5 h-2.5 bg-gradient-to-br from-primary-pink to-primary-purple rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                            className="w-2.5 h-2.5 bg-gradient-to-br from-primary-pink to-primary-purple rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-3 sm:p-4 border-t border-gray-100 bg-white">
                  {!backendStatus.online && (
                    <div className="mb-2 sm:mb-3 text-center">
                      <Badge variant="danger" size="small">
                        Backend offline. Server port 8001.
                      </Badge>
                    </div>
                  )}
                  <div className="flex gap-2 sm:gap-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                      placeholder={isLoading ? 'Menunggu...' : 'Ketik pertanyaan...'}
                      disabled={isLoading || !backendStatus.online}
                      className="flex-1 px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-pink/30 focus:border-primary-pink disabled:bg-gray-50 disabled:cursor-not-allowed transition-all text-sm"
                    />
                    <Button
                      variant="primary"
                      onClick={handleSendMessage}
                      disabled={isLoading || !backendStatus.online || !inputMessage.trim()}
                      icon={<SendIcon className="w-4 h-4 sm:w-5 sm:h-5" />}
                      className="rounded-lg sm:rounded-xl px-3 sm:px-4"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="default" padding="large">
                <h2 className="text-lg font-semibold text-text-dark mb-4 flex items-center gap-2">
                  <BoltIcon className="w-5 h-5 text-primary-pink" />
                  Pertanyaan Cepat
                </h2>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {quickQuestions.map((question, index) => {
                    const IconComponent = question.icon;
                    return (
                      <motion.button
                        key={index}
                        variants={messageVariants}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleQuickQuestion(question.text)}
                        disabled={isLoading}
                        className="w-full text-left px-4 py-3 bg-gradient-to-r from-primary-pink/5 to-primary-purple/5 hover:from-primary-pink/10 hover:to-primary-purple/10 rounded-xl text-sm text-text-dark font-medium transition-all border border-primary-pink/10 flex items-center gap-3 disabled:opacity-50"
                      >
                        <IconComponent className="w-4 h-4 text-primary-pink flex-shrink-0" />
                        <span>{question.text}</span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </Card>
            </motion.div>

            {/* Stats Panel */}
            <AnimatePresence>
              {showStats && stats ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card variant="elevated" padding="large">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-text-dark flex items-center gap-2">
                        <ChartIcon className="w-5 h-5 text-accent-blue" />
                        Statistik Cache
                      </h2>
                      <button
                        onClick={() => setShowStats(false)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <XIcon className="w-4 h-4 text-text-light" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-sm text-text-light">Total Query</span>
                        <span className="font-semibold text-text-dark">{stats.totalQueries}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                        <span className="text-sm text-text-light">Cache Hits</span>
                        <span className="font-semibold text-primary-green">{stats.cacheHits}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                        <span className="text-sm text-text-light">Cache Misses</span>
                        <span className="font-semibold text-red-500">{stats.cacheMisses}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-violet-50 rounded-xl">
                        <span className="text-sm text-text-light">Hit Rate</span>
                        <span className="font-semibold text-primary-purple">
                          {(stats.hitRate * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-text-light">Est. Cost Saved</span>
                          <Badge variant="solidSuccess" size="medium">
                            ${stats.estimatedCostSaved.toFixed(4)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card variant="pastel" padding="large" hover={false}>
                    <div className="text-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-accent-yellow to-accent-orange rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <LightbulbIcon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-semibold text-text-dark mb-2">
                        AI dengan RAG System
                      </h3>
                      <p className="text-sm text-text-light mb-4 leading-relaxed">
                        PregniBot menggunakan Retrieval Augmented Generation untuk memberikan jawaban akurat 
                        berdasarkan knowledge base medis.
                      </p>
                      {backendStatus.online && (
                        <div className="flex justify-center gap-3">
                          <Badge variant="pastelPink" size="small">
                            {backendStatus.docsCount || 224} Dokumen
                          </Badge>
                          <Badge variant="pastelPurple" size="small">
                            Gemini 2.0
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
