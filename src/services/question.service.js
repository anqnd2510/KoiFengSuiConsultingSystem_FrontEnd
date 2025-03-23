import axios from 'axios';

const QUESTION_ENDPOINT = 'http://localhost:5261/api/Question';

// Tạo instance axios riêng cho question service
const questionApiClient = axios.create({
  baseURL: 'http://localhost:5261'
});

export const getQuestionsByQuizId = async (quizId) => {
  try {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token);

    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    console.log('Fetching questions for quizId:', quizId);
    const response = await questionApiClient.get(`${QUESTION_ENDPOINT}/quiz/${quizId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('API Response:', response);

    if (response.data.isSuccess) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Không thể tải danh sách câu hỏi");
  } catch (error) {
    console.error('Error in getQuestionsByQuizId:', error);
    throw new Error(error.message || "Có lỗi xảy ra khi tải danh sách câu hỏi");
  }
};

export const createQuestion = async (quizId, questionRequest) => {
  try {
    const token = localStorage.getItem('accessToken');
    console.log('Token:', token);

    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    console.log('Creating question for quizId:', quizId);
    console.log('Question request:', questionRequest);

    const response = await questionApiClient.post(`${QUESTION_ENDPOINT}/quiz/${quizId}`, questionRequest, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('API Response:', response);

    if (response.data.isSuccess) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Không thể tạo câu hỏi mới");
  } catch (error) {
    console.error('Error in createQuestion:', error);
    throw new Error(error.message || "Có lỗi xảy ra khi tạo câu hỏi mới");
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

    const response = await questionApiClient.put(`${QUESTION_ENDPOINT}/${questionId}`, questionRequest, {
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

    const response = await questionApiClient.delete(`${QUESTION_ENDPOINT}/${questionId}`, {
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
