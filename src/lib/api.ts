import axios from "axios";

// Utilisez le proxy en développement, l'URL réelle en production
const API_URL = import.meta.env.DEV 
  ? '/api'  // En développement, utilise le proxy Vite
  : import.meta.env.VITE_API_URL;

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