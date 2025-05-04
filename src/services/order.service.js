import apiClient from "./apiClient";
import axios from "axios";
const ORDER_ENDPOINT = "/Order";

/**
 * Lấy thông tin đơn hàng đang chờ xử lý
 * @returns {Promise<Object>} Promise chứa thông tin đơn hàng
 * @throws {Error} Lỗi khi không thể lấy thông tin đơn hàng
 */
export const getPendingOrder = async () => {
  try {
    const response = await apiClient.get(`${ORDER_ENDPOINT}/get-pending-order`);
    return response.data;
  } catch (error) {
    console.error("Error in getPendingOrder:", error);
    throw new Error(
      error.message || "Có lỗi xảy ra khi tải thông tin đơn hàng"
    );
  }
};

/**
 * Cập nhật đơn hàng thành đã thanh toán
 * @param {string} orderId - ID của đơn hàng cần cập nhật
 * @returns {Promise<Object>} Promise chứa thông tin đơn hàng
 * @throws {Error} Lỗi khi không thể cập nhật đơn hàng thành đã thanh toán
 */
export const updateOrderToPaid = async (orderId) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    // Thêm token vào header
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    console.log('Calling update payment API for order:', orderId);
    const response = await apiClient.put(`${ORDER_ENDPOINT}/update-to-PAID/${orderId}`, null, config);
    
    if (response.data && response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Không thể cập nhật trạng thái thanh toán');
    }
  } catch (error) {
    console.error("Error in updateOrderToPaid:", error);
    if (error.response?.status === 401) {
      throw new Error('Vui lòng đăng nhập lại');
    }
    throw new Error(
      error.response?.data?.message || "Có lỗi xảy ra khi cập nhật đơn hàng thành đã thanh toán"
    );
  }
};

/**
 * Lấy danh sách đơn hàng chờ xác nhận
 * @returns {Promise<Object>} Promise chứa danh sách đơn hàng chờ xác nhận
 * @throws {Error} Lỗi khi không thể lấy danh sách đơn hàng
 */
export const getPendingConfirmOrders = async () => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    // Thêm token vào header
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    console.log('Calling API with URL:', `${ORDER_ENDPOINT}/get-pendingConfirm-order`);
    const response = await apiClient.get(`${ORDER_ENDPOINT}/get-pendingConfirm-order`, config);
    
    if (response.data && response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Không có dữ liệu trả về');
    }
  } catch (error) {
    console.error("Error in getPendingConfirmOrders:", error);
    if (error.response?.status === 401) {
      throw new Error('Vui lòng đăng nhập lại');
    }
    throw new Error(
      error.response?.data?.message || "Không thể tải danh sách đơn hàng chờ xác nhận"
    );
  }
};

/**
 * Lấy chi tiết đơn hàng theo ID
 * @param {string} orderId - ID của đơn hàng cần xem chi tiết
 * @returns {Promise<Object>} Promise chứa thông tin chi tiết đơn hàng
 * @throws {Error} Lỗi khi không thể lấy thông tin chi tiết đơn hàng
 */
export const getOrderById = async (orderId) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    // Thêm token vào header
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    const response = await apiClient.get(`${ORDER_ENDPOINT}/get-order/${orderId}`, config);
    
    if (response.data && response.data.isSuccess) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Không thể lấy thông tin chi tiết đơn hàng');
    }
  } catch (error) {
    console.error("Error in getOrderById:", error);
    if (error.response?.status === 401) {
      throw new Error('Vui lòng đăng nhập lại');
    }
    throw new Error(
      error.response?.data?.message || "Không thể lấy thông tin chi tiết đơn hàng"
    );
  }
};

/**
 * Lấy danh sách đơn hàng chờ hoàn tiền
 * @returns {Promise<Object>} Promise chứa danh sách đơn hàng chờ hoàn tiền
 * @throws {Error} Lỗi khi không thể lấy danh sách đơn hàng
 */
export const getWaitingForRefundOrders = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    // Hãy kiểm tra đúng endpoint với backend
    const response = await axios.get(`http://localhost:5261/api/Order/get-waitingForRefund-order`, config);
    
    if (response.data && response.data.isSuccess) {
      return response.data;
    } else {
      console.log("API response:", response.data);
      // Trả về đối tượng với cấu trúc phù hợp ngay cả khi có lỗi
      return {
        isSuccess: false,
        message: response.data?.message || 'Không có dữ liệu trả về',
        data: []
      };
    }
  } catch (error) {
    console.error("Error in getWaitingForRefundOrders:", error);
    
    // Trả về đối tượng với cấu trúc phù hợp thay vì throw error
    return {
      isSuccess: false,
      message: error.response?.data?.message || "Không thể tải danh sách đơn hàng chờ hoàn tiền",
      data: []
    };
  }
};

