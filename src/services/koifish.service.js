import apiClient from "./apiClient";
import axios from "axios";

// Cấu hình API endpoint
const KOI_ENDPOINT = "/KoiVariety";

// Service cho cá Koi
const KoiFishService = {
  // Lấy danh sách tất cả cá Koi
  getAllKoiFish: async () => {
    try {
      console.log("Gọi API lấy danh sách cá Koi");
      const response = await apiClient.get(`${KOI_ENDPOINT}/get-all`);
      console.log("API response:", response);

      // Kiểm tra cấu trúc phản hồi từ API BE
      if (
        response.data &&
        response.data.isSuccess &&
        Array.isArray(response.data.data)
      ) {
        // Cấu trúc API mới: { isSuccess: true, responseCode: "Success", statusCode: 200, data: [...] }
        return response.data.data.map((item) => ({
          id: item.koiVarietyId || item.id || "unknown-id",
          varietyName: item.varietyName || "Không có tên",
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

      // Nếu phản hồi API không có cấu trúc mong đợi, trả về mảng rỗng
      console.warn("API không trả về dữ liệu đúng định dạng, trả về mảng rỗng");
      return [];
    } catch (error) {
      console.error("Lỗi khi lấy danh sách cá Koi:", error);
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

        // Check varietyColors structure
        if (item.varietyColors) {
          console.log("Cấu trúc varietyColors gốc:", item.varietyColors);
        }

        // Đảm bảo dữ liệu hợp lệ trước khi trả về
        const processedData = {
          id: item.koiVarietyId || item.id || "unknown-id",
          varietyName: item.varietyName || "Không có tên",
          description: item.description || null,
          introduction: item.introduction || item.description || null,
          imageUrl: item.imageUrl || null,
          varietyColors: Array.isArray(item.varietyColors)
            ? item.varietyColors.map((colorItem) => {
                // Xử lý cấu trúc dữ liệu mới với color là một đối tượng con
                console.log("Xử lý item màu:", colorItem);

                const colorData = {
                  percentage: colorItem.percentage || 0,
                  colorName:
                    colorItem.color?.colorName || colorItem.colorName || "",
                  element: colorItem.color?.element || colorItem.element || "",
                  colorId: colorItem.color?.colorId || colorItem.colorId || "",
                };

                console.log("Sau khi xử lý:", colorData);
                return colorData;
              })
            : [],
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
      formData.append("VarietyName", koiFishData.varietyName || "");
      formData.append("Description", koiFishData.description || "");
      formData.append(
        "Introduction",
        koiFishData.introduction || koiFishData.description || ""
      );

      // Xử lý file ảnh nếu có
      if (koiFishData.imageFile && koiFishData.imageFile instanceof File) {
        console.log(
          "Đính kèm file:",
          koiFishData.imageFile.name,
          koiFishData.imageFile.size,
          "bytes"
        );
        formData.append("ImageUrl", koiFishData.imageFile);
      }

      // Xử lý mảng VarietyColors (nếu có)
      // Nếu không có màu sắc hoặc mảng trống, gửi một mảng JSON rỗng
      let colorsJson = "[]";

      if (
        koiFishData.varietyColors &&
        Array.isArray(koiFishData.varietyColors) &&
        koiFishData.varietyColors.length > 0
      ) {
        // Chuyển đổi dữ liệu màu sắc theo định dạng API yêu cầu
        const colorsData = koiFishData.varietyColors
          .filter((color) => color.colorId || color.name) // Chỉ giữ lại những màu có colorId hoặc name
          .map((color) => ({
            colorId: color.colorId || "",
            percentage: color.percentage || Math.round(color.value * 100) || 0,
          }));

        // Nếu vẫn có dữ liệu sau khi lọc
        if (colorsData.length > 0) {
          colorsJson = JSON.stringify(colorsData);
        }
      }

      // Luôn gửi VarietyColorsJson, ngay cả khi là mảng rỗng
      formData.append("VarietyColorsJson", colorsJson);
      console.log("Color data being sent:", colorsJson);

      // Log dữ liệu để debug
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

      // Gửi request với Content-Type là multipart/form-data nhưng không tự động thiết lập boundary
      const response = await axios.post(
        "http://localhost:5261/api/KoiVariety/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Create koi fish response:", response);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo mới cá Koi:", error);
      if (error.response) {
        // Server trả về response với status code nằm ngoài phạm vi 2xx
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
        console.error("Server response headers:", error.response.headers);
      } else if (error.request) {
        // Request đã được tạo nhưng không nhận được response
        console.error("No response received:", error.request);
      } else {
        // Có lỗi khi thiết lập request
        console.error("Request error:", error.message);
      }
      throw error;
    }
  },

  // Cập nhật thông tin cá Koi
  updateKoiFish: async (id, koiFishData) => {
    try {
      console.log(`Cập nhật cá Koi ID ${id} với dữ liệu:`, koiFishData);

      // Tạo FormData để gửi dữ liệu và file
      const formData = new FormData();

      // Xử lý các trường dữ liệu theo API mới
      formData.append("VarietyName", koiFishData.varietyName || "");
      formData.append("Description", koiFishData.description || "");
      formData.append(
        "Introduction",
        koiFishData.introduction || koiFishData.description || ""
      );

      // Xử lý file ảnh nếu có
      if (koiFishData.imageFile && koiFishData.imageFile instanceof File) {
        console.log(
          "Đính kèm file:",
          koiFishData.imageFile.name,
          koiFishData.imageFile.size,
          "bytes"
        );
        formData.append("ImageUrl", koiFishData.imageFile);
      }

      // Xử lý mảng VarietyColors (nếu có)
      // Nếu không có màu sắc hoặc mảng trống, gửi một mảng JSON rỗng
      let colorsJson = "[]";

      if (
        koiFishData.varietyColors &&
        Array.isArray(koiFishData.varietyColors) &&
        koiFishData.varietyColors.length > 0
      ) {
        // Chuyển đổi dữ liệu màu sắc theo định dạng API yêu cầu
        const colorsData = koiFishData.varietyColors
          .filter((color) => color.colorId || color.name) // Chỉ giữ lại những màu có colorId hoặc name
          .map((color) => ({
            colorId: color.colorId || "",
            percentage: color.percentage || Math.round(color.value * 100) || 0,
          }));

        // Nếu vẫn có dữ liệu sau khi lọc
        if (colorsData.length > 0) {
          colorsJson = JSON.stringify(colorsData);
        }
      }

      // Luôn gửi VarietyColorsJson, ngay cả khi là mảng rỗng
      formData.append("VarietyColorsJson", colorsJson);
      console.log("Color data being sent:", colorsJson);

      // Log dữ liệu để debug
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
      const response = await axios.put(
        `http://localhost:5261/api/KoiVariety/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(`Kết quả cập nhật cá Koi ID ${id}:`, response);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật cá Koi ID ${id}:`, error);
      if (error.response) {
        // Server trả về response với status code nằm ngoài phạm vi 2xx
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
        console.error("Server response headers:", error.response.headers);
      } else if (error.request) {
        // Request đã được tạo nhưng không nhận được response
        console.error("No response received:", error.request);
      } else {
        // Có lỗi khi thiết lập request
        console.error("Request error:", error.message);
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
};

export default KoiFishService;
