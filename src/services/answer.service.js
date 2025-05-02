import apiClient from "./apiClient";

const ANSWER_ENDPOINT = "/Answer";

export const getAnswerById = async (answerId) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    if (!answerId) {
      throw new Error("ID đáp án không được để trống");
    }

    const response = await apiClient.get(
      `${ANSWER_ENDPOINT}/get-by/${answerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.isSuccess) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Không thể tải thông tin đáp án");
  } catch (error) {
    console.error("Error in getAnswerById:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi tải thông tin đáp án");
  }
};
