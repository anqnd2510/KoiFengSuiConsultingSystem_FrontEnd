import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight, MapPin, Clock } from "lucide-react";
import { DAYS_OF_WEEK, formatMonth } from "../../utils/dateUtils";
import { useCalendar } from "../../hooks/useCalendar";
import { useNavigate } from "react-router-dom";
import { CalendarIcon } from "lucide-react";

const Calendar = ({
  bookings,
  renderBooking,
  onMonthChange,
  currentMonth: propCurrentMonth,
}) => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(
    propCurrentMonth || new Date()
  );
  const [daysList, setDaysList] = useState([]);
  const [eventFilter, setEventFilter] = useState("all"); // all, online, offline, workshop

  useEffect(() => {
    if (propCurrentMonth) {
      setCurrentMonth(propCurrentMonth);
    }
  }, [propCurrentMonth]);

  useEffect(() => {
    generateDays();
    if (onMonthChange) {
      onMonthChange(currentMonth);
    }
  }, [currentMonth, bookings]);

  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    let daysList = [];

    // Add empty slots for previous month's days
    for (let i = 0; i < startingDay; i++) {
      daysList.push({
        day: new Date(year, month, -startingDay + i + 1).getDate(),
        date: new Date(year, month, -startingDay + i + 1),
        isCurrentMonth: false,
        bookings: [],
      });
    }

    // Add days for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      daysList.push({
        day: i,
        date: dayDate,
        isCurrentMonth: true,
        bookings: [],
      });
    }

    // Fill any remaining slots in the grid
    const totalSlots = Math.ceil((startingDay + daysInMonth) / 7) * 7;
    for (let i = daysList.length; i < totalSlots; i++) {
      daysList.push({
        day: new Date(year, month + 1, i - daysList.length + 1).getDate(),
        date: new Date(year, month + 1, i - daysList.length + 1),
        isCurrentMonth: false,
        bookings: [],
      });
    }

    setDaysList(daysList);
  };

  const handleCustomerClick = (bookingId) => {
    navigate(`/booking-schedule/${bookingId}`);
  };

  const nextMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    setCurrentMonth(newMonth);
  };

  const prevMonth = () => {
    const newMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    setCurrentMonth(newMonth);
  };

  const formatMonthDisplay = (date) => {
    return date.toLocaleString("vi-VN", { month: "long", year: "numeric" });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Lọc bookings theo loại sự kiện
  const filterBookings = (bookings) => {
    if (eventFilter === "all") return bookings;

    return bookings.filter((booking) => {
      switch (eventFilter) {
        case "online":
          return booking.eventType === "Tư vấn trực tuyến";
        case "offline":
          return booking.eventType === "Tư vấn trực tiếp";
        case "workshop":
          return booking.eventType === "Workshop";
        default:
          return true;
      }
    });
  };

  // Mảng tên các ngày trong tuần
  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  // Sắp xếp các lịch hẹn theo thời gian
  const sortBookingsByTime = (bookings) => {
    return [...bookings].sort((a, b) => {
      // Thứ tự ưu tiên: Workshop > Tư vấn trực tiếp > Tư vấn trực tuyến > Lịch trống
      const priorityOrder = {
        Workshop: 1,
        "Tư vấn trực tiếp": 2,
        "Tư vấn trực tuyến": 3,
        "Chưa có lịch hẹn": 4,
      };

      // So sánh ưu tiên theo loại sự kiện trước
      const priorityDiff =
        priorityOrder[a.eventType] - priorityOrder[b.eventType];
      if (priorityDiff !== 0) return priorityDiff;

      // Nếu cùng loại, sắp xếp theo thời gian
      return a.time.localeCompare(b.time);
    });
  };

  // Hàm render mặc định cho sự kiện nếu không có renderBooking từ prop
  const defaultRenderBooking = (booking) => {
    // Xác định biểu tượng hiển thị dựa trên loại sự kiện
    const getEventIcon = () => {
      if (booking.eventType === "Tư vấn trực tiếp") {
        return <MapPin className="inline-block w-3 h-3 mr-1" />;
      } else if (booking.eventType === "Tư vấn trực tuyến") {
        return <Clock className="inline-block w-3 h-3 mr-1" />;
      } else if (booking.eventType === "Workshop") {
        return <CalendarIcon className="inline-block w-3 h-3 mr-1" />;
      } else {
        return <Clock className="inline-block w-3 h-3 mr-1" />;
      }
    };

    // Xác định màu sắc dựa trên loại sự kiện
    const getEventColor = () => {
      if (booking.eventType === "Tư vấn trực tiếp") {
        return "bg-orange-500";
      } else if (booking.eventType === "Tư vấn trực tuyến") {
        return "bg-green-500";
      } else if (booking.eventType === "Workshop") {
        return "bg-blue-500";
      } else {
        return "bg-gray-400";
      }
    };

    return (
      <div
        key={booking.id}
        className={`${
          booking.eventColor || getEventColor()
        } text-white text-xs p-1.5 rounded mb-1 w-full`}
      >
        <div className="font-medium truncate">{booking.customerName}</div>
        <div className="text-xs truncate flex items-center">
          {getEventIcon()}
          {booking.time}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-sm transition-all duration-300 w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
        Lịch đặt hẹn tư vấn
      </h2>

      {/* Phần bộ lọc và điều hướng */}
      <div className="mb-4 border-b pb-2">
        {/* Bộ lọc */}
        <div className="flex flex-wrap gap-1 justify-center mb-3">
          <button
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all ${
              eventFilter === "all"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setEventFilter("all")}
          >
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <span className="font-medium">Tất cả</span>
          </button>
          <button
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all ${
              eventFilter === "online"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setEventFilter("online")}
          >
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="font-medium">Tư vấn trực tuyến</span>
          </button>
          <button
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all ${
              eventFilter === "offline"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setEventFilter("offline")}
          >
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span className="font-medium">Tư vấn trực tiếp</span>
          </button>
          <button
            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-all ${
              eventFilter === "workshop"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setEventFilter("workshop")}
          >
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="font-medium">Workshop</span>
          </button>
        </div>

        {/* Điều hướng tháng */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <button
            onClick={prevMonth}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h3 className="text-base font-bold text-gray-800 min-w-[120px] text-center">
            {formatMonthDisplay(currentMonth)}
          </h3>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lịch */}
      <div className="border overflow-hidden">
        {/* Header của lịch */}
        <div className="grid grid-cols-7 bg-gray-50">
          {weekdays.map((day, index) => (
            <div
              key={index}
              className="p-2 text-center font-semibold text-sm text-gray-700 border-b border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Các ngày trong lịch */}
        <div className="grid grid-cols-7">
          {daysList.map((dayData, index) => {
            // Lọc các booking cho ngày này dựa trên ngày, tháng, năm đầy đủ
            const allDayBookings = bookings.filter((booking) => {
              if (!booking.fullDate) return false;

              const bookingDate = booking.fullDate;
              return (
                bookingDate.getDate() === dayData.day &&
                bookingDate.getMonth() === dayData.date.getMonth() &&
                bookingDate.getFullYear() === dayData.date.getFullYear()
              );
            });

            // Lọc và sắp xếp các booking cho ngày này
            const filteredBookings = filterBookings(allDayBookings);
            const dayBookings = sortBookingsByTime(filteredBookings);

            // Kiểm tra xem có phải là ngày hiện tại không
            const isCurrentDay = dayData.date && isToday(dayData.date);

            // Xác định loại ngày (cuối tuần, ngày lễ, v.v.)
            const isWeekend =
              dayData.date &&
              (dayData.date.getDay() === 0 || dayData.date.getDay() === 6);

            // Xác định chiều cao của ô dựa vào số lượng lịch hẹn
            const cellHeight = Math.min(
              Math.max(dayBookings.length * 32, 96),
              200
            ); // Min 96px, max 200px

            return (
              <div
                key={index}
                className={`
                  border-b border-r relative
                  last:border-r-0 transition-all duration-200
                  ${
                    !dayData.isCurrentMonth
                      ? "text-gray-400 bg-gray-50"
                      : "hover:bg-gray-50"
                  }
                  ${isWeekend && dayData.isCurrentMonth ? "bg-gray-50" : ""}
                  ${isCurrentDay ? "bg-blue-50 relative" : ""}
                `}
                style={{ height: `${cellHeight}px` }}
              >
                <div className="p-1 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`
                        inline-flex items-center justify-center w-6 h-6 text-sm rounded-full font-medium
                        ${isCurrentDay ? "bg-blue-500 text-white" : ""}
                      `}
                    >
                      {dayData.day}
                    </span>

                    {/* Hiển thị nhãn "Hôm nay" cho ngày hiện tại */}
                    {isCurrentDay && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-1 py-0.5 rounded-sm">
                        Hôm nay
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1">
                    {dayBookings.length > 0 ? (
                      dayBookings.map((booking) => (
                        <div key={booking.id} className="booking-item">
                          {renderBooking
                            ? renderBooking(booking)
                            : defaultRenderBooking(booking)}
                        </div>
                      ))
                    ) : (
                      // Bỏ dòng hiển thị "Không có lịch"
                      <div className="text-xs text-gray-400"></div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Calendar.propTypes = {
  bookings: PropTypes.array.isRequired,
  renderBooking: PropTypes.func,
  onMonthChange: PropTypes.func,
  currentMonth: PropTypes.instanceOf(Date),
};

Calendar.defaultProps = {
  bookings: [],
};

export default Calendar;
