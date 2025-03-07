import React, { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { Tag } from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import CustomTable from "../components/Common/CustomTable";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import FilterBar from "../components/Common/FilterBar";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Xử lý tìm kiếm
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    console.log("Searching for:", searchTerm);
    // Thực hiện logic tìm kiếm ở đây
  };

  // Xử lý filter theo trạng thái
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    console.log("Lọc theo trạng thái:", value);
  };

  // Xử lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Xác định màu sắc cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "done":
        return "success";
      case "cancel":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  // Tùy chọn trạng thái cho bộ lọc
  const statusOptions = [
    { value: "done", label: "Hoàn tất" },
    { value: "cancel", label: "Đã hủy" },
    { value: "pending", label: "Đang chờ" }
  ];

  // Lọc dữ liệu theo từ khóa tìm kiếm và trạng thái
  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.courseName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || registration.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Phân trang dữ liệu
  const paginatedRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "KHÁCH HÀNG",
      dataIndex: "customerName",
      key: "customerName"
    },
    {
      title: "KHÓA HỌC",
      dataIndex: "courseName",
      key: "courseName"
    },
    {
      title: "NGÀY",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "SỐ LƯỢNG",
      dataIndex: "count",
      key: "count"
    },
    {
      title: "PHƯƠNG THỨC THANH TOÁN",
      dataIndex: "paymentMethod",
      key: "paymentMethod"
    },
    {
      title: "TỔNG TIỀN",
      dataIndex: "total",
      key: "total",
      render: (total) => `$${total}`
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === "done" ? "Hoàn tất" : 
           status === "cancel" ? "Đã hủy" : "Đang chờ"}
        </Tag>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý đơn đăng ký khóa học"
        description="Quản lý đơn đăng ký khóa học của khách hàng"
      />

      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <SearchBar 
              placeholder="Tìm khóa học theo tên khách hàng hoặc tên khóa học"
              onSearch={handleSearch}
              className="w-64 mb-2 md:mb-0"
            />
            
            <FilterBar 
              statusOptions={statusOptions}
              onStatusChange={handleStatusFilterChange}
              defaultValue="all"
              placeholder="Trạng thái"
              width="150px"
              className="ml-auto"
            />
          </div>

          {error && <Error message={error} />}

          <CustomTable
            columns={columns}
            dataSource={paginatedRegistrations}
            pagination={false}
          />

          <div className="mt-4 flex justify-end">
            <Pagination
              current={currentPage}
              total={filteredRegistrations.length}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement; 