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
export const assignMaster = async (bookingId, masterId) => {
  try {
    console.log("Sending request with:", { bookingId, masterId });

    const response = await apiClient.put(
      `${BOOKING_ENDPOINT}/assign-master?BookingId=${bookingId}&MasterId=${masterId}`
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
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching online consulting bookings:", error);
    throw error;
  }
};
