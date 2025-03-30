import apiClient from "./apiClient";

// Lấy danh sách tất cả biên bản nghiệm thu
export const getAllAttachments = async (params = {}) => {
  try {
    console.log("Fetching attachments with params:", params);
    
    // Gọi API endpoint
    const response = await apiClient.get("/Attachment/get-all", { params });
    console.log("Attachment response:", response);
    
    // Kiểm tra và parse response theo cấu trúc thực tế từ API
    if (response && response.data) {
      // Cấu trúc response từ API là:
      // { 
      //   "isSuccess": true, 
      //   "responseCode": "Success", 
      //   "statusCode": 200, 
      //   "data": [ ... mảng các attachment ... ] 
      // }
      
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
    console.error("Error fetching attachments:", error.response || error);
    throw error;
  }
};

// Lấy chi tiết một biên bản nghiệm thu
export const getAttachmentById = async (id) => {
  try {
    const response = await apiClient.get(`/Attachment/${id}`);
    
    // Kiểm tra cấu trúc response
    if (response && response.data && response.data.isSuccess) {
      return response.data.data; // Trả về data object từ response
    }
    
    throw new Error("Không thể lấy thông tin biên bản");
  } catch (error) {
    console.error(`Error fetching attachment with id ${id}:`, error.response || error);
    throw error;
  }
};

// Các hàm khác có thể thêm sau khi có yêu cầu
