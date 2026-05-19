import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_URL = import.meta.env.DEV
  ? "/api"
  : import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      "API CALL →",
      (config.baseURL ?? "") + (config.url ?? "")
    );

    return config;
  },

  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  (error) => {
    console.error(
      "API ERROR →",
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      console.warn("Session expirée ou non autorisée");
    }

    return Promise.reject(error);
  }
);