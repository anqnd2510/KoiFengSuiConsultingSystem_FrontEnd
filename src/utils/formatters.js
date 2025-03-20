/**
 * Định dạng ngày tháng theo định dạng DD/MM/YYYY
 * @param {string} dateString - Chuỗi ngày tháng cần định dạng
 * @returns {string} Ngày tháng đã định dạng
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Ngày không hợp lệ';
  }
};

/**
 * Định dạng giá tiền theo đơn vị VND
 * @param {number} price - Số tiền cần định dạng
 * @returns {string} Giá tiền đã định dạng
 */
export const formatPrice = (price) => {
  if (price === undefined || price === null) return 'N/A';
  
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  } catch (error) {
    return 'Giá không hợp lệ';
  }
}; 