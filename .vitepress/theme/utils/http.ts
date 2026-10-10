import axios from "axios";

const baseURL = "https://ebook.ruidoc.cn/api";

const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config: any) => {
  config.headers["Authorization"] =
    "Bearer " + localStorage.getItem("ruidoc_token") || "";
  return config;
});

instance.interceptors.response.use(
  (result) => {
    return result.data;
  },
  (error) => {
    const { response: res } = error;
    return Promise.reject(res);
  }
);

export default instance;
