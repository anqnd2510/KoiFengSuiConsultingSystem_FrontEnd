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

    // Log FormData để debug
    console.log("Sending chapter FormData to API:");
    for (let pair of formData.entries()) {
      console.log(
        pair[0] +
          ": " +
          (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1])
      );
    }

    const response = await axios.post(
      "http://localhost:5261/api/Chapter/create-chapter",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Kết quả API tạo chương:", response.data);

    // Trả về kết quả API
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo chương mới:", error);
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
      `http://localhost:5261/api/Chapter/update-chapter/${chapterId}`,
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
