import LocalStorage from "./LocalStorage";
import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

request.interceptors.request.use((config) => {
  const token = LocalStorage.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default request;

export const make = async (method, url, data) => {
  const config = {
    method,
    url,
    data,
  };
  return await request(config);
};
