import axios from "axios";

const ML_BASE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

export const callMLService = async (endpoint, data) => {
  try {
    const response = await axios.post(`${ML_BASE_URL}/${endpoint}`, data, {
      // 60s timeout — sentence-transformers can be slow on Render free tier
      timeout: 60000,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(
        `ML Service error on /${endpoint} — HTTP ${error.response.status}:`,
        JSON.stringify(error.response.data, null, 2)
      );
    } else if (error.code === "ECONNREFUSED") {
      console.error(
        `ML Service is not reachable at ${ML_BASE_URL}. Check ML_SERVICE_URL env var on Render.`
      );
    } else if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
      console.error(
        `ML Service timed out on /${endpoint}. The model may still be loading on cold start.`
      );
    } else {
      console.error(
        `ML Service error on /${endpoint} — No response:`,
        error.message
      );
    }
    throw error;
  }
};