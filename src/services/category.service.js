import apiClient from "./apiClient";
import axios from "axios";
// URL cơ sở của API
const CATEGORY_ENDPOINT = "/Category";

// Lấy thông tin category theo ID
export const getCategoryById = async (categoryId) => {
  try {
    const response = await apiClient.get(`${CATEGORY_ENDPOINT}/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin category:", error);
    throw error;
  }
};

// Lấy tất cả categories
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get(`${CATEGORY_ENDPOINT}/get-all`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách categories:", error);
    throw error;
  }
};

// Tạo mới category
export const createCategory = async (categoryData) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Tạo FormData để gửi dữ liệu và file
    const formData = new FormData();
    formData.append("CategoryName", categoryData.categoryName);

    // Xử lý hình ảnh nếu có - gửi dưới dạng file
    if (categoryData.imageFile && categoryData.imageFile instanceof File) {
      formData.append("ImageUrl", categoryData.imageFile);
    }

    // Log dữ liệu để debug
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(
        pair[0] +
          ": " +
          (pair[1] instanceof File
            ? `File ${pair[1].name} (${pair[1].size} bytes)`
            : pair[1])
      );
    }

    // Sử dụng axios thay vì apiClient để tùy chỉnh headers và content-type
    const baseUrl = apiClient.defaults.baseURL || "http://localhost:5261";

    const response = await axios.post(
      `${baseUrl}${CATEGORY_ENDPOINT}/create`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // Không cần set Content-Type với FormData, axios sẽ tự thêm đúng Content-Type và boundary
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo category:", error);
    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status code:", error.response.status);
    }
    throw error;
  }
};

// Cập nhật trạng thái category
export const updateCategoryStatus = async (categoryId, status) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    const response = await apiClient.put(
      `${CATEGORY_ENDPOINT}/update-category-status/${categoryId}?status=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái category:", error);
    throw error;
  }
};

// Cập nhật category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    if (!categoryId) {
      throw new Error("Thiếu ID danh mục. Vui lòng cung cấp ID danh mục cần cập nhật.");
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    const formData = new FormData();
    formData.append("CategoryName", categoryData.categoryName);

    // Nếu có hình ảnh mới, gửi file mới
    if (categoryData.imageFile && categoryData.imageFile instanceof File) {
      formData.append("ImageUrl", categoryData.imageFile);
    } 
    // Nếu không có hình ảnh mới và có đường dẫn hình ảnh cũ, gửi đường dẫn cũ
    else if (categoryData.currentImageUrl) {
      formData.append("CurrentImageUrl", categoryData.currentImageUrl);
    }

    const baseUrl = apiClient.defaults.baseURL || "http://localhost:5261";
    const apiUrl = `${baseUrl}/Category/${categoryId}`;

    const response = await axios.put(apiUrl, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Lỗi khi cập nhật category ID ${categoryId}:`, error);
    if (error.response) {
      console.error("Server response:", error.response.data);
      console.error("Status code:", error.response.status);
    }
    throw error;
  }
};
