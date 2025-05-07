import Calendar from "../../components/Schedule/Calendar";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import { useState, useEffect } from "react";
import { getCurrentMasterSchedule } from "../../services/masterSchedule.service";
import { message, Spin, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Calendar as CalendarIcon, Clock } from "lucide-react";

const Schedule = () => {
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchMasterSchedule();
  }, []);

  const fetchMasterSchedule = async () => {
    try {
      const response = await getCurrentMasterSchedule();
      //console.log("Schedule response:", response);

      if (response.isSuccess) {
        // Dùng Map để gom nhóm lịch trình theo ngày
        const schedulesByDay = new Map();

        response.data.forEach((dateSchedule) => {
          const dateKey = new Date(dateSchedule.date)
            .toISOString()
            .split("T")[0];

          dateSchedule.schedules.forEach((schedule) => {
            const formatTime = (timeStr) => {
              if (!timeStr) return "";
              const time = timeStr.split(":");
              return `${time[0]}:${time[1]}`;
            };

            const startTime = formatTime(schedule.startTime);
            const endTime = formatTime(schedule.endTime);

            // Xác định loại sự kiện và thông tin tương ứng
            let eventTitle = "";
            let eventType = "";
            let tooltipContent = null;
            let eventColor = "";
            let displayTime = "";

            // Kiểm tra nếu có booking online
            if (schedule.bookingOnlines && schedule.bookingOnlines.length > 0) {
              const booking = schedule.bookingOnlines[0];
              eventTitle = booking.customer.fullName || "Khách hàng online";
              eventType = "Tư vấn trực tuyến";
              eventColor = "bg-green-500";
              displayTime = `${startTime}-${endTime}`;
              tooltipContent = (
                <div className="py-2 px-1">
                  <div className="text-sm font-medium mb-2 border-b pb-1">
                    {eventType}
                  </div>
                  <div className="flex items-start mb-1.5">
                    <User size={14} className="text-gray-400 mr-1.5 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">
                        {booking.customer.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.customer.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.customer.phoneNumber}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mb-1 text-xs text-gray-600">
                    <Clock size={12} className="mr-1.5" />
                    <span>
                      {startTime} - {endTime}
                    </span>
                  </div>
                </div>
              );
            }
            // Kiểm tra nếu có booking offline
            else if (
              schedule.bookingOfflines &&
              schedule.bookingOfflines.length > 0
            ) {
              const booking = schedule.bookingOfflines[0];
              eventTitle = booking.customer?.fullName || "Khách hàng offline";
              eventType = "Tư vấn trực tiếp";
              eventColor = "bg-orange-500";
              displayTime = booking.location || "Không có địa điểm";
              tooltipContent = (
                <div className="py-2 px-1">
                  <div className="text-sm font-medium mb-2 border-b pb-1">
                    {eventType}
                  </div>
                  <div className="flex items-start mb-1.5">
                    <User size={14} className="text-gray-400 mr-1.5 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">
                        {booking.customer?.fullName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.customer?.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.customer?.phoneNumber}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mb-1 text-xs text-gray-600">
                    <MapPin size={12} className="mr-1.5" />
                    <span>{booking.location || "Không có địa điểm"}</span>
                  </div>
                </div>
              );
            }
            // Kiểm tra nếu có workshop
            else if (schedule.workshops && schedule.workshops.length > 0) {
              const workshop = schedule.workshops[0];
              eventTitle = workshop.workshopName || "Workshop";
              eventType = "Workshop";
              eventColor = "bg-blue-500";
              displayTime = `${startTime}-${endTime}`;
              tooltipContent = (
                <div className="py-2 px-1">
                  <div className="text-sm font-medium mb-2 border-b pb-1">
                    {eventType}
                  </div>
                  <div className="flex items-start mb-1.5">
                    <CalendarIcon
                      size={14}
                      className="text-gray-400 mr-1.5 mt-0.5"
                    />
                    <div className="font-medium text-sm">
                      {workshop.workshopName}
                    </div>
                  </div>
                  <div className="flex items-start mb-1.5">
                    <MapPin size={14} className="text-gray-400 mr-1.5 mt-0.5" />
                    <div className="text-xs text-gray-500">
                      {workshop.locationName}
                    </div>
                  </div>
                  <div className="flex items-center mb-1 text-xs text-gray-600">
                    <Clock size={12} className="mr-1.5" />
                    <span>
                      {startTime} - {endTime}
                    </span>
                  </div>
                </div>
              );
            }
            // Không có lịch hẹn nào
            else {
              eventTitle = "Lịch trống";
              eventType = "Chưa có lịch hẹn";
              eventColor = "bg-gray-400";
              displayTime = `${startTime}-${endTime}`;
            }

            const bookingData = {
              id: schedule.masterScheduleId,
              date: new Date(dateSchedule.date).getDate(),
              month: new Date(dateSchedule.date).getMonth(),
              year: new Date(dateSchedule.date).getFullYear(),
              fullDate: new Date(dateSchedule.date),
              isCurrentMonth: false,
              customerName: eventTitle,
              time: displayTime,
              tooltipContent: tooltipContent,
              eventType: eventType,
              eventColor: eventColor,
              originalData: schedule,
            };

            // Thêm vào map theo ngày
            if (!schedulesByDay.has(dateKey)) {
              schedulesByDay.set(dateKey, []);
            }
            schedulesByDay.get(dateKey).push(bookingData);
          });
        });

        // Chuyển từ Map sang mảng
        const formattedBookings = [];
        schedulesByDay.forEach((dateBookings) => {
          formattedBookings.push(...dateBookings);
        });

        setBookings(formattedBookings);
      } else {
        if (response.status === 404) {
          // Không có lịch, nhưng không phải lỗi
          //message.info("Hiện tại bạn chưa có lịch hẹn nào.");
          setBookings([]); // Trống cũng được, miễn không là lỗi
        } else {
          setError(response.message || "Không thể lấy dữ liệu lịch");
          message.error("Không thể lấy dữ liệu lịch");
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        message.info("Chưa có dữ liệu lịch hẹn nào.");
        setBookings([]);
      } else {
        console.error("Error fetching schedule:", error);
        setError(error.message || "Đã xảy ra lỗi khi lấy dữ liệu lịch");
        message.error("Đã xảy ra lỗi khi lấy dữ liệu lịch");
      }
    } finally {
      setLoading(false);
    }
  };

  // Render component lịch với tooltip khi hover
  const renderBookingWithTooltip = (booking) => {
    // Định dạng để hiển thị nhỏ gọn
    const compactDisplay = (
      <div
        className={`rounded text-white text-xs ${
          booking.eventColor || "bg-blue-500"
        } hover:opacity-90 transition-opacity mb-1 p-1`}
      >
        <div className="font-medium truncate">{booking.customerName}</div>
        <div className="text-xs truncate flex items-center">
          {booking.eventType === "Tư vấn trực tiếp" ? (
            <MapPin className="inline-block w-3 h-3 mr-1" />
          ) : booking.eventType === "Workshop" ? (
            <CalendarIcon className="inline-block w-3 h-3 mr-1" />
          ) : (
            <Clock className="inline-block w-3 h-3 mr-1" />
          )}
          {booking.time}
        </div>
      </div>
    );

    // Nếu có tooltipContent, bọc trong Tooltip
    if (booking.tooltipContent) {
      return (
        <Tooltip
          title={booking.tooltipContent}
          placement="top"
          color="#fff"
          overlayClassName="calendar-tooltip"
          overlayInnerStyle={{ color: "#333" }}
        >
          {compactDisplay}
        </Tooltip>
      );
    }

    // Hiển thị lịch trống một cách trực quan hơn
    if (booking.eventType === "Chưa có lịch hẹn") {
      return (
        <div className="rounded text-white text-xs bg-gray-400 hover:bg-gray-500 transition-colors mb-1 p-1">
          <div className="font-medium truncate">{booking.customerName}</div>
          <div className="text-xs truncate flex items-center">
            <Clock className="inline-block w-3 h-3 mr-1" />
            {booking.time}
          </div>
        </div>
      );
    }

    return compactDisplay;
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
            <div className="max-w-screen-xl mx-auto">
              <Calendar
                bookings={bookings}
                renderBooking={renderBookingWithTooltip}
                onMonthChange={setCurrentMonth}
                currentMonth={currentMonth}
              />
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        .calendar-tooltip .ant-tooltip-inner {
          max-width: 300px;
        }
        .calendar-tooltip .ant-tooltip-arrow-content {
          --antd-arrow-background-color: #fff;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .booking-item {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .booking-item:hover {
          transform: scale(1.02);
          transition: transform 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Schedule;
