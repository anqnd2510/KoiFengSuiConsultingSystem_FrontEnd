import apiClient from "./apiClient";

const PAYMENT_ENDPOINT = "/Payment";


export const generateRefundCode = async (orderId, customerId) => {
  try {
    const requestData = {};
    requestData.OrderId = orderId;
    requestData.CustomerId = customerId;
    
    const response = await apiClient.post(`${PAYMENT_ENDPOINT}/refund`, requestData, {
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [(data) => {
        return JSON.stringify(data);
      }]
    });
    return response;
  } catch (error) {
    throw error;
  }
};
