import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingScheduleDetail } from "../services/booking.service";
import { message } from "antd";

const BookingScheduleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    consultationId: "",
    customerName: "",
    link: "",
    date: "",
    time: "",
    method: "",
    description: "",
    note: "",
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getBookingScheduleDetail(id);
        console.log("Detail response:", response);

        if (response.isSuccess) {
          const booking = response.data;
          setFormData({
            consultationId: booking.consultingId || "",
            customerName: booking.customerName || "",
            link: booking.linkMeet || "",
            date: booking.bookingDate || "",
            time: `${booking.startTime} - ${booking.endTime}`,
            method: booking.type || "",
            description: booking.description || "",
            note: booking.masterNote || "",
          });
        } else {
          message.error("Không thể lấy thông tin chi tiết");
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
        message.error("Đã xảy ra lỗi khi lấy thông tin chi tiết");
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handlePageChange = (page) => {
    console.log("Chuyển đến trang:", page);
  };

  const handleReturn = () => {
    navigate("/schedule");
  };

  return (
    <div>
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl">Quản lý lịch đặt hẹn</h1>
        <p className="text-white/80 mt-1">
          Báo cáo và tổng quan về lịch đặt hẹn
        </p>
      </div>

      <div className="p-8">
        <button
          onClick={handleReturn}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <span>←</span> Quay lại danh sách đặt hẹn
        </button>

        <div className="bg-white rounded p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl">Chi tiết lịch đặt hẹn</h2>
            <div className="relative"></div>
          </div>
          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-3 rounded mb-8">
            <span className="flex items-center gap-3">
              <span className="text-red-600">Đã xảy ra lỗi!</span>
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-24">
              <div className="space-y-6">
                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Mã tư vấn</label>
                  <input
                    type="text"
                    value={formData.consultationId}
                    onChange={handleInputChange("consultationId")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Tên khách hàng</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={handleInputChange("customerName")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Link</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={handleInputChange("link")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Ngày</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={handleInputChange("date")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Thời gian</label>
                  <input
                    type="text"
                    value={formData.time}
                    onChange={handleInputChange("time")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>

                <div className="flex items-center">
                  <label className="w-36 text-gray-700">Phương thức</label>
                  <input
                    type="text"
                    value={formData.method}
                    onChange={handleInputChange("method")}
                    className="border bg-gray-100 flex-1 py-2 px-3"
                  />
                </div>
              </div>
            </div>

            <div className="flex mt-8">
              <label className="w-36 text-gray-700">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={handleInputChange("description")}
                className="border bg-gray-100 flex-1 h-28 py-2 px-3"
              />
            </div>

            <div className="flex mt-8">
              <label className="w-36 text-gray-700">Ghi chú</label>
              <textarea
                value={formData.note}
                onChange={handleInputChange("note")}
                className="border bg-gray-100 flex-1 h-28 py-2 px-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingScheduleDetails;
