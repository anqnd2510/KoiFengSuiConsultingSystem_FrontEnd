/**
 * Service để xử lý các API liên quan đến người tham dự Workshop
 */

import apiClient from "./apiClient";

// URL cơ sở của API
const AUDIENCE_ENDPOINT = "http://localhost:5261/api/Audience";
const WORKSHOP_ENDPOINT = "http://localhost:5261/api/Workshop";

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
    // Sửa endpoint dựa trên cấu trúc của endpoint check-in
    const response = await apiClient.get(`${WORKSHOP_ENDPOINT}/get-audiences?workshopId=${workshopId}`);
    
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
 * Điểm danh người tham dự
 * @param {string} workshopId - ID của workshop
 * @param {string} registerId - ID của người đăng ký
 * @returns {Promise<Object>} Kết quả điểm danh
 */
export const checkInAudience = async (workshopId, registerId) => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }
    
    console.log("Gọi API điểm danh với workshopId:", workshopId, "và registerId:", registerId);
    
    // Gọi API điểm danh
    const response = await apiClient.put(`${WORKSHOP_ENDPOINT}/check-in?workshopId=${workshopId}&registerId=${registerId}`);
    
    console.log("API Response điểm danh:", response.data);
    
    // Kiểm tra cấu trúc response
    if (response.data && response.data.isSuccess) {
      return {
        success: true,
        data: response.data.data,
        message: "Điểm danh thành công"
      };
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return {
        success: false,
        message: response.data.message || "Không thể điểm danh"
      };
    }
  } catch (error) {
    console.error(`Lỗi khi điểm danh người tham dự workshop ID ${workshopId}, register ID ${registerId}:`, error);
    console.error('Chi tiết lỗi:', error.response?.data || error.message);
    
    // Xử lý lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    
    throw {
      success: false,
      message: error.response?.data?.message || error.message || "Lỗi không xác định khi điểm danh"
    };
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
    status: mapAudienceStatus(audience.status),
    registerId: audience.registerId || audience.id // Thêm registerId để sử dụng khi điểm danh
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
  checkInAudience,
  formatAudiencesData,
  mapAudienceStatus
}; 