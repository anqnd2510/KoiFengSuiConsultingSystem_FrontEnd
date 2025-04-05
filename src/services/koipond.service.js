import axios from 'axios';

const API_URL = 'http://localhost:5261/api';

const KoiPondService = {
  testApiConnection: async () => {
    try {
      const response = await axios.get(`${API_URL}/KoiPond/get-all`);
      console.log('API connection test successful:', response);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('API connection test failed:', error);
      return {
        success: false,
        error: error
      };
    }
  },

  getKoiPondById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/KoiPond/${id.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching koi pond by id:', error);
      throw error;
    }
  },
  
  getAllKoiPonds: async () => {
    try {
      const response = await axios.get(`${API_URL}/KoiPond/get-all`);
      console.log('API response structure:', response);
      
      // Đảm bảo trả về đúng cấu trúc dữ liệu
      if (response.data && response.data.data) {
        console.log('Pond data structure:', response.data.data);
        return response.data;
      } else if (response.data) {
        console.log('Pond data structure:', response.data);
        return { data: response.data };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching all koi ponds:', error);
      throw error;
    }
  },
  
  getPondShapes: async () => {
    try {
      const response = await axios.get(`${API_URL}/PondShape/get-all`);
      console.log('Pond shapes response:', response.data);
      
      // Đảm bảo trả về đúng cấu trúc dữ liệu
      if (response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        console.warn('Unexpected pond shapes data structure:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching pond shapes:', error);
      throw error;
    }
  },
  
  createPond: async (pondData) => {
    try {
      console.log('Creating pond with data:', pondData);
      
      const koiPondRequest = {
        pondName: pondData.pondName || '',
        element: pondData.element || '',
        introduction: pondData.introduction || '',
        description: pondData.description || ''
      };
      
      console.log('Formatted request data:', koiPondRequest);
      
      const response = await axios.post(`${API_URL}/KoiPond/create`, koiPondRequest, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      console.log('Create pond response:', response);
      return response.data;
    } catch (error) {
      console.error('Error creating koi pond:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      throw error;
    }
  },
  
  deletePond: async (id) => {
    try {
      console.log('Deleting pond with ID:', id);
      
      // Đảm bảo ID là chuỗi hợp lệ
      if (!id) {
        throw new Error('ID không hợp lệ');
      }
      
      // Sử dụng đúng endpoint theo API backend
      const response = await axios({
        method: 'DELETE',
        url: `${API_URL}/KoiPond/${id.toString()}`,
        timeout: 15000, // 15 giây
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Delete pond response:', response);
      
      // Sau khi xóa thành công, lấy lại danh sách hồ cá mới nhất
      if (response && (response.status === 200 || response.status === 204)) {
        try {
          console.log('Xóa thành công, đang lấy danh sách mới...');
          const updatedPonds = await KoiPondService.getAllKoiPonds();
          console.log('Updated ponds after deletion:', updatedPonds);
          
          // Đảm bảo trả về đúng cấu trúc dữ liệu
          return {
            isSuccess: true,
            message: 'Xóa hồ cá thành công',
            updatedPonds: updatedPonds
          };
        } catch (fetchError) {
          console.error('Error fetching updated ponds after deletion:', fetchError);
          // Vẫn trả về thành công nhưng không có danh sách mới
          return {
            isSuccess: true,
            message: 'Xóa hồ cá thành công, nhưng không thể lấy danh sách mới',
            error: fetchError
          };
        }
      }
      
      // Nếu không phải status 200/204, trả về dữ liệu từ response
      return {
        isSuccess: response.status >= 200 && response.status < 300,
        message: response.data?.message || 'Kết quả không xác định',
        data: response.data
      };
    } catch (error) {
      console.error('Error deleting koi pond:', error);
      
      // Xử lý lỗi chi tiết hơn
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        // Nếu lỗi 500, có thể là vấn đề với backend
        if (error.response.status === 500) {
          console.error('Backend error - possible database constraint or entity relationship issue');
          // Trả về lỗi có cấu trúc để frontend có thể hiển thị thông báo phù hợp
          return {
            isSuccess: false,
            message: error.response.data?.message || 'Lỗi khi xóa hồ cá: Có thể hồ cá đang được tham chiếu bởi dữ liệu khác',
            statusCode: error.response.status,
            data: null
          };
        }
        
        // Trả về lỗi từ API
        return {
          isSuccess: false,
          message: error.response.data?.message || `Lỗi ${error.response.status}: Không thể xóa hồ cá`,
          statusCode: error.response.status,
          data: null
        };
      } else if (error.request) {
        console.error('No response received:', error.request);
        // Lỗi không nhận được phản hồi từ server
        return {
          isSuccess: false,
          message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
          statusCode: 0,
          data: null
        };
      } else {
        console.error('Error message:', error.message);
        // Lỗi khác
        return {
          isSuccess: false,
          message: error.message || 'Đã xảy ra lỗi không xác định khi xóa hồ cá',
          statusCode: 0,
          data: null
        };
      }
    }
  },
  
  updateKoiPond: async (id, pondData) => {
    try {
      const koiPondRequest = {
        pondName: pondData.pondName || '',
        element: pondData.element || '',
        introduction: pondData.introduction || '',
        description: pondData.description || ''
      };
      
      const response = await axios.put(`${API_URL}/KoiPond/${id.toString()}`, koiPondRequest, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating koi pond:', error);
      throw error;
    }
  },
  
  uploadPondImage: async (id, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await axios.post(`${API_URL}/KoiPond/${id.toString()}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading pond image:', error);
      throw error;
    }
  }
};

export default KoiPondService;
