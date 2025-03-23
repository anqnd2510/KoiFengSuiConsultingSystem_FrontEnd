import apiClient from "./apiClient";

const ANSWER_ENDPOINT = "/Answer";

export const getAnswerById = async (answerId) => {
  try {
    // Kiểm tra token đăng nhập
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token);

    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    if (!answerId) {
      throw new Error("ID đáp án không được để trống");
    }

    console.log("Gọi API lấy đáp án với ID:", answerId);
    const response = await apiClient.get(`${ANSWER_ENDPOINT}/get-by/${answerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("API Response:", response);

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

    // Log request để debug
    console.log(`Gọi API PUT /Answer/update-by/${answerId}`, {
      body: answerRequest
    });

    const response = await apiClient.put(`/Answer/update-by/${answerId}`, answerRequest, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Log response để debug
    console.log("Response from update answer:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error in updateAnswer:", error);
    throw error;
  }
};
