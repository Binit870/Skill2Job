import axios from "axios";

const ML_BASE_URL = "http://localhost:8000";

export const callMLService = async (endpoint, data) => {
  try {
    const response = await axios.post(`${ML_BASE_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`ML Service error on /${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};