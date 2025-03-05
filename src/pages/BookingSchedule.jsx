import React, { useState } from "react";
import SearchBar from "../components/Common/SearchBar";
import BookingTable from "../components/Booking/BookingTable";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";

const BookingSchedule = () => {
  const [bookings] = useState([
    {
      id: 1,
      customerName: "Nguyễn Văn A",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyễn Trọng Mạnh",
      status: "pending",
      isOnline: true,
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyễn Trọng Mạnh",
      status: "done",
      isOnline: false,
    },
    {
      id: 3,
      customerName: "Lê Văn C",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyễn Trọng Mạnh",
      status: "cancel",
      isOnline: true,
    },
    {
      id: 4,
      customerName: "Phạm Thị D",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyễn Trọng Mạnh",
      status: "scheduled",
      isOnline: true,
    },
    {
      id: 5,
      customerName: "Hoàng Văn E",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyễn Trọng Mạnh",
      status: "pending",
      isOnline: false,
    },
    // Thêm data mẫu khác
  ]);
  const [error, setError] = useState(null);

  const handleSearch = (searchTerm) => {
    console.log("Tìm kiếm:", searchTerm);
  };

  const handlePageChange = (page) => {
    console.log("Chuyển đến trang:", page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý lịch đặt hẹn"
        description="Báo cáo và tổng quan về lịch đặt hẹn"
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && <Error message={error} />}

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
