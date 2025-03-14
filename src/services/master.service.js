import apiClient from "./apiClient";

const MASTER_ENDPOINT = "http://localhost:5261/api/Master";

export const getMasterList = async () => {
  try {
    const response = await apiClient.get(`${MASTER_ENDPOINT}/get-all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching master list:", error);
    throw error;
  }
};
