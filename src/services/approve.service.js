/**
 * Service để xử lý các API liên quan đến phê duyệt Workshop
 */

import apiClient from "./apiClient";
import { mapWorkshopStatus } from "./workshopmaster.service";
import axios from "axios";

// URL cơ sở của API
const WORKSHOP_ENDPOINT = "/Workshop";
const FULL_API_URL = "http://localhost:5261/api";

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
    console.log("Gọi API:", `${WORKSHOP_ENDPOINT}`);
    
    const response = await apiClient.get(`${WORKSHOP_ENDPOINT}/sort-createdDate`);
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

/**
 * Phê duyệt workshop
 * @param {string} id - ID của workshop cần phê duyệt
 * @returns {Promise<Object>} Kết quả phê duyệt
 */
export const approveWorkshop = async (id) => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }
    
    console.log("Gọi API phê duyệt workshop với ID:", id);
    
    // Sử dụng phương thức PUT và truyền id trong URL theo đúng API backend
    const response = await apiClient.put(`${WORKSHOP_ENDPOINT}/approve-workshop?id=${id}`);
    
    console.log("API Response phê duyệt:", response.data);
    
    if (response.data && response.data.isSuccess) {
      return response.data.data;
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return null;
    }
  } catch (error) {
    console.error(`Lỗi khi phê duyệt workshop ID ${id}:`, error);
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
 * Từ chối workshop
 * @param {string} id - ID của workshop cần từ chối
 * @param {string} reason - Lý do từ chối
 * @returns {Promise<Object>} Kết quả từ chối
 */
export const rejectWorkshop = async (id, reason) => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }
    
    const response = await apiClient.post(`${WORKSHOP_ENDPOINT}/reject-workshop`, { 
      workshopId: id,
      reason: reason || "Không đáp ứng yêu cầu"
    });
    console.log("API Response:", response.data);
    
    if (response.data && response.data.isSuccess) {
      return response.data.data;
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return null;
    }
  } catch (error) {
    console.error(`Lỗi khi từ chối workshop ID ${id}:`, error);
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
 * Format dữ liệu workshop từ API để hiển thị
 * @param {Array} workshopsData - Dữ liệu workshop từ API
 * @returns {Array} Dữ liệu đã được format
 */
export const formatPendingWorkshopsData = (workshopsData) => {
  if (!Array.isArray(workshopsData)) return [];
  
  return workshopsData.map(workshop => {
    console.log("Workshop data from API:", workshop); // Log để kiểm tra dữ liệu
    
    return {
      id: workshop.workshopId,
      name: workshop.workshopName,
      location: workshop.location,
      date: new Date(workshop.startDate).toLocaleDateString('vi-VN'),
      image: workshop.image, // Giữ lại để tương thích ngược
      imageUrl: workshop.imageUrl, // Thêm imageUrl từ API
      price: workshop.price, // Lưu giá trị nguyên thủy
      capacity: workshop.capacity, // Lưu giá trị nguyên thủy
      ticketPrice: workshop.price ? `${workshop.price.toLocaleString('vi-VN')} VND` : "Chưa có thông tin", // Giữ lại để tương thích ngược
      ticketSlots: workshop.capacity, // Giữ lại để tương thích ngược
      status: mapWorkshopStatus(workshop.status),
      description: workshop.description || "",
      masterName: workshop.masterName || ""
    };
  });
}; 