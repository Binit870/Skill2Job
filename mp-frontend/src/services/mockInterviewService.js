import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/mock",
});

export const generateQuestions = async (data) => {
  const res = await API.post("/generate", data);
  return res.data;
};

export const evaluateInterview = async (data) => {
  const res = await API.post("/evaluate", data);
  return res.data;
};