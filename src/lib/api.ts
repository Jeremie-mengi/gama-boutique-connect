import axios from "axios";

// API backend GAMA Boutique
const API_URL = "https://backgama-production.up.railway.app/gama-boutique/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor debug
api.interceptors.request.use((config) => {
  console.log("API CALL →", config.baseURL + config.url);
  return config;
});

// Interceptor pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR →", error.response?.data || error.message);
    return Promise.reject(error);
  }
);