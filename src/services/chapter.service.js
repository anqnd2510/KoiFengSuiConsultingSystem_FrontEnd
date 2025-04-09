import apiClient from "./apiClient";

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
 * @param {Object} chapterData - Dữ liệu của chương mới
 * @returns {Promise} - Promise chứa kết quả tạo chương
 */
export const createChapter = async (chapterData) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    if (!chapterData.courseId) {
      throw new Error("ID khóa học không được để trống");
    }

    console.log("Dữ liệu trước khi chuyển đổi:", chapterData);

    // Chuyển đổi dữ liệu để phù hợp với định dạng API Swagger
    const chapterRequest = {
      title: chapterData.chapterName,
      description: chapterData.description,
      duration: formatDurationToString(chapterData.duration), // Chuyển số phút thành chuỗi "HH:MM:SS"
      video: chapterData.videoUrl || "",
      courseId: chapterData.courseId,
      // Các trường khác nếu cần
    };

    console.log("Gọi API tạo chương mới với dữ liệu:", chapterRequest);

    const response = await apiClient.post(
      `${CHAPTER_ENDPOINT}/create-chapter`,
      chapterRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Kết quả API tạo chương:", response.data);

    // Chuyển đổi dữ liệu trả về để phù hợp với cấu trúc dữ liệu trong ứng dụng
    if (response.data && response.data.isSuccess && response.data.data) {
      const responseData = response.data;
      responseData.data = {
        chapterId: responseData.data.chapterId,
        chapterName: responseData.data.title,
        description: responseData.data.description,
        duration: convertDurationToMinutes(responseData.data.duration),
        videoUrl: responseData.data.video,
        order: chapterData.order, // Giữ lại thứ tự từ dữ liệu gửi đi
        content: chapterData.content || "",
        resourceUrl: chapterData.resourceUrl || "",
      };
      return responseData;
    }

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
 * @param {Object} chapterData - Dữ liệu cập nhật của chương
 * @returns {Promise} - Promise chứa kết quả cập nhật chương
 */
export const updateChapter = async (chapterData) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    if (!chapterData.chapterId) {
      throw new Error("ID chương không được để trống");
    }

    if (!chapterData.courseId) {
      throw new Error("ID khóa học không được để trống");
    }

    console.log("Dữ liệu chương trước khi chuyển đổi:", chapterData);

    // Chuyển đổi dữ liệu để phù hợp với định dạng API Swagger
    const chapterRequest = {
      chapterId: chapterData.chapterId,
      title: chapterData.chapterName,
      description: chapterData.description,
      duration: formatDurationToString(chapterData.duration), // Chuyển số phút thành chuỗi "HH:MM:SS"
      video: chapterData.videoUrl || "",
      courseId: chapterData.courseId,
      // Các trường khác nếu cần
      order: chapterData.order || 0,
      content: chapterData.content || "",
    };

    console.log("Gọi API cập nhật chương với dữ liệu:", chapterRequest);

    const response = await apiClient.put(
      `${CHAPTER_ENDPOINT}/update-chapter/${chapterData.chapterId}`,
      chapterRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Kết quả API cập nhật chương:", response.data);

    // Chuyển đổi dữ liệu trả về để phù hợp với cấu trúc dữ liệu trong ứng dụng
    if (response.data && response.data.isSuccess && response.data.data) {
      const responseData = response.data;
      responseData.data = {
        id: responseData.data.chapterId,
        title: responseData.data.title,
        description: responseData.data.description,
        duration: convertDurationToMinutes(responseData.data.duration),
        videoUrl: responseData.data.video,
        order: chapterData.order,
        content: responseData.data.content || chapterData.content || "",
        resourceUrl: chapterData.resourceUrl || "",
      };
      return responseData;
    }

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
