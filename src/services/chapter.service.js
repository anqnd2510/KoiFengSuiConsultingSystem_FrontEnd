import apiClient from "./apiClient";
import axios from "axios";

// Constants
const CHAPTER_ENDPOINT = "/Chapter";

/**
 * Lấy danh sách chương theo ID khóa học
 * @param {string} courseId - ID của khóa học
 * @returns {Promise} - Promise chứa dữ liệu danh sách chương
 */
export const getChaptersByCourseId = async (courseId) => {
  try {
    if (!courseId) {
      throw new Error("ID khóa học không được để trống");
    }

    console.log("Gọi API lấy danh sách chương cho khóa học ID:", courseId);

    const response = await apiClient.get(
      `${CHAPTER_ENDPOINT}/get-all-chapters-by-courseId`,
      {
        params: { id: courseId },
      }
    );

    console.log("Kết quả API lấy danh sách chương:", response.data);

    // Kiểm tra response
    if (!response.data) {
      throw new Error("Không nhận được dữ liệu từ server");
    }

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chương:", error);
    throw error;
  }
};

/**
 * Tạo chương mới cho khóa học
 * @param {FormData} formData - FormData chứa thông tin chương và file video
 * @returns {Promise} - Promise chứa kết quả tạo chương
 */
export const createChapter = async (formData) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Kiểm tra kích thước video trước khi gửi
    const videoFile = formData.get("Video");
    if (videoFile instanceof File) {
      console.log(
        `Kích thước file video: ${(videoFile.size / (1024 * 1024)).toFixed(
          2
        )} MB`
      );
      if (videoFile.size > 100 * 1024 * 1024) {
        // > 100MB
        throw new Error(
          "File video quá lớn. Vui lòng chọn file nhỏ hơn 100MB hoặc nén file trước khi tải lên."
        );
      }
    }

    // Log FormData để debug
    console.log("Sending chapter FormData to API:");
    for (let pair of formData.entries()) {
      console.log(
        pair[0] +
          ": " +
          (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1])
      );
    }

    // Thử nhiều endpoint khác nhau nếu một endpoint không hoạt động
    let response;
    let errors = [];

    // Tăng timeout lên để xử lý file lớn
    const axiosConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      timeout: 120000, // 2 phút
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Tiến trình upload: ${percentCompleted}%`);
      },
    };

    // Thử endpoint chính
    try {
      console.log("Đang gửi request đến endpoint chính...");
      response = await axios.post(
        "https://koifengshui-001-site1.ltempurl.com/api/Chapter/create-chapter",
        formData,
        axiosConfig
      );
    } catch (error) {
      console.error("Lỗi khi gọi endpoint chính:", error.message);
      errors.push(error);

      // Thử endpoint thay thế
      try {
        console.log("Đang thử endpoint thay thế...");
        response = await axios.post(
          "https://koifengshui-001-site1.ltempurl.com/api/Chapter",
          formData,
          axiosConfig
        );
      } catch (backupError) {
        console.error("Lỗi khi gọi endpoint thay thế:", backupError.message);
        errors.push(backupError);
        throw new Error(
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau."
        );
      }
    }

    console.log("Kết quả API tạo chương:", response.data);

    // Trả về kết quả API
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo chương mới:", error);

    // Thông báo chi tiết về lỗi
    if (error.message.includes("timeout")) {
      throw new Error(
        "Quá thời gian tải file. File video quá lớn hoặc kết nối chậm. Vui lòng thử file nhỏ hơn."
      );
    }

    throw error;
  }
};

/**
 * Chuyển đổi số phút thành chuỗi định dạng "HH:MM:SS"
 * @param {number} minutes - Số phút
 * @returns {string} - Chuỗi định dạng thời gian
 */
const formatDurationToString = (minutes) => {
  if (!minutes && minutes !== 0) return "00:00:00";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMins = mins.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMins}:00`;
};

/**
 * Chuyển đổi chuỗi định dạng "HH:MM:SS" thành số phút
 * @param {string} durationString - Chuỗi định dạng thời gian
 * @returns {number} - Số phút
 */
const convertDurationToMinutes = (durationString) => {
  if (!durationString) return 0;

  const parts = durationString.split(":");
  if (parts.length >= 2) {
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    return hours * 60 + minutes;
  }

  return 0;
};

/**
 * Định dạng thời lượng từ phút sang định dạng giờ:phút
 * @param {number} minutes - Thời lượng tính bằng phút
 * @returns {string} - Chuỗi định dạng thời lượng
 */
export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return "N/A";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours} giờ ${mins > 0 ? `${mins} phút` : ""}`;
  }
  return `${mins} phút`;
};

/**
 * Cập nhật thông tin chương
 * @param {string} chapterId - ID của chương cần cập nhật
 * @param {FormData} formData - FormData chứa thông tin cập nhật và file video
 * @returns {Promise} - Promise chứa kết quả cập nhật chương
 */
export const updateChapter = async (chapterId, formData) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    if (!chapterId) {
      throw new Error("ID chương không được để trống");
    }

    // Log FormData để debug
    console.log(
      "Sending updated chapter FormData to API for chapterId:",
      chapterId
    );
    for (let pair of formData.entries()) {
      console.log(
        pair[0] +
          ": " +
          (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1])
      );
    }

    // Gọi API cập nhật chương
    const response = await axios.put(
      `https://koifengshui-001-site1.ltempurl.com/api/Chapter/update-chapter/${chapterId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Kết quả API cập nhật chương:", response.data);

    // Trả về kết quả API
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật chương:", error);
    throw error;
  }
};

/**
 * Xóa chương khỏi khóa học
 * @param {string} chapterId - ID của chương cần xóa
 * @returns {Promise} - Promise chứa kết quả xóa chương
 */
export const deleteChapter = async (chapterId) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    if (!chapterId) {
      throw new Error("ID chương không được để trống");
    }

    console.log("Gọi API xóa chương với ID:", chapterId);

    const response = await apiClient.delete(
      `${CHAPTER_ENDPOINT}/delete-chapter/${chapterId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Kết quả API xóa chương:", response.data);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa chương:", error);
    throw error;
  }
};
