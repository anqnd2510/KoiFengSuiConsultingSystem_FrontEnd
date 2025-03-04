import React, { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { Tag } from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import CustomTable from "../components/Common/CustomTable";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";

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

  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "success";
      case "cancel":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: "20%",
    },
    {
      title: "Khóa học",
      dataIndex: "courseName",
      key: "courseName",
      width: "25%",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: "10%",
    },
    {
      title: "Số lượng",
      dataIndex: "count",
      key: "count",
      width: "10%",
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: "15%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      width: "10%",
      render: (total) => `$${total}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === "done" ? "Hoàn thành" : 
           status === "cancel" ? "Đã hủy" : status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý khóa học"
        description="Báo cáo và tổng quan về khóa học của bạn"
      />

      {/* Main Content */}
      <div id="main-content" className="p-6 relative">
        {/* Thanh tìm kiếm */}
        <div className="mb-6 flex justify-end">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && <Error message={error} />}

        <CustomTable
          columns={columns}
          dataSource={registrations}
          loading={false}
        />

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