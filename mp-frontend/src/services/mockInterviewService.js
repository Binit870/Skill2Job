import API from "../utils/api";

export const generateQuestions = async (data) => {
  const res = await API.post("/api/mock/generate", data);
  return res.data;
};

export const evaluateInterview = async (data) => {
  const res = await API.post("/api/mock/evaluate", data);
  return res.data;
};