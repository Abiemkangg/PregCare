/**
 * Chat Service - API calls for PregCare RAG Backend
 * Handles all communication between frontend and FastAPI backend
 */

// Chat API runs on a different port (FastAPI) - default to 8001
const API_BASE_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:8001';

/**
 * Send a message to the AI assistant
 * @param {string} message - User's question
 * @param {string} userId - Optional user identifier
 * @returns {Promise<Object>} Response with answer, timing, and metadata
 */
export const sendMessage = async (message, userId = 'default_user') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
        user_id: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      answer: data.answer,
      responseTime: data.response_time,
      cached: data.cached,
      timestamp: data.timestamp,
      sourcesCount: data.sources_count,
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      success: false,
      error: error.message || 'Gagal mengirim pesan. Silakan coba lagi.',
    };
  }
};

/**
 * Get conversation history for a user
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} History data with conversation list
 */
export const getHistory = async (userId = 'default_user') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/history/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      history: data.history,
      count: data.count,
    };
  } catch (error) {
    console.error('Error getting history:', error);
    return {
      success: false,
      error: error.message || 'Gagal mengambil riwayat percakapan.',
      history: [],
      count: 0,
    };
  }
};

/**
 * Clear conversation history for a user
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} Success status
 */
export const clearHistory = async (userId = 'default_user') => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clear/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // If endpoint doesn't exist, just return success (local clear)
      if (response.status === 404) {
        return {
          success: true,
          message: 'History cleared locally',
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message,
    };
  } catch (error) {
    console.error('Error clearing history:', error);
    // Return success anyway for local clearing
    return {
      success: true,
      error: error.message || 'History cleared locally',
    };
  }
};

/**
 * Get cache statistics
 * @returns {Promise<Object>} Cache stats with hits, misses, and performance metrics
 */
export const getStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      stats: {
        cacheHits: data.cache_hits,
        cacheMisses: data.cache_misses,
        hitRate: data.hit_rate,
        timeSaved: data.time_saved,
        estimatedCostSaved: data.estimated_cost_saved,
        totalQueries: data.total_queries,
      },
    };
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      success: false,
      error: error.message || 'Gagal mengambil statistik cache.',
    };
  }
};

/**
 * Check backend health status
 * @returns {Promise<Object>} Backend status and readiness
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      status: data.status,
      ragReady: data.rag_ready,
      cacheEnabled: data.cache_enabled,
      localDocsCount: data.local_docs_count,
    };
  } catch (error) {
    console.error('Error checking health:', error);
    return {
      success: false,
      error: error.message || 'Backend tidak dapat dijangkau.',
    };
  }
};

export default {
  sendMessage,
  getHistory,
  clearHistory,
  getStats,
  checkHealth,
};
