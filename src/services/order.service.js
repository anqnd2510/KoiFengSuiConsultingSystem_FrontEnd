import apiClient from "./apiClient";

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
    const response = await apiClient.put(
      `${ORDER_ENDPOINT}/update-to-PAID/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateOrderToPaid:", error);
    throw new Error(
      error.message || "Có lỗi xảy ra khi cập nhật đơn hàng thành đã thanh toán"
    );
  }
};
