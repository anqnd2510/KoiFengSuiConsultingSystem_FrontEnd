import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tag } from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import CustomTable from "../components/Common/CustomTable";

const AudienceList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const workshopId = queryParams.get("workshopId");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [audiences, setAudiences] = useState([
    {
      id: "T01",
      name: "Nguyễn Văn A",
      phone: "1234567890",
      email: "nguyenvana@gmail.com",
      date: "1/1/2021",
      status: "Đã điểm danh"
    },
    {
      id: "T02",
      name: "Trần Thị B",
      phone: "1234567890",
      email: "tranthib@gmail.com",
      date: "1/1/2021",
      status: "Chờ xác nhận"
    },
    {
      id: "T03",
      name: "Lê Văn C",
      phone: "1234567890",
      email: "levanc@gmail.com",
      date: "1/1/2021",
      status: "Vắng mặt"
    },
    {
      id: "T04",
      name: "Phạm Thị D",
      phone: "1234567890",
      email: "phamthid@gmail.com",
      date: "1/1/2021",
      status: "Chờ xác nhận"
    }
  ]);

  const [error, setError] = useState(true);

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã điểm danh":
        return "success";
      case "Chờ xác nhận":
        return "warning";
      case "Vắng mặt":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Mã vé",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: "15%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: "15%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">Người tham dự</h1>
        <p className="text-white/80 text-sm">Báo cáo và tất cả khán giả đã tham gia trong hội thảo</p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="font-bold">Đã xảy ra lỗi!</span>
          </div>
        )}

        <CustomTable 
          columns={columns}
          dataSource={audiences}
          loading={loading}
        />

        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AudienceList;
