import axios from "axios";

// Lấy token từ localStorage nếu có
const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: "http://localhost:5261/api",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 10000, // Timeout 10 giây
  withCredentials: false // Không gửi cookie
});

// Thêm interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error);
    return Promise.reject(error);
  }
);

// Thêm interceptor cho request để thêm token xác thực
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request:", config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
