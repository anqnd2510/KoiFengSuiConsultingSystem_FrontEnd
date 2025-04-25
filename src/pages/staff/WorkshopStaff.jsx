import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, message, Spin, Button, Tooltip, Typography, Select } from "antd";
import {
  ReloadOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import CustomTable from "../../components/Common/CustomTable";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import FilterBar from "../../components/Common/FilterBar";
import {
  getWorkshopsByCreatedDate,
  formatWorkshopsData,
} from "../../services/workshopstaff.service";

const { Paragraph } = Typography;

// Hàm tạo màu ngẫu nhiên dựa trên chuỗi
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

const WorkshopStaff = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("all");

  // Fetch workshops từ API
  const fetchWorkshops = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWorkshopsByCreatedDate();
      console.log("Dữ liệu workshop gốc:", data);

      if (!data || data.length === 0) {
        setWorkshops([]);
      } else {
        // Lọc chỉ lấy những workshop có status là approved
        const approvedWorkshops = data.filter(workshop => workshop.status === "Approved");
        const formattedData = formatWorkshopsData(approvedWorkshops);
        console.log("Dữ liệu workshop đã định dạng:", formattedData);
        
        // Lọc và cập nhật trạng thái workshop
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00

        const updatedWorkshops = formattedData.map(workshop => {
          // Chuyển đổi ngày workshop từ format dd/mm/yyyy sang Date object
          const [day, month, year] = workshop.date.split('/');
          const workshopDate = new Date(year, month - 1, day);
          workshopDate.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00

          console.log('So sánh ngày:', {
            workshopDate: workshopDate.toISOString(),
            today: today.toISOString(),
            comparison: workshopDate.getTime() === today.getTime() ? 'equal' : workshopDate.getTime() > today.getTime() ? 'future' : 'past'
          });

          if (workshopDate.getTime() === today.getTime()) {
            return { ...workshop, status: "Đang diễn ra" };
          } else if (workshopDate.getTime() > today.getTime()) {
            return { ...workshop, status: "Sắp diễn ra" };
          } else {
            return { ...workshop, status: "Đã kết thúc" };
          }
        });

        // Lọc chỉ lấy workshop có trạng thái phù hợp
        const relevantWorkshops = updatedWorkshops.filter(
          (workshop) => workshop.status === "Sắp diễn ra" || workshop.status === "Đang diễn ra" || workshop.status === "Đã kết thúc"
        );
        
        console.log("Workshop đã cập nhật:", relevantWorkshops);
        setWorkshops(relevantWorkshops);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu workshop:", err);
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchWorkshops();
  }, []);

  // Hàm chuyển đổi trạng thái từ API sang UI
  const getStatusColor = (status) => {
    switch (status) {
      case "Sắp diễn ra":
        return "blue";
      case "Đang diễn ra":
        return "green";
      case "Đã xong":
        return "gray";
      default:
        return "default";
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    console.log("Searching for:", searchTerm);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    console.log("Lọc theo trạng thái:", value);
  };

  const handleRowClick = (workshop) => {
    console.log("Đã chọn workshop:", workshop);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Changing to page:", page);
  };

  // Tùy chọn trạng thái cho bộ lọc - bỏ đi vì chỉ hiển thị "Sắp diễn ra"
  const statusOptions = [];

  // Hàm xử lý sắp xếp
  const handleSort = (value) => {
    setSortOrder(value);
    console.log("Sắp xếp theo:", value);
  };

  // Lọc và sắp xếp dữ liệu
  const getFilteredAndSortedWorkshops = () => {
    let result = [...workshops].filter((workshop) => {
      const matchesSearch =
        (workshop.name &&
          workshop.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (workshop.master &&
          workshop.master.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (workshop.location &&
          workshop.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (workshop.workshopId &&
          workshop.workshopId.toLowerCase().includes(searchTerm.toLowerCase()));

      // Lọc theo trạng thái được chọn
      const matchesStatus = 
        sortOrder === "all" ||
        (sortOrder === "ongoing" && workshop.status === "Đang diễn ra") ||
        (sortOrder === "upcoming" && workshop.status === "Sắp diễn ra");

      return matchesSearch && matchesStatus;
    });

    // Sắp xếp theo ngày
    result.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA - dateB;
    });

    return result;
  };

  const columns = [
    {
      title: "WORKSHOP ID",
      dataIndex: "workshopId",
      key: "workshopId",
      width: 180,
      render: (text) => text,
    },
    {
      title: "TÊN WORKSHOP",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          {text}
          {record.description && (
            <Tooltip title={record.description}>
              <InfoCircleOutlined style={{ marginLeft: 8, color: "#1890ff" }} />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: "MASTER",
      dataIndex: "master",
      key: "master",
      render: (text, record) => {
        // Kiểm tra email người dùng
        const userEmail = localStorage.getItem("userEmail");

        // Nếu người dùng đăng nhập là bob@example.com
        if (userEmail === "bob@example.com") {
          return "Bob Chen";
        }

        return text;
      },
    },
    {
      title: "ĐỊA ĐIỂM",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "NGÀY",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "GIÁ",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price ? `${price.toLocaleString("vi-VN")} VND` : "N/A",
    },
    {
      title: "TRẠNG THÁI",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "HÀNH ĐỘNG",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/staff/audience/${record.workshopId || record.id}`);
          }}
        >
          Xem
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <Header title="Workshop" description="Quản lý workshop" />

      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <SearchBar
                placeholder="Tìm workshop..."
                onSearch={handleSearch}
                className="w-64"
              />
            </div>
            <div className="flex items-center gap-4">
              <Select
                defaultValue="all"
                style={{ width: 200 }}
                onChange={handleSort}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'ongoing', label: 'Đang diễn ra' },
                  { value: 'upcoming', label: 'Sắp diễn ra' },
                  
                ]}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
          ) : (
            <>
              {workshops.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">
                    Không có hội thảo nào sắp diễn ra
                  </p>

                </div>
              ) : (
                <>
                  <CustomTable
                    columns={columns}
                    dataSource={getFilteredAndSortedWorkshops()}
                    onRowClick={handleRowClick}
                    rowKey="id"
                    scroll={{ x: 1200 }}
                  />

                  <div className="mt-4 flex justify-end">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(getFilteredAndSortedWorkshops().length / 10)}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkshopStaff;
