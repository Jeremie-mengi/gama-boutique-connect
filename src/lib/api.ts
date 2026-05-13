import axios from "axios";
import { useAuthStore } from "@/store/authStore";

// API backend GAMA Boutique
const API_URL = "https://backgama-production.up.railway.app/gama-boutique/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Inject Authorization header (user connecté) sur chaque requête
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  console.log("API CALL →", (config.baseURL ?? "") + (config.url ?? ""));
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API ERROR →", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
