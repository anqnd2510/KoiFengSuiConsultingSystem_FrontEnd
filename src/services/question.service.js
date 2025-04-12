import axios from 'axios';

const API_URL = 'http://localhost:5261/api'; // Thay bằng URL API của bạn

// Tạo instance axios riêng cho question service
const questionApiClient = axios.create({
  baseURL: 'http://localhost:5261'
});

export const getQuestionsByQuizId = async (quizId) => {
  const token = localStorage.getItem('accessToken');
  return await axios.get(`${API_URL}/Question/quiz/${quizId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getQuestionById = async (questionId) => {
  try {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    console.log('Fetching question:', questionId);

    const response = await questionApiClient.get(`${API_URL}/Question/${questionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response:', response);

    if (response.data.isSuccess) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Không thể lấy thông tin câu hỏi");
  } catch (error) {
    console.error('Error in getQuestionById:', error);
    throw new Error(error.message || "Có lỗi xảy ra khi lấy thông tin câu hỏi");
  }
};

export const createQuestion = async (quizId, questionData) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await axios.post(
      `${API_URL}/Question/quiz/${quizId}`,
      questionData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response;
  } catch (error) {
    console.error("Error in createQuestion:", error);
    throw error;
  }
};

export const updateQuestion = async (questionId, questionRequest) => {
  try {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token);

    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    console.log('Updating question:', questionId);
    console.log('Question request:', questionRequest);

    const response = await questionApiClient.put(`${API_URL}/Question/${questionId}`, questionRequest, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('API Response:', response);

    if (response.data.isSuccess) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Không thể cập nhật câu hỏi");
  } catch (error) {
    console.error('Error in updateQuestion:', error);
    throw new Error(error.message || "Có lỗi xảy ra khi cập nhật câu hỏi");
  }
};

export const deleteQuestion = async (questionId) => {
  try {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token);

    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    console.log('Deleting question:', questionId);

    const response = await questionApiClient.delete(`${API_URL}/Question/${questionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('API Response:', response);

    if (response.data.isSuccess) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Không thể xóa câu hỏi");
  } catch (error) {
    console.error('Error in deleteQuestion:', error);
    throw new Error(error.message || "Có lỗi xảy ra khi xóa câu hỏi");
  }
};
