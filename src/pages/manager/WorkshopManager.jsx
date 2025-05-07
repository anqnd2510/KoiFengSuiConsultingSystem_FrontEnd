import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, message, Spin, Button, Tooltip, Typography, Modal } from "antd";
import {
  ReloadOutlined,
  InfoCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import CustomTable from "../../components/Common/CustomTable";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import FilterBar from "../../components/Common/FilterBar";
import BackButton from "../../components/Common/BackButton";
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

const WorkshopManager = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  // Fetch workshops từ API
  const fetchWorkshops = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWorkshopsByCreatedDate();
      console.log("Raw data from API:", data);

      if (!data || data.length === 0) {
        setWorkshops([]);
      } else {
        const formattedData = formatWorkshopsData(data);
        console.log("Formatted data:", formattedData);
        
        // Cập nhật trạng thái dựa trên ngày
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00

        const updatedWorkshops = formattedData.map(workshop => {
          // Kiểm tra status với nhiều định dạng có thể
          const status = workshop.status?.toLowerCase();
          console.log("Workshop current status:", status);

          // Nếu workshop đang chờ duyệt hoặc bị từ chối, giữ nguyên trạng thái
          if (status === "chờ duyệt" || status === "từ chối" || 
              status === "pending" || status === "rejected") {
            return workshop;
          }

          // Chuyển đổi ngày workshop từ format dd/mm/yyyy sang Date object
          const [day, month, year] = workshop.date.split('/');
          const workshopDate = new Date(year, month - 1, day);
          workshopDate.setHours(0, 0, 0, 0); // Reset giờ về 00:00:00

          console.log('So sánh ngày:', {
            workshopId: workshop.workshopId,
            workshopDate: workshopDate.toISOString(),
            today: today.toISOString(),
            comparison: workshopDate.getTime() === today.getTime() ? 'equal' : workshopDate.getTime() > today.getTime() ? 'future' : 'past'
          });

          // Cập nhật trạng thái dựa trên ngày
          if (workshopDate.getTime() === today.getTime()) {
            return { ...workshop, status: "Đang diễn ra" };
          } else if (workshopDate.getTime() > today.getTime()) {
            return { ...workshop, status: "Sắp diễn ra" };
          } else {
            return { ...workshop, status: "Đã kết thúc" };
          }
        });

        console.log("Updated workshops with new status:", updatedWorkshops);
        setWorkshops(updatedWorkshops);
      }
    } catch (err) {
      console.error("Error fetching workshops:", err);
      setError(`Không thể tải dữ liệu workshop: ${err.message}`);
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
      case "Đã kết thúc":
        return "gray";
      case "Từ chối":
        return "red";
      case "Chờ duyệt":
        return "orange";
      default:
        return "default";
    }
  };

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleRowClick = (workshop) => {
    setSelectedWorkshop(workshop);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openWorkshopDetail = (workshop) => {
    setSelectedWorkshop(workshop);
    setModalVisible(true);
  };

  // Tùy chọn trạng thái cho bộ lọc
  const statusOptions = [
    { value: "Chờ duyệt", label: "Chờ duyệt" },
    { value: "Sắp diễn ra", label: "Sắp diễn ra" },
    { value: "Đang diễn ra", label: "Đang diễn ra" },
    { value: "Đã kết thúc", label: "Đã kết thúc" },
    { value: "Từ chối", label: "Từ chối" }
  ];

  // Lọc dữ liệu theo từ khóa tìm kiếm và trạng thái
  const filteredWorkshops = workshops.filter((workshop) => {
    const matchesSearch =
      (workshop.name &&
        workshop.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (workshop.master &&
        workshop.master.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (workshop.location &&
        workshop.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (workshop.workshopId &&
        workshop.workshopId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || workshop.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sắp xếp dữ liệu theo ngày tạo mới nhất (mặc định)
  const sortedWorkshops = [...filteredWorkshops].sort((a, b) => {
    return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
  });

  // Số workshop trên mỗi trang
  const pageSize = 10;
  
  // Lấy dữ liệu cho trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedWorkshops = sortedWorkshops.slice(startIndex, startIndex + pageSize);

  const columns = [
    {
      title: "Mã hội thảo",
      dataIndex: "workshopId",
      key: "workshopId",
      width: 180,
      render: (text) => text,
    },
    {
      title: "Tên hội thảo",
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
      title: "Tư vấn viên",
      dataIndex: "master",
      key: "master",
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        price ? `${price.toLocaleString("vi-VN")} VND` : "N/A",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              openWorkshopDetail(record);
            }}
          >
            Xem
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <Header title="Quản lý hội thảo" description="Quản lý hội thảo" />

      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <BackButton to="/manager/workshop-list" />
              <SearchBar
                placeholder="Tìm workshop..."
                onSearch={handleSearch}
              />
            </div>

            <div className="flex items-center space-x-2">
              <FilterBar
                statusOptions={statusOptions}
                onStatusChange={handleStatusFilterChange}
                defaultValue="all"
                placeholder="Trạng thái"
                width="170px"
              />
            </div>
          </div>

          {error && <Error message={error} />}

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Spin size="large" tip="Đang tải dữ liệu..." />
            </div>
          ) : (
            <>
              {workshops.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">
                    Không có dữ liệu workshop. Vui lòng thử lại sau.
                  </p>
                  
                </div>
              ) : (
                <>
                  <CustomTable
                    columns={columns}
                    dataSource={paginatedWorkshops}
                    onRowClick={handleRowClick}
                    rowKey="id"
                    scroll={{ x: 1200 }}
                    pagination={false}
                  />

                  <div className="mt-4 flex justify-end">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(sortedWorkshops.length / pageSize)}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal hiển thị chi tiết workshop */}
      <Modal
        title="Chi tiết hội thảo"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedWorkshop && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Mã hội thảo:</p>
                <p>{selectedWorkshop.workshopId}</p>
              </div>
              <div>
                <p className="font-semibold">Tên hội thảo:</p>
                <p>{selectedWorkshop.name}</p>
              </div>
              <div>
                <p className="font-semibold">Tư vấn viên:</p>
                <p>{selectedWorkshop.master}</p>
              </div>
              <div>
                <p className="font-semibold">Địa điểm:</p>
                <p>{selectedWorkshop.location}</p>
              </div>
              <div>
                <p className="font-semibold">Ngày:</p>
                <p>{selectedWorkshop.date}</p>
              </div>
              <div>
                <p className="font-semibold">Thời gian:</p>
                <div>
                  <p>Bắt đầu: {selectedWorkshop.startTime || "Chưa có thông tin"}</p>
                  <p>Kết thúc: {selectedWorkshop.endTime || "Chưa có thông tin"}</p>
                </div>
              </div>
              <div>
                <p className="font-semibold">Giá:</p>
                <p>
                  {selectedWorkshop.price
                    ? `${selectedWorkshop.price.toLocaleString("vi-VN")} VND`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="font-semibold">Trạng thái:</p>
                <Tag color={getStatusColor(selectedWorkshop.status)}>
                  {selectedWorkshop.status}
                </Tag>
              </div>
             
            </div>

            {selectedWorkshop.description && (
              <div className="mt-4">
                <p className="font-semibold">Mô tả:</p>
                <p>{selectedWorkshop.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WorkshopManager; 