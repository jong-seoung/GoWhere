import axios from "axios";

const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

api.interceptors.request.use((config) => {
const token = localStorage.getItem("accessToken");
if (token) config.headers.Authorization = `Bearer ${token}`;
config.headers["Content-Type"] = "application/json";
return config;
});

export default api;