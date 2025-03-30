import apiClient from "./apiClient";

// Lấy danh sách tất cả hồ sơ
export const getAllDocuments = async (params = {}) => {
  try {
    console.log("Fetching documents with params:", params);
    
    // Gọi API endpoint
    const response = await apiClient.get("/FengShuiDocument/get-all", { params });
    console.log("Document response:", response);
    
    // Kiểm tra và parse response theo cấu trúc thực tế từ API
    if (response && response.data) {
      const responseData = response.data;
      
      if (responseData.isSuccess && Array.isArray(responseData.data)) {
        // Trả về mảng data từ response
        return responseData.data;
      } else {
        console.warn("API returned success but no valid data array");
        return [];
      }
    }
    
    // Fallback nếu không có dữ liệu hợp lệ
    console.warn("No valid data from API");
    return [];
  } catch (error) {
    console.error("Error fetching documents:", error.response || error);
    throw error;
  }
};

// Lấy chi tiết một hồ sơ
export const getDocumentById = async (id) => {
  try {
    const response = await apiClient.get(`/FengShuiDocument/${id}`);
    
    // Kiểm tra cấu trúc response
    if (response && response.data && response.data.isSuccess) {
      return response.data.data; // Trả về data object từ response
    }
    
    throw new Error("Không thể lấy thông tin hồ sơ");
  } catch (error) {
    console.error(`Error fetching document with id ${id}:`, error.response || error);
    throw error;
  }
};

// Các hàm khác có thể thêm sau khi có yêu cầu 