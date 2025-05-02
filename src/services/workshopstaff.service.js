/**
 * Service để xử lý các API liên quan đến Workshop cho Staff
 */

import apiClient from "./apiClient";

// URL cơ sở của API
const WORKSHOP_ENDPOINT =
  "https://koifengshui-001-site1.ltempurl.com/api/Workshop";

/**
 * Lấy danh sách workshop được sắp xếp theo ngày tạo
 * @returns {Promise<Array>} Danh sách workshop
 */
export const getWorkshopsByCreatedDate = async () => {
  try {
    const response = await apiClient.get(
      `${WORKSHOP_ENDPOINT}/sort-createdDate-for-web`
    );
    console.log("API Response raw:", response);
    console.log("API Response data:", response.data);
    console.log("Workshop data structure:", response.data?.data?.[0]);

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
    console.log("Gọi API lấy chi tiết workshop với ID:", id);
    const response = await apiClient.get(`${WORKSHOP_ENDPOINT}/${id}`);
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
    throw error;
  }
};

/**
 * Chuyển đổi trạng thái từ API sang định dạng hiển thị trong UI
 * @param {string} apiStatus - Trạng thái từ API
 * @returns {string} Trạng thái hiển thị trong UI
 */
export const mapWorkshopStatus = (apiStatus) => {
  const statusMap = {
    Scheduled: "Sắp diễn ra",
    "Open Registration": "Đang diễn ra",
    Completed: "Đã kết thúc",
    Cancelled: "Đã hủy",
    Pending: "Chờ duyệt",
    Approved: "Sắp diễn ra",
    Rejected: "Từ chối",
  };

  // Nếu apiStatus là string, chuyển về đúng format
  if (typeof apiStatus === "string") {
    // Chuyển đổi "open registration" thành "Open Registration"
    apiStatus = apiStatus
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }
  // Nếu apiStatus là số, chuyển đổi sang trạng thái tương ứng
  else if (typeof apiStatus === "number") {
    switch (apiStatus) {
      case 1:
        return "Đã check-in";
      case 2:
        return "Đang kiểm tra";
      case 3:
        return "Từ chối";
      case 0:
        return "Đã hủy";
      default:
        return "Đang kiểm tra";
    }
  }

  return statusMap[apiStatus] || "Không xác định";
};

/**
 * Định dạng dữ liệu workshop từ API để hiển thị trong UI
 * @param {Array} workshopsData - Dữ liệu workshop từ API
 * @returns {Array} Dữ liệu workshop đã được định dạng
 */
export const formatWorkshopsData = (workshopsData) => {
  if (!Array.isArray(workshopsData)) {
    console.error("Dữ liệu không phải là mảng:", workshopsData);
    return [];
  }

  console.log("Định dạng dữ liệu workshop, số lượng:", workshopsData.length);

  return workshopsData
    .map((workshop) => {
      try {
        // Log để debug
        console.log("Workshop raw data:", workshop);

        // Kiểm tra dữ liệu đầu vào
        if (!workshop) {
          console.warn("Workshop không hợp lệ:", workshop);
          return null;
        }

        // Lấy email người dùng từ localStorage
        const userEmail = localStorage.getItem("userEmail");

        // Xác định tên master
        let masterName = workshop.masterName || "Chưa có thông tin";

        // Nếu người dùng đăng nhập là bob@example.com, hiển thị tên là Bob Chen
        if (userEmail === "bob@example.com" && masterName === "Sensei Tanaka") {
          masterName = "Bob Chen";
        }

        // Xử lý thời gian
        let startTime = "Chưa có thông tin";
        let endTime = "Chưa có thông tin";

        // Thử các trường khác nhau có thể chứa thông tin thời gian
        if (workshop.timeStart) startTime = workshop.timeStart;
        else if (workshop.startTime) startTime = workshop.startTime;
        else if (workshop.start_time) startTime = workshop.start_time;
        else if (workshop.time_start) startTime = workshop.time_start;

        if (workshop.timeEnd) endTime = workshop.timeEnd;
        else if (workshop.endTime) endTime = workshop.endTime;
        else if (workshop.end_time) endTime = workshop.end_time;
        else if (workshop.time_end) endTime = workshop.time_end;

        // Format thời gian nếu có
        if (startTime !== "Chưa có thông tin" && startTime.length > 5) {
          startTime = startTime.substring(0, 5);
        }
        if (endTime !== "Chưa có thông tin" && endTime.length > 5) {
          endTime = endTime.substring(0, 5);
        }

        // Tạo đối tượng workshop đã định dạng
        const formattedWorkshop = {
          id: workshop.workshopId || 0,
          workshopId: workshop.workshopId || "", // Giữ nguyên workshopId từ API
          name: workshop.workshopName || "Không có tên",
          master: masterName,
          location: workshop.location || "Không có địa điểm",
          date: workshop.startDate
            ? new Date(workshop.startDate).toLocaleDateString("vi-VN")
            : "Không có ngày",
          startTime: startTime,
          endTime: endTime,
          status: mapWorkshopStatus(workshop.status),
          price: workshop.price,
          capacity: workshop.capacity,
          description: workshop.description,
        };

        console.log("Formatted workshop:", formattedWorkshop);

        return formattedWorkshop;
      } catch (error) {
        console.error("Lỗi khi định dạng workshop:", workshop, error);
        return null;
      }
    })
    .filter((item) => item !== null); // Lọc bỏ các item null
};

export default {
  getWorkshopsByCreatedDate,
  getWorkshopById,
  mapWorkshopStatus,
  formatWorkshopsData,
};
