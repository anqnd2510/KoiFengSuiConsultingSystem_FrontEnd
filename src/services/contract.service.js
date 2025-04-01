import apiClient from "./apiClient";
import axios from "axios";

// Lấy danh sách tất cả hợp đồng
export const getAllContracts = async (params = {}) => {
  try {
    console.log("Fetching contracts with params:", params);

    // Gọi API endpoint
    const response = await apiClient.get("/Contract/get-all", { params });
    console.log("Contract response:", response);

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
    console.error("Error fetching contracts:", error.response || error);
    throw error;
  }
};

// Lấy chi tiết một hợp đồng
export const getContractById = async (id) => {
  try {
    console.log(`Fetching contract details for ID: ${id}`);

    // Gọi API endpoint
    const response = await apiClient.get(`/Contract/${id}`);
    console.log("Contract detail response:", response);

    // Kiểm tra cấu trúc response
    if (
      response &&
      response.data &&
      response.data.isSuccess &&
      response.data.data
    ) {
      console.log("Successfully fetched contract details:", response.data.data);
      return response.data.data; // Trả về data object từ response
    }

    console.warn("API returned unexpected format:", response);
    throw new Error(
      response?.data?.message || "Không thể lấy thông tin hợp đồng"
    );
  } catch (error) {
    console.error(
      `Error fetching contract with id ${id}:`,
      error.response || error
    );
    throw error;
  }
};

// Tạo hợp đồng mới
export const createContract = async (formData) => {
  try {
    const response = await apiClient.post("/Contract/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating contract:", error);
    throw error;
  }
};

// Thêm hàm mới để lấy hợp đồng theo staff
export const getAllContractsByStaff = async () => {
  try {
    const response = await apiClient.get("/Contract/get-all-by-staff");

    if (response && response.data && response.data.isSuccess) {
      return response.data;
    } else {
      console.warn("API returned unexpected format:", response);
      return { data: [] };
    }
  } catch (error) {
    console.error("Error fetching contracts by staff:", error);
    throw error;
  }
};

// Thêm hàm phê duyệt hợp đồng
export const approveContract = async (id) => {
  try {
    const response = await apiClient.patch(`/Contract/confirm/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error approving contract:", error);
    throw error;
  }
};

// Thêm hàm từ chối hợp đồng
export const rejectContract = async (id) => {
  try {
    const response = await apiClient.patch(`/Contract/cancel/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting contract:", error);
    throw error;
  }
};
