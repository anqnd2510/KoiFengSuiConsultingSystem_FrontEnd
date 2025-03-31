import apiClient from './apiClient';

// Cấu hình API endpoint
const KOI_ENDPOINT = '/KoiVariety';

// Service cho cá Koi
const KoiFishService = {
  // Lấy danh sách tất cả cá Koi
  getAllKoiFish: async () => {
    try {
      console.log('Gọi API lấy danh sách cá Koi');
      const response = await apiClient.get(`${KOI_ENDPOINT}/get-all`);
      console.log('API response:', response);
      
      // Kiểm tra cấu trúc phản hồi và truy cập trường data
      if (response.data && response.data.isSuccess && Array.isArray(response.data.data)) {
        // Đảm bảo dữ liệu hợp lệ trước khi trả về
        return response.data.data.map(item => ({
          id: item.koiVarietyId || item.id || 'unknown-id',
          varietyName: item.name || item.varietyName || 'Không có tên',
          description: item.description || null,
          colors: Array.isArray(item.colors) ? item.colors.map(color => ({
            colorName: color.colorName || 'Không tên',
            colorCode: color.colorCode || '#000000',
            percentage: color.percentage || 0
          })) : []
        }));
      }
      
      // Nếu phản hồi API không có cấu trúc mong đợi, trả về mảng rỗng
      console.warn('API không trả về dữ liệu đúng định dạng, trả về mảng rỗng');
      return [];
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
      const response = await apiClient.get(`${KOI_ENDPOINT}/${id}`);
      console.log('API response getKoiFishById:', response);
      
      // Kiểm tra cấu trúc phản hồi và truy cập trường data
      if (response.data && response.data.isSuccess && response.data.data) {
        const item = response.data.data;
        
        // Đảm bảo dữ liệu hợp lệ trước khi trả về
        return {
          id: item.koiVarietyId || item.id || 'unknown-id',
          varietyName: item.name || item.varietyName || 'Không có tên',
          description: item.description || null,
          colors: Array.isArray(item.colors) ? item.colors.map(color => ({
            colorName: color.colorName || 'Không tên',
            colorCode: color.colorCode || '#000000',
            percentage: color.percentage || 0
          })) : []
        };
      }
      
      console.warn('API không trả về dữ liệu chi tiết đúng định dạng');
      throw new Error("Không thể tải thông tin cá Koi");
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
      const response = await apiClient.post(`${KOI_ENDPOINT}`, koiFishData);
      
      // Kiểm tra cấu trúc phản hồi
      if (response.data && response.data.isSuccess) {
        return response.data;
      }
      
      throw new Error(response.data?.message || "Không thể tạo mới cá Koi");
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
      const response = await apiClient.put(`${KOI_ENDPOINT}/${id}`, koiFishData);
      
      // Kiểm tra cấu trúc phản hồi
      if (response.data && response.data.isSuccess) {
        return response.data;
      }
      
      throw new Error(response.data?.message || "Không thể cập nhật thông tin cá Koi");
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
      const response = await apiClient.delete(`${KOI_ENDPOINT}/${id}`);
      
      // Kiểm tra cấu trúc phản hồi
      if (response.data && response.data.isSuccess) {
        return response.data;
      }
      
      throw new Error(response.data?.message || "Không thể xóa cá Koi");
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
