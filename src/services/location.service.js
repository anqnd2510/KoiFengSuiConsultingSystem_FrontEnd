import apiClient from "./apiClient";

const LOCATION_ENDPOINT = "http://localhost:5261/api/Location";

/**
 * Lấy danh sách tất cả locations
 * @returns {Promise<Array>} Danh sách locations
 */
export const getAllLocations = async () => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    const response = await apiClient.get(`${LOCATION_ENDPOINT}/get-all`);
    console.log("API Response:", response.data);

    // Kiểm tra cấu trúc response
    if (response.data && response.data.isSuccess && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách locations:", error);

    // Xử lý lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    throw error;
  }
};
