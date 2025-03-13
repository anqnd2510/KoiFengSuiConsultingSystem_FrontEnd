/**
 * Service để xử lý API từ chối workshop
 */

import apiClient from "./apiClient";

// URL cơ sở của API
const WORKSHOP_ENDPOINT = "/Workshop";

/**
 * Từ chối workshop
 * @param {string} workshopId - ID của workshop cần từ chối
 * @param {string} reason - Lý do từ chối
 * @returns {Promise<Object>} Kết quả từ chối
 */
export const rejectWorkshop = async (workshopId, reason) => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }
    
    console.log("Gọi API từ chối workshop với ID:", workshopId, "và lý do:", reason);
    
    // Gọi API từ chối workshop
    const response = await apiClient.post(`${WORKSHOP_ENDPOINT}/reject-workshop`, {
      workshopId: workshopId,
      reason: reason || "Không đáp ứng yêu cầu"
    });
    
    console.log("API Response từ chối workshop:", response.data);
    
    if (response.data && response.data.isSuccess) {
      return {
        success: true,
        data: response.data.data,
        message: "Từ chối workshop thành công"
      };
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return {
        success: false,
        message: response.data.message || "Không thể từ chối workshop"
      };
    }
  } catch (error) {
    console.error(`Lỗi khi từ chối workshop ID ${workshopId}:`, error);
    console.error('Chi tiết lỗi:', error.response?.data || error.message);
    
    // Xử lý lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    
    throw {
      success: false,
      message: error.response?.data?.message || error.message || "Lỗi không xác định khi từ chối workshop"
    };
  }
};

/**
 * Lấy lịch sử từ chối workshop
 * @param {string} workshopId - ID của workshop cần lấy lịch sử từ chối (tùy chọn)
 * @returns {Promise<Array>} Danh sách lịch sử từ chối
 */
export const getRejectionHistory = async (workshopId = null) => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }
    
    let url = `${WORKSHOP_ENDPOINT}/rejection-history`;
    if (workshopId) {
      url += `?workshopId=${workshopId}`;
    }
    
    const response = await apiClient.get(url);
    console.log("API Response lịch sử từ chối:", response.data);
    
    if (response.data && response.data.isSuccess && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return [];
    }
  } catch (error) {
    console.error('Lỗi khi lấy lịch sử từ chối workshop:', error);
    
    // Xử lý lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    
    throw error;
  }
}; 