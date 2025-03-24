import axios from 'axios';

const API_URL = 'http://localhost:5261/api';

// Cấu hình axios
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = false; // Không gửi credentials (cookies) trong CORS requests

// Cấu hình axios interceptors
axios.interceptors.request.use(
  config => {
    console.log(`Gửi request đến: ${config.url}`, config);
    return config;
  },
  error => {
    console.error('Lỗi khi gửi request:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    console.log(`Nhận response từ: ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.error('Lỗi response:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('Không nhận được response:', error.request);
    } else {
      console.error('Lỗi cấu hình request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Service cho cá Koi
const KoiFishService = {
  // Lấy danh sách tất cả cá Koi
  getAllKoiFish: async () => {
    try {
      // Thử sử dụng API thực tế
      const response = await axios.get(`${API_URL}/KoiVariety`);
      console.log('API response:', response);
      return response.data.data || [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cá Koi:", error);
      
      // Nếu useMockData = false, vẫn throw error
      if (!useMockData) {
        throw error;
      }
      
      // Nếu useMockData = true, sử dụng mock data
      console.log("Chuyển sang sử dụng mock data do lỗi API");
      return mockData;
    }
  },

  // Lấy thông tin chi tiết một cá Koi theo ID
  getKoiFishById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/KoiVariety/${id}`);
      return response.data.data || {};
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin cá Koi ID ${id}:`, error);
      
      if (!useMockData) {
        throw error;
      }
      
      console.log(`Chuyển sang sử dụng mock data cho ID: ${id}`);
      const koiDetail = mockData.find(item => item.id === id);
      if (!koiDetail) {
        throw new Error("Không tìm thấy cá Koi với ID đã cho");
      }
      return koiDetail;
    }
  },

  // Tạo mới một cá Koi
  createKoiFish: async (koiFishData) => {
    try {
      const response = await axios.post(`${API_URL}/KoiVariety`, koiFishData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo mới cá Koi:", error);
      
      if (!useMockData) {
        throw error;
      }
      
      console.log("Chuyển sang sử dụng mock data cho tạo mới");
      return { 
        isSuccess: true, 
        responseCode: "Success", 
        statusCode: 200,
        message: "Đã tạo mới loài cá Koi thành công" 
      };
    }
  },

  // Cập nhật thông tin cá Koi
  updateKoiFish: async (id, koiFishData) => {
    try {
      const response = await axios.put(`${API_URL}/KoiVariety/${id}`, koiFishData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật cá Koi ID ${id}:`, error);
      
      if (!useMockData) {
        throw error;
      }
      
      console.log(`Chuyển sang sử dụng mock data cho cập nhật ID: ${id}`);
      return { 
        isSuccess: true, 
        responseCode: "Success", 
        statusCode: 200,
        message: "Đã cập nhật thông tin cá Koi thành công" 
      };
    }
  },

  // Xóa cá Koi
  deleteKoiFish: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/KoiVariety/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa cá Koi ID ${id}:`, error);
      
      if (!useMockData) {
        throw error;
      }
      
      console.log(`Chuyển sang sử dụng mock data cho xóa ID: ${id}`);
      return { 
        isSuccess: true, 
        responseCode: "Success", 
        statusCode: 200,
        message: "Đã xóa cá Koi thành công" 
      };
    }
  }
};

// Thêm mock data để test khi API chưa hoạt động
const mockData = [
  {
    id: "B976C9EE-A117-402F-9",
    varietyName: "Kohaku",
    description: null,
    colors: [
      {
        colorName: "Red",
        colorCode: "#FF0000",
        percentage: 60
      },
      {
        colorName: "White",
        colorCode: "#FFFFFF",
        percentage: 40
      }
    ]
  },
  {
    id: "C976C9EE-A117-402F-8",
    varietyName: "Showa",
    description: "Showa là một trong những giống cá Koi phổ biến nhất, với màu đen, đỏ và trắng.",
    colors: [
      {
        colorName: "Black",
        colorCode: "#000000",
        percentage: 40
      },
      {
        colorName: "Red",
        colorCode: "#FF0000",
        percentage: 30
      },
      {
        colorName: "White",
        colorCode: "#FFFFFF",
        percentage: 30
      }
    ]
  },
  {
    id: "D976C9EE-A117-402F-7",
    varietyName: "Sanke",
    description: "Sanke (Taisho Sanshoku) là giống cá Koi có ba màu: trắng, đỏ và đen.",
    colors: [
      {
        colorName: "White",
        colorCode: "#FFFFFF",
        percentage: 60
      },
      {
        colorName: "Red",
        colorCode: "#FF0000",
        percentage: 25
      },
      {
        colorName: "Black",
        colorCode: "#000000",
        percentage: 15
      }
    ]
  }
];

// Sử dụng mock data khi API chưa hoạt động
const useMockData = false;

export default KoiFishService;
