import apiClient from "./apiClient";

// Lấy danh sách tất cả hồ sơ
export const getAllDocuments = async (params = {}) => {
  try {
    console.log("Fetching documents with params:", params);

    // Gọi API endpoint
    const response = await apiClient.get("/FengShuiDocument/get-all", {
      params,
    });
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
    if (
      response &&
      response.data &&
      response.data.isSuccess &&
      response.data.data
    ) {
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
    console.error(
      `Error fetching document with id ${id}:`,
      error.response || error
    );
    throw error;
  }
};

// Tạo tài liệu mới
export const createDocument = async (formData) => {
  try {
    console.log("Creating document with formData:", formData);

    // Đảm bảo formData được xử lý đúng cách
    const response = await apiClient.post(
      "/FengShuiDocument/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Document creation response:", response);
    return response.data;
  } catch (error) {
    console.error("Error creating document:", error.response || error);
    throw error;
  }
};

// Lấy danh sách tài liệu của master
export const getAllDocumentsByMaster = async (params = {}) => {
  try {
    console.log(
      "Calling API: /FengShuiDocument/get-all-by-master with params:",
      params
    );

    const response = await apiClient.get(
      "/FengShuiDocument/get-all-by-master",
      {
        params,
      }
    );

    console.log("Raw API response:", response);
    return response.data;
  } catch (error) {
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config,
    });
    throw error;
  }
};

// Thêm hàm phê duyệt tài liệu
export const approveDocument = async (id) => {
  try {
    const response = await apiClient.patch(
      `/FengShuiDocument/${id}/confirm-by-manager`
    );
    return response.data;
  } catch (error) {
    console.error("Error approving document:", error);
    throw error;
  }
};

// Thêm hàm từ chối hợp đồng
export const rejectDocument = async (id) => {
  try {
    const response = await apiClient.patch(
      `/FengShuiDocument/${id}/cancel-by-manager`
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting document:", error);
    throw error;
  }
};
