import axios from "axios";

const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export const callMLService = async (endpoint, data) => {
  try {
    const response = await axios.post(`${ML_BASE_URL}/${endpoint}`, data, {
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    // Log the full ML error response so you can see exactly what went wrong
    if (error.response) {
      console.error(
        `ML Service error on /${endpoint} — HTTP ${error.response.status}:`,
        JSON.stringify(error.response.data, null, 2)
      );
    } else {
      console.error(
        `ML Service error on /${endpoint} — No response (is the ML server running?):`,
        error.message
      );
    }
    throw error;
  }
};