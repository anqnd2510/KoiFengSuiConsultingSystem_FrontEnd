import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import CustomTable from "../components/Common/CustomTable";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";

const WorkshopStaff = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Checked in"
    },
    {
      id: 2,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học I",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Checking"
    },
    {
      id: 3,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học II",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Reject"
    },
    {
      id: 4,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học III",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Cancel"
    }
  ]);

  const [error, setError] = useState("Đã xảy ra lỗi");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const handleRowClick = (workshop) => {
    if (workshop.status === "Checked in") {
      navigate(`/audience?workshopId=${workshop.id}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Changing to page:", page);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Checked in":
        return "success";
      case "Checking":
        return "warning";
      case "Reject":
        return "error";
      case "Cancel":
        return "default";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Mã hội thảo",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "Tên hội thảo",
      dataIndex: "name",
      key: "name",
      width: "25%",
    },
    {
      title: "Tên chuyên gia",
      dataIndex: "master",
      key: "master",
      width: "20%",
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      width: "20%",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý hội thảo"
        description="Báo cáo và tổng quan về các hội thảo"
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && <Error message={error} />}

        <CustomTable
          columns={columns}
          dataSource={workshops}
          loading={false}
          onRow={(record) => ({
            onClick: () => {
              if (record.status === "Checked in") {
                handleRowClick(record);
              }
            },
            style: {
              cursor: record.status === "Checked in" ? "pointer" : "default",
            },
          })}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default WorkshopStaff; 