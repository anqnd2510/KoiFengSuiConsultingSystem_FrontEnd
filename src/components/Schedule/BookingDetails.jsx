import React from "react";

const BookingDetails = ({ booking }) => {
  return (
    <div className="absolute z-10 bg-white p-4 rounded-lg shadow-lg border w-[300px] -translate-x-1/2 left-1/2">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-lg">
              Customer:
              <span className="font-normal ml-1">{booking.customerName}</span>
            </div>
            <div className="text-sm text-gray-600">
              Phone number: {booking.phoneNumber}
            </div>
          </div>
          <div className="flex gap-2">
            {booking.isOnline && (
              <span className="px-3 py-1 bg-[#90B77D] text-white text-sm rounded-full">
                Online
              </span>
            )}
            {booking.isOffline && (
              <span className="px-3 py-1 bg-[#B4925A] text-white text-sm rounded-full">
                Offline
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="font-medium mb-1">
            Description of consulting needs:
          </div>
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {booking.description}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-medium mb-1">Address:</div>
            <div className="text-sm text-gray-600">{booking.address}</div>
          </div>
          <div>
            <div className="font-medium mb-1">Time:</div>
            <div className="text-sm text-gray-600">{booking.time}</div>
          </div>
        </div>

        <div>
          <div className="font-medium mb-1">Link:</div>
          <a
            href={booking.link}
            className="text-sm text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {booking.link}
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
