import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DAYS_OF_WEEK, formatMonth } from "../../utils/dateUtils";
import { useCalendar } from "../../hooks/useCalendar";
import BookingDetails from "./BookingDetails";

const Calendar = ({ bookings = [] }) => {
  const { currentDate, days, goToPreviousMonth, goToNextMonth } = useCalendar();
  const [activeBookingId, setActiveBookingId] = useState(null);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        Consulting Booking Schedule
      </h2>

      <div className="flex items-center justify-center gap-6 mb-8">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-semibold">{formatMonth(currentDate)}</h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-7">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="p-4 text-center font-medium border-b border-r last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayBookings = bookings.filter(
              (booking) =>
                booking.date === day.date &&
                booking.isCurrentMonth === day.isCurrentMonth
            );

            return (
              <div
                key={index}
                className={`
                  min-h-[120px] p-3 border-b border-r relative
                  last:border-r-0 hover:bg-gray-50 transition-colors
                  ${!day.isCurrentMonth ? "text-gray-400 bg-gray-50" : ""}
                  ${day.isToday ? "bg-blue-50" : ""}
                `}
              >
                <span className="block mb-2 font-medium">{day.date}</span>
                <div className="space-y-1">
                  {dayBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="relative group"
                      onMouseEnter={() => setActiveBookingId(booking.id)}
                      onMouseLeave={() => setActiveBookingId(null)}
                    >
                      <div className="text-xs text-blue-600 cursor-pointer p-1 rounded group-hover:bg-blue-50">
                        {booking.time} {booking.customerName}
                      </div>
                      {activeBookingId === booking.id && (
                        <BookingDetails booking={booking} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
