import axios from "axios";

// URL cơ sở cho API gói tư vấn
const BASE_URL = "http://localhost:5261/api/ConsultationPackage";

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
          packageData.imageUrl = `http://localhost:5261${packageData.imageUrl}`;
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

      // Thêm các trường thông tin vào formData
      formData.append("PackageName", packageData.packageName || "");
      formData.append("MinPrice", packageData.minPrice || 0);
      formData.append("MaxPrice", packageData.maxPrice || 0);
      formData.append("Description", packageData.description || "");
      formData.append("SuitableFor", packageData.suitableFor || "");
      formData.append("RequiredInfo", packageData.requiredInfo || "");
      formData.append("PricingDetails", packageData.pricingDetails || "");

      // Xử lý file ảnh nếu có
      if (packageData.imageFile && packageData.imageFile instanceof File) {
        console.log(
          "Đính kèm file ảnh:",
          packageData.imageFile.name,
          packageData.imageFile.size,
          "bytes"
        );
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

      // Sử dụng URL hoàn chỉnh với API endpoint đúng
      const apiUrl = "http://localhost:5261/api/ConsultationPackage/create";
      console.log("Gửi request đến URL:", apiUrl);

      // Gửi request với Content-Type là multipart/form-data
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

      // Thêm các trường thông tin vào formData
      formData.append("PackageName", packageData.packageName || "");
      formData.append("MinPrice", packageData.minPrice || 0);
      formData.append("MaxPrice", packageData.maxPrice || 0);
      formData.append("Description", packageData.description || "");
      formData.append("SuitableFor", packageData.suitableFor || "");
      formData.append("RequiredInfo", packageData.requiredInfo || "");
      formData.append("PricingDetails", packageData.pricingDetails || "");

      // Xử lý file ảnh nếu có
      if (packageData.imageFile && packageData.imageFile instanceof File) {
        console.log(
          "Đính kèm file ảnh:",
          packageData.imageFile.name,
          packageData.imageFile.size,
          "bytes"
        );
        formData.append("ImageUrl", packageData.imageFile);
      } else if (packageData.imageUrl) {
        // Nếu không có file mới nhưng có URL cũ, giữ nguyên URL cũ
        console.log("Giữ nguyên URL ảnh cũ:", packageData.imageUrl);

        // Kiểm tra nếu imageUrl là đường dẫn đầy đủ thì chuyển về tương đối
        if (packageData.imageUrl.startsWith("http://localhost:5261")) {
          const relativePath = packageData.imageUrl.replace(
            "http://localhost:5261",
            ""
          );
          formData.append("ImagePath", relativePath);
        } else {
          formData.append("ImagePath", packageData.imageUrl);
        }
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

      // Sử dụng URL hoàn chỉnh với API endpoint đúng
      const apiUrl = `${BASE_URL}/update/${id}`;
      console.log("Gửi request đến URL:", apiUrl);

      // Gửi request với Content-Type là multipart/form-data
      const response = await axios.put(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
      console.log(`Cập nhật trạng thái gói tư vấn ID ${packageId} thành ${status}`);
      
      // Sử dụng token nếu có
      const token = localStorage.getItem('accessToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const apiUrl = `${BASE_URL}/update-package-status/${packageId}?status=${status}`;
      console.log("Gửi request đến URL:", apiUrl);
      
      const response = await axios.put(apiUrl, {}, {
        headers
      });
      
      console.log("Update status response:", response);
      return response.data;
    } catch (error) {
      console.error(`Error updating consultation package status for ID ${packageId}:`, error);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
      }
      throw error;
    }
  }
};

export default ConsultationPackageService;
