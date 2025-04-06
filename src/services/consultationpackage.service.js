import apiClient from "./apiClient";

// URL cơ sở cho API gói tư vấn
const BASE_URL = "/ConsultationPackage";

// Service cho Consultation Package
const ConsultationPackageService = {
  // Lấy tất cả các gói tư vấn
  getAllPackages: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/get-all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching consultation packages:", error);
      throw error;
    }
  },

  // Lấy gói tư vấn theo ID
  getPackageById: async (id) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/get/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching consultation package with ID ${id}:`, error);
      throw error;
    }
  },

  // Tạo gói tư vấn mới
  createPackage: async (packageData) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/create`, packageData);
      return response.data;
    } catch (error) {
      console.error("Error creating consultation package:", error);
      throw error;
    }
  },

  // Cập nhật gói tư vấn
  updatePackage: async (id, packageData) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/update/${id}`, packageData);
      return response.data;
    } catch (error) {
      console.error(`Error updating consultation package with ID ${id}:`, error);
      throw error;
    }
  },

  // Xóa gói tư vấn
  deletePackage: async (id) => {
    try {
      const response = await apiClient.delete(`${BASE_URL}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting consultation package with ID ${id}:`, error);
      throw error;
    }
  },

  // Kiểm tra kết nối API
  testApiConnection: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/get-all`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("API connection test failed:", error);
      return { success: false, error };
    }
  }
};

export default ConsultationPackageService; 