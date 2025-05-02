/**
 * Service để xử lý các API liên quan đến phê duyệt Workshop
 */

import apiClient from "./apiClient";
import { mapWorkshopStatus } from "./workshopmaster.service";
import axios from "axios";

// URL cơ sở của API
const WORKSHOP_ENDPOINT = "/Workshop";
const FULL_API_URL = "https://koifengshui-001-site1.ltempurl.com/api";

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
    console.log("Gọi API:", `${WORKSHOP_ENDPOINT}`);

    const response = await apiClient.get(
      `${WORKSHOP_ENDPOINT}/sort-createdDate-for-web`
    );
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

/**
 * Phê duyệt workshop
 * @param {string} id - ID của workshop cần phê duyệt
 * @returns {Promise<Object>} Kết quả phê duyệt
 */
export const approveWorkshop = async (id) => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    console.log("Gọi API phê duyệt workshop với ID:", id);

    // Sử dụng phương thức PUT và truyền id trong URL theo đúng API backend
    const response = await apiClient.put(
      `${WORKSHOP_ENDPOINT}/approve-workshop?id=${id}`
    );

    console.log("API Response phê duyệt:", response.data);

    if (response.data && response.data.isSuccess) {
      return response.data.data;
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return null;
    }
  } catch (error) {
    console.error(`Lỗi khi phê duyệt workshop ID ${id}:`, error);
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
 * Từ chối workshop
 * @param {string} id - ID của workshop cần từ chối
 * @param {string} reason - Lý do từ chối
 * @returns {Promise<Object>} Kết quả từ chối
 */
export const rejectWorkshop = async (id, reason) => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    const response = await apiClient.post(
      `${WORKSHOP_ENDPOINT}/reject-workshop`,
      {
        workshopId: id,
        reason: reason || "Không đáp ứng yêu cầu",
      }
    );
    console.log("API Response:", response.data);

    if (response.data && response.data.isSuccess) {
      return response.data.data;
    } else {
      console.warn("Cấu trúc dữ liệu không như mong đợi:", response.data);
      return null;
    }
  } catch (error) {
    console.error(`Lỗi khi từ chối workshop ID ${id}:`, error);
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
 * Format dữ liệu workshop chờ duyệt từ API để hiển thị
 * @param {Array} workshopsData - Dữ liệu workshop từ API
 * @returns {Array} Dữ liệu đã được format
 */
export const formatPendingWorkshopsData = (workshopsData) => {
  if (!Array.isArray(workshopsData)) {
    console.error("Dữ liệu không phải là mảng:", workshopsData);
    return [];
  }

  console.log(
    "Định dạng dữ liệu workshop chờ duyệt, số lượng:",
    workshopsData.length
  );

  return workshopsData
    .map((workshop) => {
      try {
        // Kiểm tra dữ liệu đầu vào
        if (!workshop) {
          console.warn("Workshop không hợp lệ:", workshop);
          return null;
        }

        // Xử lý URL hình ảnh
        let imageUrl =
          "https://via.placeholder.com/400x300?text=Workshop+Image";
        if (workshop.imageUrl) {
          if (workshop.imageUrl.startsWith("http")) {
            imageUrl = workshop.imageUrl;
          } else {
            imageUrl = `https://koifengshui-001-site1.ltempurl.com/${workshop.imageUrl.replace(
              /^\//,
              ""
            )}`;
          }
        } else if (workshop.image) {
          if (workshop.image.startsWith("http")) {
            imageUrl = workshop.image;
          } else {
            imageUrl = `https://koifengshui-001-site1.ltempurl.com/${workshop.image.replace(
              /^\//,
              ""
            )}`;
          }
        }

        return {
          id: workshop.workshopId,
          workshopId: workshop.workshopId,
          name: workshop.workshopName,
          location: workshop.location,
          date: new Date(workshop.startDate).toLocaleDateString("vi-VN"),
          startDate: workshop.startDate,
          endDate: workshop.endDate,
          startTime: workshop.startTime
            ? workshop.startTime.substring(0, 5)
            : "Chưa có thông tin",
          endTime: workshop.endTime
            ? workshop.endTime.substring(0, 5)
            : "Chưa có thông tin",
          image: imageUrl,
          imageUrl: imageUrl,
          price: workshop.price
            ? parseFloat(workshop.price.toString().replace(/[^\d]/g, ""))
            : 0,
          capacity: workshop.capacity,
          ticketPrice: workshop.price
            ? parseFloat(workshop.price.toString().replace(/[^\d]/g, ""))
            : 0,
          ticketSlots: workshop.capacity,
          status: "Chờ duyệt",
          description: workshop.description || "",
          content: workshop.content || "",
          masterName: workshop.masterName || "",
        };
      } catch (error) {
        console.error("Lỗi khi định dạng workshop:", workshop, error);
        return null;
      }
    })
    .filter((item) => item !== null);
};

/**
 * Lấy danh sách workshop chờ phê duyệt
 * @returns {Promise<Array>} Danh sách workshop chờ phê duyệt
 */
export const getPendingWorkshopsByMaster = async () => {
  try {
    // Kiểm tra token
    const token = localStorage.getItem("accessToken");
    if (!token) {
      throw new Error("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn");
    }

    // Sử dụng API getAllWorkshops thay vì pending-workshops
    console.log("Gọi API:", `${WORKSHOP_ENDPOINT}`);

    const response = await apiClient.get(
      `${WORKSHOP_ENDPOINT}/sort-createdDate-for-master`
    );
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
