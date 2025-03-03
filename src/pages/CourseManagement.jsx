import React, { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import StatusBadge from "../components/Common/StatusBadge";

const CourseManagement = () => {
  // State cho danh sách khóa học đã đăng ký
  const [registrations, setRegistrations] = useState([
    {
      id: 1,
      customerName: "John Smith",
      courseName: "Đại Đạo Chi Giản - Phong Thủy Cổ Học",
      date: "9/12",
      count: 1,
      paymentMethod: "VNPay",
      total: 20.05,
      status: "done"
    },
    {
      id: 2,
      customerName: "John Smith",
      courseName: "Đại Đạo Chi Giản - Phong Thủy Cổ Học",
      date: "6/12",
      count: 2,
      paymentMethod: "VNPay",
      total: 40.1,
      status: "cancel"
    },
    {
      id: 3,
      customerName: "John Smith",
      courseName: "Đại Đạo Chi Giản - Phong Thủy Cổ Học",
      date: "5/12",
      count: 1,
      paymentMethod: "VNPay",
      total: 20.05,
      status: "done"
    },
    {
      id: 4,
      customerName: "John Smith",
      courseName: "Đại Đạo Chi Giản - Phong Thủy Cổ Học",
      date: "3/11",
      count: 1,
      paymentMethod: "VNPay",
      total: 20.05,
      status: "done"
    }
  ]);

  // State cho lỗi
  const [error, setError] = useState("Lỗi");
  
  // Xử lý tìm kiếm
  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
    // Thực hiện logic tìm kiếm ở đây
  };

  // Xử lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">Quản lý khóa học</h1>
        <p className="text-white/80 text-sm">Báo cáo và tổng quan về khóa học của bạn</p>
      </div>

      {/* Main Content */}
      <div id="main-content" className="p-6 relative">
        {/* Thanh tìm kiếm */}
        <div className="mb-6 flex justify-end">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <FaExclamationCircle className="mr-2" />
            <span>Đã xảy ra lỗi!</span>
          </div>
        )}

        {/* Bảng danh sách đăng ký khóa học */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Tên khách hàng
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Ngày
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Phương thức thanh toán
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations.map((registration) => (
                <tr key={registration.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {registration.customerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {registration.courseName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {registration.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {registration.count}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {registration.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${registration.total}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={registration.status} />
                  </td>
                </tr>
              ))}
              {/* Thêm các hàng trống nếu cần */}
              {Array.from({ length: Math.max(0, 7 - registrations.length) }).map((_, index) => (
                <tr key={`empty-${index}`} className="h-16">
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                  <td className="px-6 py-4 text-sm text-gray-900"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseManagement; 