import React, { useState } from "react";
import SearchBar from "../components/Common/SearchBar";
import BookingTable from "../components/Booking/BookingTable";
import Pagination from "../components/Common/Pagination";

const BookingSchedule = () => {
  const [bookings] = useState([
    {
      id: 1,
      customerName: "John Smith",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyen Trong Manh",
      status: "pending",
      isOnline: true,
    },
    {
      id: 2,
      customerName: "John Smith",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyen Trong Manh",
      status: "done",
      isOnline: false,
    },
    {
      id: 3,
      customerName: "John Smith",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyen Trong Manh",
      status: "cancel",
      isOnline: true,
    },
    {
      id: 4,
      customerName: "John Smith",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyen Trong Manh",
      status: "scheduled",
      isOnline: true,
    },
    {
      id: 5,
      customerName: "John Smith",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyen Trong Manh",
      status: "pending",
      isOnline: false,
    },
    // Thêm data mẫu khác
  ]);

  const handleSearch = (searchTerm) => {
    // Implement search logic
    console.log("Searching for:", searchTerm);
  };

  const handlePageChange = (page) => {
    // Implement pagination logic
    console.log("Changing to page:", page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">
          Booking Schedule Management
        </h1>
        <p className="text-white/80 text-sm">
          Reports and overview of your workspace
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <SearchBar onSearch={handleSearch} />
        </div>

        <BookingTable bookings={bookings} />

        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default BookingSchedule;
