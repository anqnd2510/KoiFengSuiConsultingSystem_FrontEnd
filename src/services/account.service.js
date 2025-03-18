import apiClient from "./apiClient";

const ACCOUNT_ENDPOINT = "/Account";

/**
 * Lấy danh sách tất cả tài khoản từ hệ thống
 * @returns {Promise<Array>} Promise chứa mảng thông tin tài khoản
 * @throws {Error} Lỗi khi không thể lấy danh sách tài khoản
 */
export const getAllAccounts = async () => {
  try {
    const response = await apiClient.get(`${ACCOUNT_ENDPOINT}/accounts`);
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

/**
 * Cập nhật trạng thái hoạt động của tài khoản
 * @param {string} accountId - ID của tài khoản cần cập nhật
 * @param {boolean} isActive - Trạng thái mới (true: kích hoạt, false: vô hiệu hóa)
 * @returns {Promise<Object>} Promise chứa kết quả cập nhật
 * @throws {Error} Lỗi khi không thể cập nhật trạng thái
 */
export const toggleAccountStatus = async (accountId, isActive) => {
  try {
    const response = await apiClient.put(
      `${ACCOUNT_ENDPOINT}/toggle-account-status/${accountId}`,
      null,
      {
        params: { isActive },
      }
    );
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error toggling account status:", error);
    throw error;
  }
};

/**
 * Xóa tài khoản khỏi hệ thống
 * @param {string} accountId - ID của tài khoản cần xóa
 * @returns {Promise<Object>} Promise chứa kết quả xóa tài khoản
 * @throws {Error} Lỗi khi không thể xóa tài khoản
 */
export const deleteAccount = async (accountId) => {
  try {
    const response = await apiClient.delete(
      `${ACCOUNT_ENDPOINT}/delete-account/${accountId}`
    );
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

/**
 * Cập nhật vai trò của tài khoản
 * @param {string} accountId - ID của tài khoản cần cập nhật
 * @param {string} newRole - Vai trò mới (Admin/Staff/Master/Customer)
 * @returns {Promise<Object>} Promise chứa kết quả cập nhật vai trò
 * @throws {Error} Lỗi khi không thể cập nhật vai trò
 */
export const updateAccountRole = async (accountId, newRole) => {
  try {
    const response = await apiClient.put(
      `${ACCOUNT_ENDPOINT}/update-account-role/${accountId}`,
      null,
      {
        params: { newRole },
      }
    );
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating account role:", error);
    throw error;
  }
};
