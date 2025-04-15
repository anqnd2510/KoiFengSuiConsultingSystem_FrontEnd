import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DAYS_OF_WEEK, formatMonth } from "../../utils/dateUtils";
import { useCalendar } from "../../hooks/useCalendar";
import { useNavigate } from "react-router-dom";

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

  // Hàm render mặc định cho sự kiện nếu không có renderBooking từ prop
  const defaultRenderBooking = (booking) => (
    <div
      key={booking.id}
      className="bg-blue-500 text-white text-xs p-1 rounded mb-1 cursor-pointer"
      onClick={() => handleCustomerClick(booking.id)}
    >
      <div className="font-medium truncate">{booking.customerName}</div>
      <div className="text-xs truncate">{booking.time}</div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg transition-all duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Lịch đặt hẹn tư vấn
      </h2>

      {/* Phần bộ lọc và điều hướng */}
      <div className="mb-6">
        {/* Bộ lọc màu sắc */}
        <div className="flex flex-wrap gap-3 justify-center mb-4 border-b pb-4">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              eventFilter === "all"
                ? "bg-gray-800 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setEventFilter("all")}
          >
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            <span className="text-sm font-medium">Tất cả</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              eventFilter === "online"
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setEventFilter("online")}
          >
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">Tư vấn trực tuyến</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              eventFilter === "offline"
                ? "bg-orange-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setEventFilter("offline")}
          >
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm font-medium">Tư vấn trực tiếp</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              eventFilter === "workshop"
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setEventFilter("workshop")}
          >
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium">Workshop</span>
          </button>
        </div>

        {/* Thông báo lọc hiện tại */}
        {eventFilter !== "all" && (
          <div className="text-center text-sm text-blue-600 font-medium mb-4 bg-blue-50 py-2 px-4 rounded-full inline-block mx-auto">
            Đang hiển thị:{" "}
            {eventFilter === "online"
              ? "Chỉ lịch tư vấn trực tuyến"
              : eventFilter === "offline"
              ? "Chỉ lịch tư vấn trực tiếp"
              : "Chỉ lịch workshop"}
            <button
              className="ml-2 text-xs text-red-500 hover:underline"
              onClick={() => setEventFilter("all")}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Điều hướng tháng */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700 hover:text-gray-900"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h3 className="text-xl font-bold text-gray-800 min-w-[180px] text-center">
            {formatMonthDisplay(currentMonth)}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700 hover:text-gray-900"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Lịch */}
      <div className="border rounded-xl overflow-hidden shadow-sm">
        {/* Header của lịch */}
        <div className="grid grid-cols-7 bg-gray-50">
          {weekdays.map((day, index) => (
            <div
              key={index}
              className="p-4 text-center font-semibold text-gray-700 border-b border-r last:border-r-0"
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

            // Áp dụng bộ lọc sự kiện
            const dayBookings = filterBookings(allDayBookings);

            // Kiểm tra xem có phải là ngày hiện tại không
            const isCurrentDay = dayData.date && isToday(dayData.date);

            // Xác định loại ngày (cuối tuần, ngày lễ, v.v.)
            const isWeekend =
              dayData.date &&
              (dayData.date.getDay() === 0 || dayData.date.getDay() === 6);

            return (
              <div
                key={index}
                className={`
                  min-h-[120px] p-3 border-b border-r relative
                  last:border-r-0 transition-all duration-200
                  ${
                    !dayData.isCurrentMonth
                      ? "text-gray-400 bg-gray-50"
                      : "hover:bg-gray-50"
                  }
                  ${isWeekend && dayData.isCurrentMonth ? "bg-gray-50" : ""}
                  ${isCurrentDay ? "bg-blue-50 relative" : ""}
                `}
              >
                <span
                  className={`
                    block mb-2 font-medium rounded-full w-8 h-8 flex items-center justify-center
                    ${isCurrentDay ? "bg-blue-500 text-white shadow-sm" : ""}
                  `}
                >
                  {dayData.day}
                </span>

                {/* Hiển thị nhãn "Hôm nay" cho ngày hiện tại */}
                {isCurrentDay && (
                  <span className="absolute top-1 right-2 text-xs font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                    Hôm nay
                  </span>
                )}

                <div className="space-y-1">
                  {dayBookings.map((booking) => (
                    <div key={booking.id}>
                      {renderBooking
                        ? renderBooking(booking)
                        : defaultRenderBooking(booking)}
                    </div>
                  ))}
                </div>

                {/* Chỉ hiển thị số lượng sự kiện bị ẩn nếu đang không lọc */}
                {eventFilter === "all" && allDayBookings.length > 3 && (
                  <div className="text-xs text-center mt-1 font-medium text-blue-600 bg-blue-50 py-0.5 px-2 rounded-full">
                    +{allDayBookings.length - 3} sự kiện khác
                  </div>
                )}

                {/* Hiển thị thông báo nếu có sự kiện bị lọc */}
                {eventFilter !== "all" &&
                  allDayBookings.length !== dayBookings.length && (
                    <div className="text-xs text-center mt-1 font-medium text-gray-500 bg-gray-100 py-0.5 px-2 rounded-full">
                      ({allDayBookings.length - dayBookings.length} sự kiện đã
                      lọc)
                    </div>
                  )}
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
