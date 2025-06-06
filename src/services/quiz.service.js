import axios from "axios";
import apiClient from "./apiClient";

const QUIZ_ENDPOINT = "/Quiz";

export const getQuizzesByCourseId = async (courseId) => {
  try {
    console.log("Calling API with courseId:", courseId);
    const response = await apiClient.get(
      `${QUIZ_ENDPOINT}/by-course/${courseId}`
    );
    console.log("API Response:", response);

    // Kiểm tra response
    if (response.data.isSuccess) {
      const quizData = response.data.data;
      // Nếu là object đơn lẻ, chuyển thành mảng
      if (quizData && !Array.isArray(quizData)) {
        return [quizData];
      }
      return quizData || [];
    } else {
      throw new Error(
        response.data.message || "Có lỗi xảy ra khi tải danh sách bài kiểm tra"
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    throw (
      error.response?.data?.message ||
      error.message ||
      "Có lỗi xảy ra khi tải danh sách bài kiểm tra"
    );
  }
};

export const getQuizById = async (id) => {
  try {
    const response = await apiClient.get(`${QUIZ_ENDPOINT}/${id}`);
    if (response.data.isSuccess) {
      return response.data.data || null;
    } else {
      throw new Error(
        response.data.message || "Có lỗi xảy ra khi tải chi tiết bài kiểm tra"
      );
    }
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Có lỗi xảy ra khi tải chi tiết bài kiểm tra"
    );
  }
};

export const createQuiz = async (courseId, quizRequest) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem("accessToken");
    console.log("Token:", token);

    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Tạo request body
    const requestBody = {
      title: quizRequest.title,
      score: quizRequest.score,
    };

    console.log("Request body:", requestBody);

    const response = await apiClient.post(
      `${QUIZ_ENDPOINT}/${courseId}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response);

    if (response.data.isSuccess) {
      return response.data.data;
    }

    throw new Error(response.data.message);
  } catch (error) {
    console.error("Error in createQuiz:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi tạo bài kiểm tra");
  }
};

export const updateQuiz = async (courseId, quizRequest) => {
  try {
    const token = localStorage.getItem("accessToken");
    console.log("Token:", token);

    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    const requestBody = {
      title: quizRequest.title,
      score: quizRequest.score,
      quizId: quizRequest.quizId,
    };

    console.log("Update quiz request body:", requestBody);

    const response = await apiClient.put(
      `${QUIZ_ENDPOINT}/${courseId}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("API Response:", response);

    if (response.data.isSuccess) {
      return response.data.data;
    }

    throw new Error(response.data.message);
  } catch (error) {
    console.error("Error in updateQuiz:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi cập nhật bài kiểm tra");
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    if (!quizId) {
      throw new Error("ID bài kiểm tra không được để trống");
    }

    console.log("Gọi API xóa bài kiểm tra với ID:", quizId);

    const response = await apiClient.delete(`${QUIZ_ENDPOINT}/${quizId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Kết quả API xóa bài kiểm tra:", response.data);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa bài kiểm tra:", error);
    throw error;
  }
};

export const importQuiz = async (formData) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // In thông tin file để debug
    const file = formData.get("file");
    console.log(
      "File in FormData:",
      file
        ? {
            name: file.name,
            size: file.size,
            type: file.type,
          }
        : "No file found"
    );

    console.log("QuizId in FormData:", formData.get("quizId"));

    // Sửa endpoint API đúng với server
    const response = await axios.post(
      "https://koifengshui-001-site1.ltempurl.com/api/Upload/UploadExcelFile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        // Thêm timeout dài hơn vì upload file có thể mất thời gian
        timeout: 60000, // 60 giây
      }
    );

    console.log("Import response:", response);

    // Xử lý các trường hợp phản hồi
    if (response.data && typeof response.data === "object") {
      // Trường hợp 1: API trả về đúng định dạng {isSuccess, data, message}
      if (response.data.hasOwnProperty("isSuccess")) {
        return response.data;
      }

      // Trường hợp 2: API trả về trực tiếp dữ liệu array
      if (Array.isArray(response.data)) {
        return {
          isSuccess: true,
          data: response.data,
          message: "Import thành công",
        };
      }

      // Trường hợp khác
      return {
        isSuccess: true,
        data: [response.data], // Wrap vào mảng nếu là object đơn lẻ
        message: "Import thành công",
      };
    }

    throw new Error("Định dạng dữ liệu không hợp lệ");
  } catch (error) {
    console.error("Error in importQuiz:", error);
    // Hiển thị chi tiết lỗi để debug
    if (error.response) {
      // Server trả về lỗi
      console.error("Server error:", error.response.data);
      console.error("Status code:", error.response.status);
      throw new Error(
        `Lỗi server (${error.response.status}): ${
          error.response.data.message || JSON.stringify(error.response.data)
        }`
      );
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      console.error("No response:", error.request);
      throw new Error("Không nhận được phản hồi từ server");
    } else {
      // Lỗi khác
      throw new Error(error.message || "Có lỗi xảy ra khi import bài kiểm tra");
    }
  }
};
