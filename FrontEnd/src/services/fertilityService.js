import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/fertility`
  : 'http://localhost:8000/api/fertility';

// Configure axios defaults for Django session authentication
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  // Check if user is authenticated via session (Django session auth)
  return {};
};

const fertilityAPI = {
  // Cycle Management
  getCycles: async () => {
    try {
      const response = await axios.get(`${API_URL}/cycles/`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching cycles:', error);
      throw error;
    }
  },

  createCycle: async (cycleData) => {
    try {
      const response = await axios.post(`${API_URL}/cycles/`, cycleData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating cycle:', error);
      throw error;
    }
  },

  quickLogCycle: async (startDate, endDate, cycleLength = 28) => {
    try {
      const response = await axios.post(`${API_URL}/cycles/quick_log/`, {
        start_date: startDate,
        end_date: endDate,
        cycle_length: cycleLength
      }, {
        headers: getAuthHeader(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error quick logging cycle:', error);
      throw error;
    }
  },

  updateCycle: async (cycleId, cycleData) => {
    try {
      const response = await axios.put(`${API_URL}/cycles/${cycleId}/`, cycleData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cycle:', error);
      throw error;
    }
  },

  deleteCycle: async (cycleId) => {
    try {
      const response = await axios.delete(`${API_URL}/cycles/${cycleId}/`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting cycle:', error);
      throw error;
    }
  },

  // Daily Check-in Management
  getCheckIns: async () => {
    try {
      const response = await axios.get(`${API_URL}/check-ins/`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching check-ins:', error);
      throw error;
    }
  },

  createCheckIn: async (checkInData) => {
    try {
      const response = await axios.post(`${API_URL}/check-ins/`, checkInData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating check-in:', error);
      throw error;
    }
  },

  updateCheckIn: async (checkInId, checkInData) => {
    try {
      const response = await axios.put(`${API_URL}/check-ins/${checkInId}/`, checkInData, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating check-in:', error);
      throw error;
    }
  },

  deleteCheckIn: async (checkInId) => {
    try {
      const response = await axios.delete(`${API_URL}/check-ins/${checkInId}/`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting check-in:', error);
      throw error;
    }
  },

  // Predictions
  getPredictions: async () => {
    try {
      const response = await axios.get(`${API_URL}/predictions/`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  },

  // Statistics
  getStatistics: async () => {
    try {
      const response = await axios.get(`${API_URL}/statistics/`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Calendar Data
  getCalendarData: async (year, month) => {
    try {
      const response = await axios.get(`${API_URL}/calendar/`, {
        params: { year, month },
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      throw error;
    }
  },

  // Symptoms
  getSymptoms: async (startDate, endDate) => {
    try {
      const response = await axios.get(`${API_URL}/symptoms/`, {
        params: { start_date: startDate, end_date: endDate },
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      throw error;
    }
  },

  // Analysis
  getAnalysis: async () => {
    try {
      const response = await axios.get(`${API_URL}/analysis/`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching analysis:', error);
      throw error;
    }
  },

  generateAnalysis: async () => {
    try {
      const response = await axios.post(`${API_URL}/analysis/generate/`, {}, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error generating analysis:', error);
      throw error;
    }
  },

  updateCycleDates: async (cycleId, startDate, endDate) => {
    try {
      const response = await axios.patch(`${API_URL}/cycles/${cycleId}/update_dates/`, {
        start_date: startDate,
        end_date: endDate
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating cycle dates:', error);
      throw error;
    }
  },

  getCurrentCycle: async () => {
    try {
      const response = await axios.get(`${API_URL}/cycles/current/`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current cycle:', error);
      throw error;
    }
  }
};

export default fertilityAPI;
