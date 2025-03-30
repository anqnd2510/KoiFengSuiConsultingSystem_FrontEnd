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
    console.log(`Fetching document details for ID: ${id}`);
    
    // Gọi API endpoint
    const response = await apiClient.get(`/FengShuiDocument/${id}`);
    console.log("Document detail response:", response);
    
    // Kiểm tra cấu trúc response
    if (response && response.data && response.data.isSuccess && response.data.data) {
      const documentData = response.data.data;
      console.log("Successfully fetched document details:", documentData);
      
      // Đảm bảo các trường dữ liệu được chuẩn hóa
      const processedData = {
        ...documentData,
        // Đảm bảo các trường quan trọng luôn có giá trị
        documentId: documentData.documentId || documentData.fengShuiDocumentId,
        documentName: documentData.documentName,
        status: documentData.status,
        docNo: documentData.docNo,
        version: documentData.version,
        // Hỗ trợ cả 2 kiểu đặt tên trường
        createdDate: documentData.createdDate || documentData.createDate,
        updatedDate: documentData.updatedDate || documentData.updateDate,
      };
      
      return processedData;
    }
    
    console.warn("API returned unexpected format:", response);
    throw new Error(response?.data?.message || "Không thể lấy thông tin hồ sơ");
  } catch (error) {
    console.error(`Error fetching document with id ${id}:`, error.response || error);
    throw error;
  }
};

// Các hàm khác có thể thêm sau khi có yêu cầu 