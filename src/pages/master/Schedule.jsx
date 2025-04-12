import Calendar from "../../components/Schedule/Calendar";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import { useState, useEffect } from "react";
import { getCurrentMasterSchedule } from "../../services/masterSchedule.service";
import { message, Spin } from "antd";
import { useNavigate } from "react-router-dom";

const Schedule = () => {
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMasterSchedule();
  }, []);

  const fetchMasterSchedule = async () => {
    try {
      const response = await getCurrentMasterSchedule();
      console.log("Schedule response:", response);

      if (response.isSuccess) {
        const formattedBookings = response.data.flatMap((dateSchedule) => {
          return dateSchedule.schedules.map((schedule) => {
            const formatTime = (timeStr) => {
              if (!timeStr) return "";
              const time = timeStr.split(":");
              return `${time[0]}:${time[1]}`;
            };

            const startTime = formatTime(schedule.startTime);
            const endTime = formatTime(schedule.endTime);

            const customerName =
              schedule.bookingOnlines?.length > 0
                ? schedule.bookingOnlines[0].customer.fullName
                : "Chưa có khách hàng";

            return {
              id: schedule.masterScheduleId,
              date: new Date(dateSchedule.date).getDate(),
              isCurrentMonth:
                new Date(dateSchedule.date).getMonth() ===
                new Date().getMonth(),
              customerName: customerName,
              time: `${startTime}-${endTime}`,
              onClick: () => {
                console.log("Schedule clicked:", schedule);
                const masterScheduleId = schedule.masterScheduleId;
                console.log("Master Schedule ID:", masterScheduleId);
                if (masterScheduleId) {
                  navigate(`/booking-schedule-details/${masterScheduleId}`);
                } else {
                  message.info("Không tìm thấy thông tin lịch");
                }
              },
              originalData: schedule,
            };
          });
        });

        console.log("Formatted bookings:", formattedBookings);
        setBookings(formattedBookings);
      } else {
        setError(response.message || "Không thể lấy dữ liệu lịch");
        message.error("Không thể lấy dữ liệu lịch");
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setError(error.message || "Đã xảy ra lỗi khi lấy dữ liệu lịch");
      message.error("Đã xảy ra lỗi khi lấy dữ liệu lịch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <Header title="Lịch hẹn" description="Lịch đặt hẹn cho chuyên gia" />

        <main className="p-6">
          {error && <Error message={error} />}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" tip="Đang tải lịch..." />
            </div>
          ) : (
            <Calendar bookings={bookings} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Schedule;
