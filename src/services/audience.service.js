/**
 * Service để xử lý các API liên quan đến người tham dự Workshop
 */

import apiClient from "./apiClient";

// URL cơ sở của API
const AUDIENCE_ENDPOINT = "http://localhost:5261/api/Audience";

/**
 * Lấy danh sách người tham dự theo workshopId
 * @param {string} workshopId - ID của workshop
 * @returns {Promise<Array>} Danh sách người tham dự
 */
export const getAudiencesByWorkshopId = async (workshopId) => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }
    
    console.log("Gọi API lấy danh sách người tham dự với workshopId:", workshopId);
    
    // Gọi API lấy danh sách người tham dự
    const response = await apiClient.get(`${AUDIENCE_ENDPOINT}/by-workshop/${workshopId}`);
    
    console.log("API Response danh sách người tham dự:", response.data);
    
    // Kiểm tra cấu trúc response
    if (response.data && response.data.isSuccess && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return [];
    }
  } catch (error) {
    console.error(`Lỗi khi lấy danh sách người tham dự workshop ID ${workshopId}:`, error);
    console.error('Chi tiết lỗi:', error.response?.data || error.message);
    
    // Xử lý lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    
    throw error;
  }
};

/**
 * Format dữ liệu người tham dự từ API để hiển thị
 * @param {Array} audiencesData - Dữ liệu người tham dự từ API
 * @returns {Array} Dữ liệu đã được format
 */
export const formatAudiencesData = (audiencesData) => {
  if (!Array.isArray(audiencesData)) return [];
  
  return audiencesData.map(audience => ({
    id: audience.ticketId || audience.id,
    name: audience.customerName || audience.name,
    phone: audience.phoneNumber || audience.phone,
    email: audience.email || audience.gmail,
    date: audience.registrationDate ? new Date(audience.registrationDate).toLocaleDateString('vi-VN') : audience.date,
    status: mapAudienceStatus(audience.status)
  }));
};

/**
 * Chuyển đổi trạng thái người tham dự từ API sang UI
 * @param {string} status - Trạng thái từ API
 * @returns {string} Trạng thái hiển thị trên UI
 */
const mapAudienceStatus = (status) => {
  switch (status) {
    case "CheckedIn":
      return "Đã điểm danh";
    case "Pending":
      return "Chờ xác nhận";
    case "Absent":
      return "Vắng mặt";
    default:
      return status || "Chờ xác nhận";
  }
};

export default {
  getAudiencesByWorkshopId,
  formatAudiencesData,
  mapAudienceStatus
}; 