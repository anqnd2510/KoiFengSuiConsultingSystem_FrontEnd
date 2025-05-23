import apiClient from "./apiClient";

const API_URL = "/MasterSchedule";

/**
 * Hàm lấy lịch của master hiện tại
 * @returns {Promise} - Promise chứa dữ liệu lịch của master
 */
export const getCurrentMasterSchedule = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("No access token found");
    }

    const response = await apiClient.get(
      `${API_URL}/get-schedule-by-current-master`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Master schedule response:", response.data);
    return response.data;
  } catch (error) {
    //console.error("Error fetching master schedule:", error);
    throw error;
  }
};
