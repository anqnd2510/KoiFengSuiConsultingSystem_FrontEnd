import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import CustomTable from "../components/Common/CustomTable";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import FilterBar from "../components/Common/FilterBar";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    console.log('Searching for:', searchTerm);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    console.log("Lọc theo trạng thái:", value);
  };

  const handleRowClick = (workshop) => {
    navigate(`/audience?workshopId=${workshop.id}`);
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

  // Tùy chọn trạng thái cho bộ lọc
  const statusOptions = [
    { value: "Checked in", label: "Đã tham gia" },
    { value: "Checking", label: "Đang kiểm tra" },
    { value: "Reject", label: "Từ chối" },
    { value: "Cancel", label: "Đã hủy" }
  ];

  // Lọc dữ liệu theo từ khóa tìm kiếm và trạng thái
  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = 
      workshop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.master.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || workshop.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: "TÊN WORKSHOP",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "MASTER",
      dataIndex: "master",
      key: "master"
    },
    {
      title: "ĐỊA ĐIỂM",
      dataIndex: "location",
      key: "location"
    },
    {
      title: "NGÀY",
      dataIndex: "date",
      key: "date"
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <Header
        title="Workshop"
        description="Quản lý workshop"
      />

      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <SearchBar 
              placeholder="Tìm workshop..."
              onSearch={handleSearch}
            />
            
            <FilterBar 
              statusOptions={statusOptions}
              onStatusChange={handleStatusFilterChange}
              defaultValue="all"
              placeholder="Trạng thái"
              width="170px"
              className="ml-auto mt-2 md:mt-0"
            />
          </div>

          {error && <Error message={error} />}

          <CustomTable
            columns={columns}
            dataSource={filteredWorkshops}
            onRowClick={handleRowClick}
          />

          <div className="mt-4 flex justify-end">
            <Pagination
              current={currentPage}
              total={filteredWorkshops.length}
              pageSize={10}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopStaff; 