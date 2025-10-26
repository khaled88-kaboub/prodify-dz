import axios from "axios";

// === CONFIG DE BASE ===
// 🔧 Change l’URL selon ton backend :
const API_URL = "http://localhost:5000/api"; // ou ton URL Render/Netlify

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// === INTERCEPTEUR POUR LE TOKEN JWT ===
axiosInstance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      const token = JSON.parse(user).token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
