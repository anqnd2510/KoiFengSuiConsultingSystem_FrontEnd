import apiClient from './apiClient';

// URL cơ sở của API
const CATEGORY_ENDPOINT = "/Category";

// Lấy thông tin category theo ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await apiClient.get(`${CATEGORY_ENDPOINT}/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin category:', error);
    throw error;
  }
};

// Lấy tất cả categories 
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get(`${CATEGORY_ENDPOINT}/get-all`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách categories:', error);
    throw error;
  }
};

// Tạo mới category
export const createCategory = async (categoryData) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    console.log("Sending category data:", categoryData);
    const response = await apiClient.post(`${CATEGORY_ENDPOINT}/create`, categoryData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi tạo category:', error);
    throw error;
  }
};

// Cập nhật trạng thái category
export const updateCategoryStatus = async (categoryId, status) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    const response = await apiClient.put(`${CATEGORY_ENDPOINT}/update-category-status/${categoryId}?status=${status}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái category:', error);
    throw error;
  }
};
