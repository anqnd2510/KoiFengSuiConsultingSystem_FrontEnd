import axios from "axios";

// URL cơ sở cho API gói tư vấn
const BASE_URL =
  "https://koifengshui-001-site1.ltempurl.com/api/ConsultationPackage";

// Service cho Consultation Package
const ConsultationPackageService = {
  // Lấy tất cả các gói tư vấn
  getAllPackages: async () => {
    try {
      console.log("Gọi API lấy danh sách gói tư vấn:", `${BASE_URL}/get-all`);
      const response = await axios.get(`${BASE_URL}/get-all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching consultation packages:", error);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
      }
      throw error;
    }
  },

  // Lấy gói tư vấn theo ID
  getPackageById: async (id) => {
    try {
      console.log("Gọi API lấy chi tiết gói tư vấn:", `${BASE_URL}/get/${id}`);
      const response = await axios.get(`${BASE_URL}/get/${id}`);

      // Log dữ liệu phản hồi để debug
      console.log("Phản hồi API getPackageById:", response.data);

      // Kiểm tra dữ liệu và đảm bảo trường imageUrl được trả về
      if (response.data && response.data.isSuccess && response.data.data) {
        // Đảm bảo trường imageUrl được xử lý và trả về
        const packageData = response.data.data;
        console.log("Thông tin hình ảnh:", packageData.imageUrl);

        // Nếu không có imageUrl nhưng có imagePath, sử dụng imagePath
        if (!packageData.imageUrl && packageData.imagePath) {
          packageData.imageUrl = packageData.imagePath;
        }

        // Nếu imageUrl là đường dẫn tương đối, chuyển thành URL đầy đủ
        if (packageData.imageUrl && !packageData.imageUrl.startsWith("http")) {
          packageData.imageUrl = `https://koifengshui-001-site1.ltempurl.com${packageData.imageUrl}`;
        }
      }

      return response.data;
    } catch (error) {
      console.error(
        `Error fetching consultation package with ID ${id}:`,
        error
      );
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
      }
      throw error;
    }
  },

  // Tạo mới gói tư vấn
  createPackage: async (packageData) => {
    try {
      console.log("Tạo gói tư vấn với dữ liệu:", packageData);

      // Tạo FormData để gửi dữ liệu và file
      const formData = new FormData();

      // Thêm các trường thông tin vào formData - chú ý tên trường phải đúng cú pháp Pascal Case
      formData.append("PackageName", packageData.packageName || "");
      formData.append("MinPrice", packageData.minPrice || 0);
      formData.append("MaxPrice", packageData.maxPrice || 0);
      formData.append("Description", packageData.description || "");
      formData.append("SuitableFor", packageData.suitableFor || "");
      formData.append("RequiredInfo", packageData.requiredInfo || "");
      formData.append("PricingDetails", packageData.pricingDetails || "");

      // Xử lý file ảnh nếu có - thực hiện nhiều phương án khác nhau để thử
      if (packageData.imageFile && packageData.imageFile instanceof File) {
        console.log(
          "Đính kèm file ảnh:",
          packageData.imageFile.name,
          packageData.imageFile.size,
          "bytes"
        );
        // Thử thêm tất cả các tên trường có thể
        formData.append("Image", packageData.imageFile);
        formData.append("ImageFile", packageData.imageFile);
        formData.append("ImageUrl", packageData.imageFile);
      }

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

      // Sử dụng URL hoàn chỉnh với API endpoint đúng - thử thêm /api phía trước
      // Gửi cả hai URL cho chắc chắn
      let response;
      try {
        // URL 1: với /api ở đầu
        const apiUrl1 =
          "https://koifengshui-001-site1.ltempurl.com/api/ConsultationPackage/create";
        console.log("Thử gửi request đến URL 1:", apiUrl1);

        // Gửi request với Content-Type là multipart/form-data
        response = await axios.post(apiUrl1, formData, {
          headers: {
            // Không cần thiết lập Content-Type với FormData, axios sẽ tự động thêm boundary
          },
        });
      } catch (error) {
        console.log("URL 1 thất bại, thử URL 2");
        // URL 2: không có /api ở đầu
        const apiUrl2 =
          "https://koifengshui-001-site1.ltempurl.com/ConsultationPackage/create";
        console.log("Thử gửi request đến URL 2:", apiUrl2);

        // Gửi request với URL thay thế
        response = await axios.post(apiUrl2, formData, {
          headers: {
            // Không cần thiết lập Content-Type với FormData, axios sẽ tự động thêm boundary
          },
        });
      }

      console.log("Create package response:", response);
      return response.data;
    } catch (error) {
      console.error("Error creating consultation package:", error);
      // Log chi tiết lỗi để debug
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

  // Cập nhật gói tư vấn
  updatePackage: async (id, packageData) => {
    try {
      console.log(`Cập nhật gói tư vấn ID ${id} với dữ liệu:`, packageData);

      // Tạo FormData để gửi dữ liệu và file
      const formData = new FormData();

      // Thêm các trường thông tin vào formData - đảm bảo đúng Pascal Case
      formData.append("PackageName", packageData.packageName || "");
      formData.append("MinPrice", packageData.minPrice || 0);
      formData.append("MaxPrice", packageData.maxPrice || 0);
      formData.append("Description", packageData.description || "");
      formData.append("SuitableFor", packageData.suitableFor || "");
      formData.append("RequiredInfo", packageData.requiredInfo || "");
      formData.append("PricingDetails", packageData.pricingDetails || "");

      // Xử lý file ảnh nếu có - thử nhiều tên trường khác nhau
      if (packageData.imageFile && packageData.imageFile instanceof File) {
        console.log(
          "Đính kèm file ảnh mới:",
          packageData.imageFile.name,
          packageData.imageFile.size,
          "bytes"
        );
        // Thử thêm tất cả các tên trường có thể
        formData.append("Image", packageData.imageFile);
        formData.append("ImageFile", packageData.imageFile);
        formData.append("ImageUrl", packageData.imageFile);
      } else if (packageData.imageUrl) {
        // Chỉ lưu ý đường dẫn cũ, không cần gửi trong formData vì backend sẽ giữ nguyên nếu không có file mới
        console.log("Giữ nguyên URL ảnh cũ:", packageData.imageUrl);
      }

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

      // Thử cả hai endpoint với và không có /api
      let response;
      try {
        // URL 1: với /api ở đầu
        const apiUrl1 = `https://koifengshui-001-site1.ltempurl.com/api/ConsultationPackage/update/${id}`;
        console.log("Thử gửi request đến URL 1:", apiUrl1);

        // Gửi request với Content-Type là multipart/form-data
        response = await axios.put(apiUrl1, formData, {
          headers: {
            // Không cần thiết lập Content-Type với FormData, axios sẽ tự động thêm boundary
          },
        });
      } catch (error) {
        console.log("URL 1 thất bại, thử URL 2");
        // URL 2: không có /api ở đầu
        const apiUrl2 = `https://koifengshui-001-site1.ltempurl.com/ConsultationPackage/update/${id}`;
        console.log("Thử gửi request đến URL 2:", apiUrl2);

        // Gửi request với URL thay thế
        response = await axios.put(apiUrl2, formData, {
          headers: {
            // Không cần thiết lập Content-Type với FormData, axios sẽ tự động thêm boundary
          },
        });
      }

      console.log(`Update package response for ID ${id}:`, response);
      return response.data;
    } catch (error) {
      console.error(`Error updating consultation package ID ${id}:`, error);
      // Log chi tiết lỗi để debug
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

  // Xóa gói tư vấn
  deletePackage: async (id) => {
    try {
      console.log("Gọi API xóa gói tư vấn:", `${BASE_URL}/delete/${id}`);
      const response = await axios.delete(`${BASE_URL}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error deleting consultation package with ID ${id}:`,
        error
      );
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
      }
      throw error;
    }
  },

  // Kiểm tra kết nối API
  testApiConnection: async () => {
    try {
      console.log("Kiểm tra kết nối API:", `${BASE_URL}/get-all`);
      const response = await axios.get(`${BASE_URL}/get-all`);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("API connection test failed:", error);
      return { success: false, error };
    }
  },

  // Cập nhật trạng thái gói tư vấn
  updatePackageStatus: async (packageId, status) => {
    try {
      console.log(
        `Cập nhật trạng thái gói tư vấn ID ${packageId} thành ${status}`
      );

      // Sử dụng token nếu có
      const token = localStorage.getItem("accessToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const apiUrl = `${BASE_URL}/update-package-status/${packageId}?status=${status}`;
      console.log("Gửi request đến URL:", apiUrl);

      const response = await axios.put(
        apiUrl,
        {},
        {
          headers,
        }
      );

      console.log("Update status response:", response);
      return response.data;
    } catch (error) {
      console.error(
        `Error updating consultation package status for ID ${packageId}:`,
        error
      );
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
      }
      throw error;
    }
  },
};

export default ConsultationPackageService;
