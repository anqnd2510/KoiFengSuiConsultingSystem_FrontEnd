import axios from "axios";
import apiClient from "./apiClient";

// API URL cho authentication
const AUTH_API_URL = "http://localhost:5261/api/Account";

/**
 * Hàm đăng nhập người dùng
 * @param {Object} credentials - Thông tin đăng nhập
 * @param {string} credentials.email - Email
 * @param {string} credentials.password - Mật khẩu
 * @returns {Promise} - Promise chứa kết quả đăng nhập
 */
export const login = async (credentials) => {
  try {
    console.log("Calling login API with credentials:", credentials);

    const loginData = {
      email: credentials.email,
      password: credentials.password,
    };

    const response = await axios.post(`${AUTH_API_URL}/login`, loginData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Login API response:", response.data);

    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      
      // Lưu email người dùng vào localStorage
      if (credentials.email) {
        console.log("Lưu email người dùng:", credentials.email);
        localStorage.setItem("userEmail", credentials.email);
      }
      
      // Lưu tên người dùng vào localStorage
      if (response.data.fullName) {
        console.log("Lưu tên người dùng từ API:", response.data.fullName);
        localStorage.setItem("userName", response.data.fullName);
      } else if (credentials.email === "bob@example.com") {
        // Hardcode tên cho tài khoản bob@example.com
        console.log("Lưu tên người dùng hardcode cho bob@example.com");
        localStorage.setItem("userName", "Bob Chen");
      } else if (credentials.email) {
        // Nếu không có fullName, sử dụng email làm tên người dùng
        const userName = credentials.email.split('@')[0];
        console.log("Lưu tên người dùng từ email:", userName);
        localStorage.setItem("userName", userName);
      }
      
      // In ra giá trị đã lưu để debug
      console.log("Tên người dùng đã lưu vào localStorage:", localStorage.getItem("userName"));
    }

    return response.data;
  } catch (error) {
    console.error("Error in login:", error);
    throw error;
  }
};

/**
 * Hàm đăng xuất người dùng
 * @returns {Promise} - Promise chứa kết quả đăng xuất
 */
export const logout = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for logout");
      return { success: false, message: "No access token found" };
    }

    const response = await axios.post(
      `${AUTH_API_URL}/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    console.log("Logout API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in logout:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    throw error;
  }
};

/**
 * Hàm lấy thông tin người dùng hiện tại từ API
 * @returns {Promise} - Promise chứa thông tin người dùng
 */
export const getCurrentUser = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.warn("No access token found for getCurrentUser");
      return null;
    }

    const response = await axios.get(`${AUTH_API_URL}/current-user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Current user API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    throw error;
  }
};

/**
 * Hàm kiểm tra người dùng đã đăng nhập chưa (từ localStorage)
 * @returns {boolean} - true nếu đã đăng nhập, false nếu chưa
 */
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem("accessToken");
  return !!accessToken;
};

/**
 * Hàm lấy thông tin người dùng từ localStorage
 * @returns {Object|null} - Thông tin người dùng hoặc null nếu chưa đăng nhập
 */
export const getUserFromStorage = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

/**
 * Hàm lấy token hiện tại
 * @returns {string|null} - Token hoặc null nếu chưa đăng nhập
 */
export const getToken = () => {
  return localStorage.getItem("accessToken");
};
