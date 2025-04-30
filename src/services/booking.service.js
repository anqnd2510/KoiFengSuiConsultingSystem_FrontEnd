import apiClient from "./apiClient";

// Constants
//const BOOKING_ENDPOINT = `${import.meta.env.BACK_END_BASE_URL}/BookingOnline`;
const BOOKING_ENDPOINT = "/Booking";

// Get All Booking  APIs
export const getBookingHistory = async () => {
  try {
    const response = await apiClient.get(`${BOOKING_ENDPOINT}/status-type`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking online data:", error);
    throw error;
  }
};

// Get Booking Detail APIs
export const getBookingDetail = async (id) => {
  try {
    const response = await apiClient.get(`${BOOKING_ENDPOINT}/${id}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking detail:", error);
    throw error;
  }
};
// Get Booking Detail APIs
export const getBookingScheduleDetail = async (id) => {
  try {
    const response = await apiClient.get(
      `${BOOKING_ENDPOINT}/consulting-by-masterSchedule-${id}`
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking detail:", error);
    throw error;
  }
};

// Assign Master APIs
export const assignMaster = async (
  bookingOnlineId,
  bookingOfflineId,
  masterId
) => {
  try {
    console.log("Sending request with:", {
      bookingOnlineId,
      bookingOfflineId,
      masterId,
    });

    // Xây dựng query parameters
    const params = new URLSearchParams();

    // Chỉ thêm tham số nếu có giá trị
    if (bookingOnlineId) {
      params.append("bookingonline", bookingOnlineId);
    }

    if (bookingOfflineId) {
      params.append("bookingoffline", bookingOfflineId);
    }

    // MasterId là bắt buộc
    if (!masterId) {
      throw new Error("MasterId không được để trống");
    }

    params.append("masterId", masterId);

    // Kiểm tra xem có ít nhất một loại booking được chỉ định
    if (!bookingOnlineId && !bookingOfflineId) {
      throw new Error(
        "Phải chỉ định ít nhất một loại booking (online hoặc offline)"
      );
    }

    // Sử dụng URLSearchParams để tạo query string đúng cách
    const queryString = params.toString();

    console.log(
      `Sending request to: ${BOOKING_ENDPOINT}/assign-master?${queryString}`
    );

    const response = await apiClient.put(
      `${BOOKING_ENDPOINT}/assign-master?${queryString}`
    );

    return response.data;
  } catch (error) {
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Get All Online Consulting Bookings
export const getOnlineConsultingBookings = async () => {
  try {
    const response = await apiClient.get(
      `${BOOKING_ENDPOINT}/master/booking-onlines`
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching online consulting bookings:", error);
    throw error;
  }
};

// Get All Offline Consulting Bookings
export const getOfflineConsultingBookings = async () => {
  try {
    const response = await apiClient.get(
      `${BOOKING_ENDPOINT}/master/booking-offlines`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching online consulting bookings:", error);
    throw error;
  }
};

// Get All Booking Offline
export const getAllBookingOffline = async () => {
  try {
    const response = await apiClient.get(
      `${BOOKING_ENDPOINT}/get-all-offlines`
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching online bookings offlines:", error);
    throw error;
  }
};
// Get All Booking Offline
export const getAllBookingOnline = async () => {
  try {
    const response = await apiClient.get(`${BOOKING_ENDPOINT}/get-all-onlines`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching online bookings onlines:", error);
    throw error;
  }
};

// Get All Booking By Staff
export const getAllBookingByStaff = async () => {
  try {
    const response = await apiClient.get(
      `${BOOKING_ENDPOINT}/get-all-booking-by-staf`
    );
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching online bookings onlines:", error);
    throw error;
  }
};

// Assign Staff APIs
export const assignStaff = async (
  bookingOnlineId,
  bookingOfflineId,
  staffId
) => {
  try {
    console.log("Sending request with:", {
      bookingOnlineId,
      bookingOfflineId,
      staffId,
    });

    // Xây dựng query parameters
    const params = new URLSearchParams();

    // Chỉ thêm tham số nếu có giá trị
    if (bookingOnlineId) {
      params.append("bookingonline", bookingOnlineId);
    }

    if (bookingOfflineId) {
      params.append("bookingoffline", bookingOfflineId);
    }

    // MasterId là bắt buộc
    if (!staffId) {
      throw new Error("StaffId không được để trống");
    }

    params.append("staffId", staffId);

    // Kiểm tra xem có ít nhất một loại booking được chỉ định
    if (!bookingOnlineId && !bookingOfflineId) {
      throw new Error(
        "Phải chỉ định ít nhất một loại booking (online hoặc offline)"
      );
    }

    // Sử dụng URLSearchParams để tạo query string đúng cách
    const queryString = params.toString();

    console.log(
      `Sending request to: ${BOOKING_ENDPOINT}/assign-staff?${queryString}`
    );

    const response = await apiClient.put(
      `${BOOKING_ENDPOINT}/assign-staff?${queryString}`
    );

    return response.data;
  } catch (error) {
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Get Booking Online Detail APIs
export const getBookingOnlineDetail = async (id) => {
  try {
    const response = await apiClient.get(`${BOOKING_ENDPOINT}/online/${id}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking detail:", error);
    throw error;
  }
};

// Get Booking Offline Detail APIs
export const getBookingOfflineDetail = async (id) => {
  try {
    const response = await apiClient.get(`${BOOKING_ENDPOINT}/offline/${id}`);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking detail:", error);
    throw error;
  }
};

// Hoàn thành buổi tư vấn
export const completeConsulting = async (bookingId) => {
  try {
    const response = await apiClient.put(
      `${BOOKING_ENDPOINT}/booking-online/${bookingId}/complete`
    );
    return response.data;
  } catch (error) {
    console.error("Error completing consulting:", error);
    throw error;
  }
};

// Cập nhật ghi chú sau tư vấn
export const updateConsultingNote = async (bookingId, note) => {
  try {
    const response = await apiClient.put(
      `${BOOKING_ENDPOINT}/booking-online/${bookingId}/master-note`,
      {
        masterNote: note,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating consulting note:", error);
    throw error;
  }
};
