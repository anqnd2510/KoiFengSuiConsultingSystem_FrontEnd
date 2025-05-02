import apiClient from "./apiClient";
import axios from "axios";

// Cấu hình API endpoint
const KOI_ENDPOINT = "/KoiVariety";

// Service cho cá Koi
const KoiFishService = {
  // Lấy danh sách tất cả cá Koi
  getAllKoiFish: async () => {
    try {
      const response = await apiClient.get(`${KOI_ENDPOINT}/get-all`);

      // Kiểm tra cấu trúc phản hồi từ API BE
      if (
        response.data &&
        response.data.isSuccess &&
        Array.isArray(response.data.data)
      ) {
        // Cấu trúc API mới: { isSuccess: true, responseCode: "Success", statusCode: 200, data: [...] }
        return response.data.data.map((item) => ({
          id: item.koiVarietyId || item.id || "unknown-id",
          // Hỗ trợ cả name và varietyName từ API
          varietyName: item.varietyName || item.name || "Không có tên",
          description: item.description || null,
          introduction: item.introduction || item.description || null,
          imageUrl: item.imageUrl || null,
          varietyColors: Array.isArray(item.varietyColors)
            ? item.varietyColors.map((colorItem) => {
                // Xử lý cấu trúc dữ liệu mới với color là một đối tượng con
                return {
                  percentage: colorItem.percentage || 0,
                  colorName: colorItem.color?.colorName || "",
                  element: colorItem.color?.element || "",
                  colorId: colorItem.color?.colorId || colorItem.colorId || "",
                };
              })
            : [],
          totalPercentage: item.totalPercentage || 0,
          compatibilityScore: item.compatibilityScore || 0,
        }));
      }
      return [];
    } catch (error) {
      if (error.response?.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Lấy thông tin chi tiết một cá Koi theo ID
  getKoiFishById: async (id) => {
    try {
      console.log(`Gọi API để lấy thông tin chi tiết cá Koi ID: ${id}`);
      const response = await apiClient.get(`${KOI_ENDPOINT}/${id}`);
      console.log("API response getKoiFishById:", response.data);

      // Kiểm tra cấu trúc phản hồi từ API BE
      if (response.data && response.data.isSuccess && response.data.data) {
        const item = response.data.data;
        console.log("Dữ liệu gốc từ API:", item);

        // Khởi tạo mảng màu sắc mặc định nếu API không trả về
        let varietyColors = [];

        // Kiểm tra nếu có dữ liệu màu sắc từ API
        if (
          Array.isArray(item.varietyColors) &&
          item.varietyColors.length > 0
        ) {
          console.log("API trả về dữ liệu màu sắc:", item.varietyColors);
          varietyColors = item.varietyColors.map((colorItem) => {
            return {
              percentage: colorItem.percentage || 0,
              colorName:
                colorItem.color?.colorName || colorItem.colorName || "",
              element: colorItem.color?.element || colorItem.element || "",
              colorId: colorItem.color?.colorId || colorItem.colorId || "",
            };
          });
        } else {
          console.log("API không trả về dữ liệu màu sắc, sử dụng mảng trống");
        }

        // Đảm bảo dữ liệu hợp lệ trước khi trả về
        const processedData = {
          id: item.koiVarietyId || item.id || "unknown-id",
          // Hỗ trợ cả name và varietyName từ API
          varietyName: item.varietyName || item.name || "Không có tên",
          description: item.description || null,
          introduction: item.introduction || item.description || null,
          imageUrl: item.imageUrl || null,
          varietyColors: varietyColors,
          totalPercentage: item.totalPercentage || 0,
          compatibilityScore: item.compatibilityScore || 0,
        };

        console.log("Dữ liệu đã xử lý cuối cùng:", processedData);
        return processedData;
      }

      console.warn("API không trả về dữ liệu chi tiết đúng định dạng");
      throw new Error("Không thể tải thông tin cá Koi");
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin cá Koi ID ${id}:`, error);
      throw error;
    }
  },

  // Tạo mới một cá Koi
  createKoiFish: async (koiFishData) => {
    try {
      console.log("Creating koi fish with data:", koiFishData);

      // Tạo FormData để gửi dữ liệu và file
      const formData = new FormData();

      // Xử lý các trường dữ liệu theo API mới
      formData.append("VarietyName", koiFishData.get("VarietyName"));
      formData.append("Description", koiFishData.get("Description"));
      formData.append("Introduction", koiFishData.get("Introduction"));

      // Xử lý file ảnh
      const imageFile = koiFishData.get("ImageFile");
      if (imageFile instanceof File) {
        console.log("Đính kèm file:", imageFile.name, imageFile.size, "bytes");
        formData.append("ImageUrl", imageFile);
      }

      // Xử lý dữ liệu màu sắc - lấy trực tiếp từ FormData
      const varietyColorsJson = koiFishData.get("VarietyColorsJson");
      console.log("Dữ liệu màu sắc từ form:", varietyColorsJson);

      // Thêm trực tiếp vào FormData mới
      formData.append("VarietyColorsJson", varietyColorsJson);

      // Log dữ liệu cuối cùng trước khi gửi
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        console.log(
          pair[0] +
            ": " +
            (pair[1] instanceof File
              ? `File ${pair[1].name} (${pair[1].size} bytes)`
              : pair[1])
        );
      }

      // Gửi request với Content-Type là multipart/form-data
      const response = await axios({
        method: "post",
        url: "https://koifengshui-001-site1.ltempurl.com/api/KoiVariety/create",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      console.log("Create koi fish response:", response);
      return response.data;
    } catch (error) {
      console.error("Lỗi chi tiết khi tạo mới cá Koi:", error);
      if (error.response) {
        console.error("Response error data:", error.response.data);
        console.error("Response error status:", error.response.status);
        console.error("Response error headers:", error.response.headers);
        throw new Error(
          error.response.data?.title ||
            error.response.data?.message ||
            error.response.data?.errors?.join(", ") ||
            "Không thể tạo mới cá Koi"
        );
      }
      throw error;
    }
  },

  // Cập nhật thông tin cá Koi
  updateKoiFish: async (id, formData) => {
    try {
      console.log(`Cập nhật cá Koi ID ${id} với dữ liệu:`, formData);

      // Log dữ liệu FormData trước khi gửi
      console.log("FormData entries trước khi gửi:");
      for (let pair of formData.entries()) {
        console.log(
          pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
        );
      }

      // Gửi request PUT với FormData
      const response = await axios({
        method: "put",
        url: `https://koifengshui-001-site1.ltempurl.com/api/KoiVariety/${id}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(`Kết quả cập nhật cá Koi ID ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật cá Koi ID ${id}:`, error);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
        throw new Error(
          error.response.data?.message ||
            error.response.data?.title ||
            "Không thể cập nhật cá Koi"
        );
      }
      throw error;
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
      throw error;
    }
  },
  getColors: async () => {
    try {
      console.log("Đang gọi API để lấy danh sách màu sắc...");
      const response = await apiClient.get(`${KOI_ENDPOINT}/get-colors`);
      console.log("Phản hồi API getColors:", response.data);

      // Kiểm tra cấu trúc phản hồi và log chi tiết
      if (
        response.data &&
        response.data.isSuccess &&
        Array.isArray(response.data.data)
      ) {
        console.log("Số lượng màu từ API:", response.data.data.length);
        console.log("Mẫu dữ liệu màu đầu tiên:", response.data.data[0]);
      } else {
        console.warn(
          "Cấu trúc dữ liệu màu không đúng định dạng:",
          response.data
        );
      }

      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách màu sắc:", error);
      throw error;
    }
  },

  // Thêm màu sắc mới
  createColor: async (colorData) => {
    try {
      console.log("Đang tạo màu sắc mới với dữ liệu:", colorData);

      const response = await apiClient.post(`${KOI_ENDPOINT}/create-color`, {
        colorName: colorData.colorName,
        colorCode: colorData.colorCode,
        element: colorData.element,
      });

      console.log("Phản hồi từ API tạo màu:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo màu sắc:", error);
      throw error;
    }
  },
};

export default KoiFishService;
