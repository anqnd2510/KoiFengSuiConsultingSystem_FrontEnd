/**
 * Service để xử lý các API liên quan đến Workshop cho Staff
 */

import apiClient from "./apiClient";

// URL cơ sở của API
const WORKSHOP_ENDPOINT = "http://localhost:5261/api/Workshop";

/**
 * Lấy danh sách workshop được sắp xếp theo ngày tạo
 * @returns {Promise<Array>} Danh sách workshop
 */
export const getWorkshopsByCreatedDate = async () => {
  try {
    const response = await apiClient.get(`${WORKSHOP_ENDPOINT}/list-by-created-date`);
    console.log("API Response:", response.data);
    
    // Kiểm tra cấu trúc response
    if (response.data && response.data.isSuccess && Array.isArray(response.data.data)) {
      return response.data.data; // Trả về mảng data từ response
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return [];
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách workshop:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết workshop theo ID
 * @param {string} id - ID của workshop
 * @returns {Promise<Object>} Chi tiết workshop
 */
export const getWorkshopById = async (id) => {
  try {
    const response = await apiClient.get(`${WORKSHOP_ENDPOINT}/${id}`);
    console.log("API Response:", response.data);
    
    // Kiểm tra cấu trúc response
    if (response.data && response.data.isSuccess && response.data.data) {
      return response.data.data; // Trả về dữ liệu workshop từ response
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return null;
    }
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết workshop ID ${id}:`, error);
    throw error;
  }
};

/**
 * Chuyển đổi trạng thái từ API sang định dạng hiển thị trong UI
 * @param {string} apiStatus - Trạng thái từ API
 * @returns {string} Trạng thái hiển thị trong UI
 */
export const mapWorkshopStatus = (apiStatus) => {
  // Kiểm tra nếu apiStatus là chuỗi
  if (typeof apiStatus === 'string') {
    switch (apiStatus.toLowerCase()) {
      case 'open registration':
        return "Checking";
      case 'scheduled':
        return "Checked in";
      case 'cancelled':
        return "Cancel";
      case 'completed':
        return "Reject";
      default:
        return "Checking";
    }
  }
  
  // Nếu apiStatus là số
  switch (apiStatus) {
    case 1:
      return "Checked in";
    case 2:
      return "Checking";
    case 3:
      return "Reject";
    case 0:
      return "Cancel";
    default:
      return "Checking";
  }
};

/**
 * Định dạng dữ liệu workshop từ API để hiển thị trong UI
 * @param {Array} workshopsData - Dữ liệu workshop từ API
 * @returns {Array} Dữ liệu workshop đã được định dạng
 */
export const formatWorkshopsData = (workshopsData) => {
  if (!Array.isArray(workshopsData)) {
    console.error('Dữ liệu không phải là mảng:', workshopsData);
    return [];
  }
  
  console.log('Định dạng dữ liệu workshop, số lượng:', workshopsData.length);
  
  return workshopsData.map(workshop => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!workshop) {
        console.warn('Workshop không hợp lệ:', workshop);
        return null;
      }
      
      // Tạo đối tượng workshop đã định dạng
      const formattedWorkshop = {
        id: workshop.workshopId || 0,
        workshopId: workshop.workshopId || "", // Giữ nguyên workshopId từ API
        name: workshop.workshopName || "Không có tên",
        master: workshop.masterName || "Chưa có thông tin",
        location: workshop.location || "Không có địa điểm",
        date: workshop.startDate ? new Date(workshop.startDate).toLocaleDateString('vi-VN') : "Không có ngày",
        status: mapWorkshopStatus(workshop.status),
        price: workshop.price,
        capacity: workshop.capacity,
        description: workshop.description
      };
      
      return formattedWorkshop;
    } catch (error) {
      console.error('Lỗi khi định dạng workshop:', workshop, error);
      return null;
    }
  }).filter(item => item !== null); // Lọc bỏ các item null
};

export default {
  getWorkshopsByCreatedDate,
  getWorkshopById,
  mapWorkshopStatus,
  formatWorkshopsData
}; 