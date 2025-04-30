import apiClient from "./apiClient";

const ACCOUNT_ENDPOINT = "/Account";

/**
 * Lấy danh sách tất cả tài khoản từ hệ thống
 * @returns {Promise<Array>} Promise chứa mảng thông tin tài khoản
 * @throws {Error} Lỗi khi không thể lấy danh sách tài khoản
 */
export const getAllAccounts = async () => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Log thêm thông tin để debug
    console.log("Fetching all accounts with token...");

    // Đảm bảo đường dẫn API đúng và thêm token vào header
    const response = await apiClient.get(`${ACCOUNT_ENDPOINT}/accounts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API response accounts:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);

    // Ghi log chi tiết hơn về lỗi
    if (error.response) {
      // Lỗi server trả về
      console.error("Server response error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      // Xử lý các trường hợp lỗi cụ thể
      if (error.response.status === 401) {
        throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      } else if (error.response.status === 403) {
        throw new Error("Bạn không có quyền truy cập tính năng này");
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error("No response received:", error.request);
    } else {
      // Lỗi khi setup request
      console.error("Request setup error:", error.message);
    }

    // Ném lại lỗi với thông tin rõ ràng hơn
    throw {
      message: error.message || "Không thể tải danh sách tài khoản",
      originalError: error,
    };
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

/**
 * Lấy danh sách tất cả nhân viên từ hệ thống
 * @returns {Promise<Array>} Promise chứa mảng thông tin nhân viên
 * @throws {Error} Lỗi khi không thể lấy danh sách nhân viên
 */
export const getAllStaff = async () => {
  try {
    const response = await apiClient.get(`${ACCOUNT_ENDPOINT}/get-all-staff`);
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả khách hàng từ hệ thống
 * @returns {Promise<Array>} Promise chứa mảng thông tin khách hàng
 * @throws {Error} Lỗi khi không thể lấy danh sách khách hàng
 */
export const getAllCustomers = async () => {
  try {
    const response = await apiClient.get(
      `${ACCOUNT_ENDPOINT}/get-all-customers`
    );
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả thông tin cho dashboard từ hệ thống
 * @returns {Promise<Array>} Promise chứa mảng thông tin dashboard
 * @throws {Error} Lỗi khi không thể lấy danh sách dashboard
 */
export const getDashboardInfo = async () => {
  try {
    const response = await apiClient.get(
      `${ACCOUNT_ENDPOINT}/get-dashboard-data`
    );
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard info:", error);
    throw error;
  }
};

/**
 * Chỉnh sửa thông tin cá nhân của người dùng
 * @param {Object} profileData - Thông tin cần cập nhật
 * @returns {Promise<Object>} Promise chứa kết quả cập nhật thông tin
 * @throws {Error} Lỗi khi không thể cập nhật thông tin
 */
export const editProfile = async (profileData) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Tạo FormData từ profileData
    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      // Xử lý đặc biệt cho trường dob để đảm bảo format đúng
      if (key === "dob" && profileData[key]) {
        formData.append(key, profileData[key]);
      }
      // Xử lý đặc biệt cho trường gender để chuyển thành boolean
      else if (key === "gender") {
        formData.append(key, profileData[key].toString());
      }
      // Xử lý các trường còn lại
      else if (profileData[key] !== undefined && profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    });

    // Log để kiểm tra dữ liệu trước khi gửi
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    const response = await apiClient.put(
      `${ACCOUNT_ENDPOINT}/edit-profile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("BE response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in editProfile service:", error);
    throw error;
  }
};

/**
 * Đổi mật khẩu người dùng
 * @param {Object} passwordData - Dữ liệu đổi mật khẩu
 * @param {string} passwordData.oldPassword - Mật khẩu hiện tại
 * @param {string} passwordData.newPassword - Mật khẩu mới
 * @param {string} passwordData.confirmPassword - Xác nhận mật khẩu mới
 * @returns {Promise<Object>} Promise chứa kết quả đổi mật khẩu
 * @throws {Error} Lỗi khi không thể đổi mật khẩu
 */
export const changePassword = async (passwordData) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Format dữ liệu theo yêu cầu của BE (PascalCase)
    const formattedData = {
      OldPassword: passwordData.oldPassword,
      NewPassword: passwordData.newPassword,
      ConfirmPassword: passwordData.confirmPassword,
    };

    console.log("Sending password change request:", formattedData);

    const response = await apiClient.put(
      `${ACCOUNT_ENDPOINT}/change-password`,
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Password change response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    if (error.response?.data?.message) {
      // Xử lý các trường hợp lỗi cụ thể từ BE
      switch (error.response.data.statusCode) {
        case 400:
          if (error.response.data.message.includes("mật khẩu cũ")) {
            throw new Error("Mật khẩu cũ không đúng");
          } else if (error.response.data.message.includes("mật khẩu mới")) {
            throw new Error("Mật khẩu mới không được trùng với mật khẩu cũ");
          }
          break;
        case 401:
          throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        case 404:
          throw new Error("Không tìm thấy thông tin tài khoản");
        default:
          throw new Error(error.response.data.message);
      }
    }
    throw error;
  }
};

/**
 * Gửi yêu cầu quên mật khẩu
 * @param {string} email - Email của tài khoản cần khôi phục mật khẩu
 * @returns {Promise<Object>} Promise chứa kết quả gửi yêu cầu
 * @throws {Error} Lỗi khi không thể gửi yêu cầu
 */
export const forgotPassword = async (email) => {
  try {
    console.log("Sending forgot password request for email:", email);

    const response = await apiClient.post(
      `${ACCOUNT_ENDPOINT}/forgot-password`,
      { Email: email },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Forgot password response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in forgot password:", error);
    if (error.response?.data?.message) {
      // Xử lý các trường hợp lỗi cụ thể từ BE
      switch (error.response.data.statusCode) {
        case 400:
          throw new Error("Email không hợp lệ");
        case 404:
          throw new Error("Không tìm thấy tài khoản với email này");
        default:
          throw new Error(error.response.data.message);
      }
    }
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    console.log(
      "Sending OTP verification request for email:",
      email,
      "OTP:",
      otp
    );

    // Sử dụng POST nhưng đặt tham số trong query string
    const response = await apiClient.post(
      `${ACCOUNT_ENDPOINT}/verify-otp?email=${encodeURIComponent(
        email
      )}&otp=${encodeURIComponent(otp)}`,
      {}, // body rỗng
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OTP verification response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in OTP verification:", error);
    if (error.response?.data?.message) {
      // Xử lý các trường hợp lỗi cụ thể từ BE
      switch (error.response.data.statusCode) {
        case 400:
          throw new Error("OTP không hợp lệ hoặc đã hết hạn");
        case 404:
          throw new Error("Không tìm thấy tài khoản với email này");
        default:
          throw new Error(error.response.data.message);
      }
    }
    throw error;
  }
};
