import apiClient from "./apiClient";

const ANSWER_ENDPOINT = "/Answer";

export const getAnswerById = async (answerId) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    if (!answerId) {
      throw new Error("ID đáp án không được để trống");
    }

    const response = await apiClient.get(`${ANSWER_ENDPOINT}/get-by/${answerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.isSuccess) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Không thể tải thông tin đáp án");
  } catch (error) {
    console.error("Error in getAnswerById:", error);
    throw new Error(error.message || "Có lỗi xảy ra khi tải thông tin đáp án");
  }
};

export const updateAnswer = async (answerId, answerRequest) => {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Chuẩn bị request body theo đúng model AnswerRequest
    const requestBody = {
      AnswerId: answerId,               // Thêm AnswerId vào request
      QuestionId: answerRequest.questionId, // Thêm QuestionId nếu cần
      OptionText: answerRequest.optionText.trim(),
      IsCorrect: answerRequest.isCorrect
    };

    // Log request để debug
    console.log("[UpdateAnswer] Request:", {
      url: `${ANSWER_ENDPOINT}/update-by/${answerId}`,
      body: requestBody
    });

    const response = await apiClient.put(
      `${ANSWER_ENDPOINT}/update-by/${answerId}`, 
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("[UpdateAnswer] Response:", response.data);
    
    return response.data;

  } catch (error) {
    console.error("[UpdateAnswer] Error:", {
      message: error.message,
      response: error.response?.data
    });

    if (error.response?.status === 400) {
      throw new Error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin đáp án");
    }
    throw error;
  }
};
