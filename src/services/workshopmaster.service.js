/**
 * Service để xử lý các API liên quan đến Workshop cho Master
 */

import apiClient from "./apiClient";

// URL cơ sở của API
const WORKSHOP_ENDPOINT = "http://localhost:5261/api/Workshop";

/**
 * Lấy danh sách tất cả workshop
 * @returns {Promise<Array>} Danh sách workshop
 */
export const getAllWorkshops = async () => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }
    
    const response = await apiClient.get(`${WORKSHOP_ENDPOINT}/sort-createdDate`);
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
 * Lấy chi tiết workshop theo ID
 * @param {string} id - ID của workshop
 * @returns {Promise<Object>} Chi tiết workshop
 */
export const getWorkshopById = async (id) => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }
    
    // Thử cách khác: truyền ID trực tiếp trong URL path thay vì query parameter
    const response = await apiClient.get(`${WORKSHOP_ENDPOINT}/id/${id}`);
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
 * Tạo workshop mới
 * @param {Object} workshopData - Dữ liệu workshop cần tạo
 * @returns {Promise<Object>} Workshop đã tạo
 */
export const createWorkshop = async (workshopData) => {
  try {
    console.log("Dữ liệu trước khi gửi API:", workshopData);
    
    // Kiểm tra token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }
    
    // Lấy tên người dùng từ localStorage
    let userName = localStorage.getItem('userName');
    console.log("Tên người dùng từ localStorage:", userName);
    
    // Kiểm tra email từ localStorage nếu có
    const userEmail = localStorage.getItem('userEmail');
    console.log("Email người dùng từ localStorage:", userEmail);
    
    // Hardcode tên cho bob@example.com
    if (userEmail === "bob@example.com" || !userName) {
      userName = "Bob Chen";
      console.log("Sử dụng tên hardcode:", userName);
    }
    
    // Đảm bảo giá trị số là số, không phải chuỗi
    const price = typeof workshopData.ticketPrice === 'string' 
      ? parseFloat(workshopData.ticketPrice.replace(/[^\d]/g, '')) 
      : workshopData.ticketPrice;
    
    const capacity = typeof workshopData.ticketSlots === 'string'
      ? parseInt(workshopData.ticketSlots, 10)
      : workshopData.ticketSlots;
    
    // Đảm bảo ngày có định dạng đúng
    const startDate = workshopData.date;
    
    // Chuẩn bị dữ liệu theo đúng cấu trúc mà API yêu cầu
    const requestData = {
      WorkshopName: workshopData.name,
      StartDate: startDate,
      Location: workshopData.location,
      Description: workshopData.description || "",
      Capacity: capacity,
      Status: "Pending",
      Price: price,
      MasterName: userName || "Unknown Master",
      MasterAccount: userEmail || "unknown@example.com",
      Image: null,
      WorkshopId: 0
    };
    
    console.log("Request data:", JSON.stringify(requestData, null, 2));
    
    // Gửi dữ liệu trực tiếp - sử dụng đúng endpoint /create
    const response = await apiClient.post(`${WORKSHOP_ENDPOINT}/create`, requestData);
    
    console.log("API Response:", response.data);
    
    if (response.data && response.data.isSuccess && response.data.data) {
      return response.data.data;
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi tạo workshop mới:', error);
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
 * Cập nhật workshop
 * @param {string} id - ID của workshop
 * @param {Object} workshopData - Dữ liệu workshop cần cập nhật
 * @returns {Promise<Object>} Workshop đã cập nhật
 */
export const updateWorkshop = async (id, workshopData) => {
  try {
    const response = await apiClient.put(`${WORKSHOP_ENDPOINT}/${id}`, workshopData);
    console.log("API Response:", response.data);
    
    if (response.data && response.data.isSuccess && response.data.data) {
      return response.data.data;
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return null;
    }
  } catch (error) {
    console.error(`Lỗi khi cập nhật workshop ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa workshop
 * @param {string} id - ID của workshop cần xóa
 * @returns {Promise<boolean>} Kết quả xóa
 */
export const deleteWorkshop = async (id) => {
  try {
    const response = await apiClient.delete(`${WORKSHOP_ENDPOINT}/${id}`);
    console.log("API Response:", response.data);
    
    return response.data && response.data.isSuccess;
  } catch (error) {
    console.error(`Lỗi khi xóa workshop ID ${id}:`, error);
    throw error;
  }
};

/**
 * Ánh xạ trạng thái từ API sang trạng thái hiển thị
 * @param {string} apiStatus - Trạng thái từ API
 * @returns {string} Trạng thái hiển thị
 */
export const mapWorkshopStatus = (apiStatus) => {
  const statusMap = {
    "Scheduled": "Sắp diễn ra",
    "Open Registration": "Đang diễn ra",
    "Completed": "Đã kết thúc",
    "Cancelled": "Đã hủy",
    "Pending": "Chờ duyệt", // Trạng thái chờ duyệt từ API
    "Approved": "Sắp diễn ra",  // Trạng thái sau khi phê duyệt
    "Rejected": "Từ chối" // Trạng thái từ chối
  };
  
  console.log("Mapping status:", apiStatus, "->", statusMap[apiStatus] || "Không xác định");
  return statusMap[apiStatus] || "Không xác định";
};

/**
 * Format dữ liệu workshop từ API để hiển thị
 * @param {Array} workshopsData - Dữ liệu workshop từ API
 * @returns {Array} Dữ liệu đã được format
 */
export const formatWorkshopsData = (workshopsData) => {
  if (!Array.isArray(workshopsData)) return [];
  
  return workshopsData.map(workshop => ({
    id: workshop.workshopId,
    name: workshop.workshopName,
    location: workshop.location,
    date: new Date(workshop.startDate).toLocaleDateString('vi-VN'),
    image: workshop.image || "https://via.placeholder.com/400x300?text=Workshop+Image",
    ticketPrice: `${workshop.price.toLocaleString('vi-VN')} VND`,
    ticketSlots: workshop.capacity,
    status: mapWorkshopStatus(workshop.status),
    description: workshop.description || ""
  }));
};

/**
 * Lấy danh sách workshop chờ phê duyệt
 * @returns {Promise<Array>} Danh sách workshop chờ phê duyệt
 */
export const getPendingWorkshops = async () => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }
    
    // Sử dụng API getAllWorkshops thay vì pending-workshops
    const response = await apiClient.get(`${WORKSHOP_ENDPOINT}`);
    console.log("API Response:", response.data);
    
    // Kiểm tra cấu trúc response
    if (response.data && response.data.isSuccess && Array.isArray(response.data.data)) {
      // Lọc các workshop có trạng thái "Pending"
      const pendingWorkshops = response.data.data.filter(workshop => workshop.status === "Pending");
      console.log("Workshop chờ duyệt:", pendingWorkshops);
      return pendingWorkshops; // Trả về mảng workshop đã lọc
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return [];
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách workshop chờ phê duyệt:', error);
    
    // Xử lý lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    
    throw error;
  }
}; 