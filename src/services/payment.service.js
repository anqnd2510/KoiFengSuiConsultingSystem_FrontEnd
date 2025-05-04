import apiClient from "./apiClient";
import axios from "axios";

const PAYMENT_ENDPOINT = "/Payment";

// Hàm kiểm tra và xử lý kết quả từ API
const formatApiResponse = (response) => {
  // Nếu response.data có cấu trúc chuẩn của API
  if (response.data && typeof response.data.isSuccess !== "undefined") {
    return {
      isSuccess: response.data.isSuccess,
      statusCode: response.data.statusCode,
      responseCode: response.data.responseCode,
      message: response.data.message,
      data: response.data.data,
    };
  }

  // Trường hợp API trả về cấu trúc khác
  return {
    isSuccess: true,
    statusCode: response.status,
    data: response.data,
    message: "",
  };
};

export const generateRefundCode = async (orderId, customerId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return {
        isSuccess: false,
        message: "Vui lòng đăng nhập lại",
        data: null,
      };
    }

    const requestData = {};
    requestData.OrderId = orderId;
    requestData.CustomerId = customerId;

    const response = await apiClient.post(
      `${PAYMENT_ENDPOINT}/refund`,
      requestData
    );
    return formatApiResponse(response);
  } catch (error) {
    console.error("Error generating refund code:", error);

    // Trả về đối tượng lỗi có cấu trúc phù hợp để component xử lý
    return {
      isSuccess: false,
      statusCode: error.response?.status || 500,
      message: error.message || "Có lỗi xảy ra khi tạo mã hoàn tiền",
      data: null,
    };
  }
};

export const getManagerRefundedList = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return {
        isSuccess: false,
        message: "Vui lòng đăng nhập lại",
        data: [],
      };
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await apiClient.get(
      `${PAYMENT_ENDPOINT}/get-manager-refunded`,
      config
    );
    return formatApiResponse(response);
  } catch (error) {
    console.error("Error fetching refunded orders:", error);

    // Trả về đối tượng lỗi có cấu trúc phù hợp để component xử lý
    return {
      isSuccess: false,
      statusCode: error.response?.status || 500,
      message:
        error.message || "Lỗi không xác định khi lấy danh sách hoàn tiền",
      data: [],
    };
  }
};

export const confirmRefund = async (orderId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return {
        isSuccess: false,
        message: "Vui lòng đăng nhập lại",
        data: null,
      };
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await apiClient.put(
      `${PAYMENT_ENDPOINT}/manager-confirm-refunded?id=${orderId}`,
      null,
      config
    );
    return formatApiResponse(response);
  } catch (error) {
    console.error("Error confirming refund:", error);

    // Trả về đối tượng lỗi có cấu trúc phù hợp để component xử lý
    return {
      isSuccess: false,
      statusCode: error.response?.status || 500,
      message: error.message || "Lỗi không xác định khi xác nhận hoàn tiền",
      data: null,
    };
  }
};
