import apiClient from "./apiClient";

// Constants
//const BOOKING_ENDPOINT = `${import.meta.env.BACK_END_BASE_URL}/BookingOnline`;
const BOOKING_ENDPOINT = "http://localhost:5261/api/Booking";

// Get All Booking  APIs
export const getBookingOnlineHistory = async () => {
  try {
    const response = await apiClient.get(`${BOOKING_ENDPOINT}/get-booking`);
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
