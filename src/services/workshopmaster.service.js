/**
 * Service để xử lý các API liên quan đến Workshop cho Master
 */

import apiClient from "./apiClient";

// URL cơ sở của API
const WORKSHOP_ENDPOINT = "http://localhost:5261/api/Workshop";

/**
 * Lấy danh sách tất cả workshop
 * @returns {Promise<Array>} Danh sách workshop
 */
export const getAllWorkshops = async () => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    const response = await apiClient.get(
      `${WORKSHOP_ENDPOINT}/sort-createdDate`
    );
    console.log("API Response:", response.data);

    // Kiểm tra cấu trúc response
    if (
      response.data &&
      response.data.isSuccess &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data; // Trả về mảng data từ response
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách workshop:", error);

    // Xử lý lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    throw error;
  }
};

/**
 * Lấy chi tiết workshop theo ID
 * @param {string} id - ID của workshop
 * @returns {Promise<Object>} Chi tiết workshop
 */
export const getWorkshopById = async (id) => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Thử cách khác: truyền ID trực tiếp trong URL path thay vì query parameter
    const response = await apiClient.get(`${WORKSHOP_ENDPOINT}/id/${id}`);
    console.log("API Response:", response.data);

    // Kiểm tra cấu trúc response
    if (response.data && response.data.isSuccess && response.data.data) {
      return response.data.data; // Trả về dữ liệu workshop từ response
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return null;
    }
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết workshop ID ${id}:`, error);

    // Xử lý lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    throw error;
  }
};

/**
 * Tạo workshop mới
 * @param {Object} workshopData - Dữ liệu workshop cần tạo
 * @returns {Promise<Object>} Workshop đã tạo
 */
export const createWorkshop = async (workshopData) => {
  try {
    console.log("Dữ liệu trước khi gửi API:", workshopData);

    // Kiểm tra token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Lấy tên người dùng từ localStorage
    let userName = localStorage.getItem("userName");
    console.log("Tên người dùng từ localStorage:", userName);

    // Kiểm tra email từ localStorage nếu có
    const userEmail = localStorage.getItem("userEmail");
    console.log("Email người dùng từ localStorage:", userEmail);

    // Hardcode tên cho bob@example.com
    if (userEmail === "bob@example.com" || !userName) {
      userName = "Bob Chen";
      console.log("Sử dụng tên hardcode:", userName);
    }

    // Đảm bảo giá trị số là số, không phải chuỗi
    const price =
      typeof workshopData.ticketPrice === "string"
        ? parseFloat(workshopData.ticketPrice.replace(/[^\d]/g, ""))
        : workshopData.ticketPrice;

    const capacity =
      typeof workshopData.ticketSlots === "string"
        ? parseInt(workshopData.ticketSlots, 10)
        : workshopData.ticketSlots;

    // Tạo FormData để gửi dữ liệu có file
    const formData = new FormData();
    formData.append("WorkshopName", workshopData.name);
    formData.append("StartDate", workshopData.date);
    formData.append("Location", workshopData.location);
    formData.append("Description", workshopData.description || "");
    formData.append("Capacity", capacity);
    formData.append("Status", "Pending");
    formData.append("Price", price);
    formData.append("MasterName", userName || "Unknown Master");
    formData.append("MasterAccount", userEmail || "unknown@example.com");

    // Xử lý file hình ảnh nếu có
    if (workshopData.imageFile && workshopData.imageFile instanceof File) {
      console.log("Đính kèm file hình ảnh:", workshopData.imageFile.name);
      formData.append("ImageUrl", workshopData.imageFile);
    }

    // Log dữ liệu FormData để debug
    for (let pair of formData.entries()) {
      console.log(
        pair[0] +
          ": " +
          (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1])
      );
    }

    // Gửi request với FormData thay vì JSON
    const response = await fetch(`${WORKSHOP_ENDPOINT}/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      throw new Error(`API Error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("API Response:", result);

    if (result && result.isSuccess && result.data) {
      return result.data;
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", result);
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi tạo workshop mới:", error);
    console.error("Chi tiết lỗi:", error.response?.data || error.message);

    // Xử lý lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    throw error;
  }
};

/**
 * Cập nhật workshop
 * @param {string} id - ID của workshop
 * @param {Object} workshopData - Dữ liệu workshop cần cập nhật
 * @returns {Promise<Object>} Workshop đã cập nhật
 */
export const updateWorkshop = async (id, workshopData) => {
  try {
    console.log(`Cập nhật workshop ID ${id} với dữ liệu:`, workshopData);

    // Kiểm tra token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Tạo FormData để gửi dữ liệu và file
    const formData = new FormData();

    // Đảm bảo giá trị số là số, không phải chuỗi
    const price =
      typeof workshopData.ticketPrice === "string"
        ? parseFloat(workshopData.ticketPrice.replace(/[^\d]/g, ""))
        : workshopData.ticketPrice;

    const capacity =
      typeof workshopData.ticketSlots === "string"
        ? parseInt(workshopData.ticketSlots, 10)
        : workshopData.ticketSlots;

    // Thêm các trường thông tin vào formData
    formData.append("WorkshopId", id);
    formData.append("WorkshopName", workshopData.name || "");
    formData.append("StartDate", workshopData.date || "");
    formData.append("Location", workshopData.location || "");
    formData.append("Description", workshopData.description || "");
    formData.append("Capacity", capacity || 0);
    formData.append("Price", price || 0);

    // Thêm các thông tin MasterName và MasterAccount nếu có
    if (workshopData.masterName) {
      formData.append("MasterName", workshopData.masterName);
    }

    if (workshopData.masterAccount) {
      formData.append("MasterAccount", workshopData.masterAccount);
    }

    // Giữ nguyên trạng thái nếu có
    if (workshopData.status) {
      formData.append("Status", workshopData.status);
    }

    // Xử lý file ảnh nếu có
    if (workshopData.imageFile && workshopData.imageFile instanceof File) {
      console.log("Đính kèm file hình ảnh:", workshopData.imageFile.name);
      formData.append("ImageUrl", workshopData.imageFile);
    }

    // Log FormData để debug
    for (let pair of formData.entries()) {
      console.log(
        pair[0] +
          ": " +
          (pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1])
      );
    }

    // Gửi request với FormData thay vì JSON
    const response = await fetch(`${WORKSHOP_ENDPOINT}/update/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", response.status, errorText);
      throw new Error(`API Error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("API Response:", result);

    if (result && result.isSuccess && result.data) {
      return result.data;
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", result);
      return null;
    }
  } catch (error) {
    console.error(`Lỗi khi cập nhật workshop ID ${id}:`, error);

    // Xử lý lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    throw error;
  }
};

/**
 * Xóa workshop
 * @param {string} id - ID của workshop cần xóa
 * @returns {Promise<boolean>} Kết quả xóa
 */
export const deleteWorkshop = async (id) => {
  try {
    const response = await apiClient.delete(`${WORKSHOP_ENDPOINT}/${id}`);
    console.log("API Response:", response.data);

    return response.data && response.data.isSuccess;
  } catch (error) {
    console.error(`Lỗi khi xóa workshop ID ${id}:`, error);
    throw error;
  }
};

/**
 * Ánh xạ trạng thái từ API sang trạng thái hiển thị
 * @param {string} apiStatus - Trạng thái từ API
 * @returns {string} Trạng thái hiển thị
 */
export const mapWorkshopStatus = (apiStatus) => {
  const statusMap = {
    Scheduled: "Sắp diễn ra",
    "Open Registration": "Đang diễn ra",
    Completed: "Đã kết thúc",
    Cancelled: "Đã hủy",
    Pending: "Chờ duyệt", // Trạng thái chờ duyệt từ API
    Approved: "Sắp diễn ra", // Trạng thái sau khi phê duyệt
    Rejected: "Từ chối", // Trạng thái từ chối
  };

  console.log(
    "Mapping status:",
    apiStatus,
    "->",
    statusMap[apiStatus] || "Không xác định"
  );
  return statusMap[apiStatus] || "Không xác định";
};

/**
 * Format dữ liệu workshop từ API để hiển thị
 * @param {Array} workshopsData - Dữ liệu workshop từ API
 * @returns {Array} Dữ liệu đã được format
 */
export const formatWorkshopsData = (workshopsData) => {
  if (!Array.isArray(workshopsData)) return [];

  return workshopsData.map((workshop) => {
    // Xử lý URL hình ảnh
    let imageUrl = "https://via.placeholder.com/400x300?text=Workshop+Image";

    // In ra dữ liệu hình ảnh từ API để debug
    console.log(`Workshop ${workshop.workshopId} raw image data:`, {
      imageUrl: workshop.imageUrl,
      image: workshop.image
    });

    // Ưu tiên kiểm tra trường imageUrl từ API
    if (workshop.imageUrl) {
      // Nếu là URL Cloudinary hoặc URL đầy đủ khác, sử dụng nguyên URL
      if (workshop.imageUrl.startsWith("http")) {
        imageUrl = workshop.imageUrl;
        console.log(`Workshop ${workshop.workshopId}: Sử dụng imageUrl đầy đủ:`, imageUrl);
      } else {
        // Nếu là đường dẫn tương đối, thêm base URL
        imageUrl = `http://localhost:5261/${workshop.imageUrl.replace(/^\//, "")}`;
        console.log(`Workshop ${workshop.workshopId}: Chuyển đổi imageUrl tương đối:`, imageUrl);
      }
    }
    // Sau đó mới kiểm tra trường image
    else if (workshop.image) {
      if (workshop.image.startsWith("http")) {
        imageUrl = workshop.image;
        console.log(`Workshop ${workshop.workshopId}: Sử dụng image đầy đủ:`, imageUrl);
      } else {
        // Nếu là đường dẫn tương đối, thêm base URL
        imageUrl = `http://localhost:5261/${workshop.image.replace(/^\//, "")}`;
        console.log(`Workshop ${workshop.workshopId}: Chuyển đổi image tương đối:`, imageUrl);
      }
    }
    
    console.log(`Workshop ${workshop.workshopId}: Final Image URL = ${imageUrl}`);

    return {
      id: workshop.workshopId,
      workshopId: workshop.workshopId, // Thêm trường workshopId để đảm bảo tương thích
      name: workshop.workshopName,
      location: workshop.location,
      date: new Date(workshop.startDate).toLocaleDateString("vi-VN"),
      startDate: workshop.startDate, // Giữ nguyên startDate
      endDate: workshop.endDate, // Giữ nguyên endDate nếu có
      image: imageUrl,
      imageUrl: imageUrl, // Đảm bảo cả hai trường đều có giá trị
      price: workshop.price, // Giữ nguyên giá trị số
      capacity: workshop.capacity, // Giữ nguyên giá trị số
      ticketPrice: `${workshop.price.toLocaleString("vi-VN")} VND`,
      ticketSlots: workshop.capacity,
      status: mapWorkshopStatus(workshop.status),
      description: workshop.description || "",
      content: workshop.content || "", // Thêm trường content nếu có
      masterName: workshop.masterName || ""
    };
  });
};

/**
 * Lấy danh sách workshop chờ phê duyệt
 * @returns {Promise<Array>} Danh sách workshop chờ phê duyệt
 */
export const getPendingWorkshops = async () => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Sử dụng API getAllWorkshops thay vì pending-workshops
    const response = await apiClient.get(`${WORKSHOP_ENDPOINT}`);
    console.log("API Response:", response.data);

    // Kiểm tra cấu trúc response
    if (
      response.data &&
      response.data.isSuccess &&
      Array.isArray(response.data.data)
    ) {
      // Lọc các workshop có trạng thái "Pending"
      const pendingWorkshops = response.data.data.filter(
        (workshop) => workshop.status === "Pending"
      );
      console.log("Workshop chờ duyệt:", pendingWorkshops);
      return pendingWorkshops; // Trả về mảng workshop đã lọc
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách workshop chờ phê duyệt:", error);

    // Xử lý lỗi 401
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    throw error;
  }
};
