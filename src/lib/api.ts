import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, ""); 
// enlève le slash final proprement

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
  console.log("API BASE URL =", API_URL);