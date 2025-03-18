import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tag, message, Spin, Button, Popconfirm, Alert, Typography } from "antd";
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import CustomTable from "../components/Common/CustomTable";
import Error from "../components/Common/Error";
import { checkInAudience } from "../services/audience.service";

const { Title } = Typography;

// Dữ liệu mẫu dựa trên hình ảnh
const audienceData = [
  {
    id: 1,
    attendId: "0BA1CFE1-53D2-47E3-B",
    workshopId: "NULL",
    attendName: "Jane Smith",
    phoneNumber: "0987654321",
    customerId: "CEDBA518-5EC0-4469-B",
    status: "Pending"
  },
  {
    id: 2,
    attendId: "3DAF1138-8D95-40BD-8",
    workshopId: "NULL",
    attendName: "John Doe",
    phoneNumber: "1234567890",
    customerId: "05369D4A-A270-4E52-A",
    status: "Confirmed"
  },
  {
    id: 3,
    attendId: "7D544216-AE7C-4A0B-8",
    workshopId: "NULL",
    attendName: "John Doe",
    phoneNumber: "1234567890",
    customerId: "05369D4A-A270-4E52-A",
    status: "Confirmed"
  },
  {
    id: 4,
    attendId: "D05BB2F7-6D35-4352-8",
    workshopId: "NULL",
    attendName: "Jane Smith",
    phoneNumber: "0987654321",
    customerId: "CEDBA518-5EC0-4469-B",
    status: "Pending"
  },
  {
    id: 5,
    attendId: "E61CB314-41C9-4AAD-B",
    workshopId: "357B32FE-63D8-4493-8",
    attendName: "John Doe",
    phoneNumber: "1234567890",
    customerId: "05369D4A-A270-4E52-A",
    status: "Confirmed"
  },
  {
    id: 6,
    attendId: "EE5E0887-6D93-4E0A-B",
    workshopId: "A9A5E712-15F4-448F-A",
    attendName: "Jane Smith",
    phoneNumber: "0987654321",
    customerId: "CEDBA518-5EC0-4469-B",
    status: "Pending"
  }
];

// Thông tin workshop
const workshopInfo = {
  "357B32FE-63D8-4493-8": {
    name: "Feng Shui for Beginners",
    master: "Bob Chen",
    location: "Community Center",
    date: "21/3/2023"
  },
  "A9A5E712-15F4-448F-A": {
    name: "Advanced Koi Care",
    master: "Jane Smith",
    location: "Koi Farm",
    date: "21/4/2023"
  }
};

const AudienceList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const workshopId = queryParams.get("workshopId");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [audiences, setAudiences] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [workshop, setWorkshop] = useState(null);

  // Lấy dữ liệu dựa trên workshopId
  useEffect(() => {
    setLoading(true);
    
    console.log("Workshop ID từ URL:", workshopId);
    
    // Tìm thông tin workshop
    const info = workshopInfo[workshopId];
    setWorkshop(info);
    
    // Lọc danh sách người tham dự theo workshopId
    // Nếu workshopId là null, lấy tất cả người tham dự có workshopId là NULL
    // Nếu có workshopId, lấy người tham dự có workshopId tương ứng
    const filteredAudiences = workshopId 
      ? audienceData.filter(a => a.workshopId === workshopId)
      : audienceData.filter(a => a.workshopId === "NULL");
    
    setAudiences(filteredAudiences);
    
    if (info) {
      message.success(`Đã tải danh sách người tham dự cho workshop: ${info.name}`);
    } else {
      message.info("Đã tải danh sách người tham dự");
    }
    
    setLoading(false);
  }, [workshopId]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    console.log('Searching for:', searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Xử lý điểm danh người tham dự
  const handleCheckIn = async (audience) => {
    if (!audience.attendId) {
      message.error("Thiếu thông tin cần thiết để điểm danh");
      return;
    }

    setCheckingIn(true);
    
    try {
      // Gọi API điểm danh
      const result = await checkInAudience(workshopId, audience.attendId);
      
      if (result.success) {
        message.success(`Điểm danh thành công cho ${audience.attendName}`);
        // Cập nhật trạng thái người tham dự trong danh sách
        setAudiences(prevAudiences => 
          prevAudiences.map(item => 
            item.id === audience.id 
              ? { ...item, status: "Confirmed" } 
              : item
          )
        );
      } else {
        message.error(result.message || "Không thể điểm danh");
      }
    } catch (err) {
      console.error("Lỗi khi điểm danh:", err);
      
      // Nếu API gặp lỗi, vẫn cập nhật UI để demo
      message.warning("API điểm danh gặp lỗi, nhưng đã cập nhật UI để demo");
      setAudiences(prevAudiences => 
        prevAudiences.map(item => 
          item.id === audience.id 
            ? { ...item, status: "Confirmed" } 
            : item
        )
      );
    } finally {
      setCheckingIn(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "success";
      case "Pending":
        return "warning";
      case "Absent":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Confirmed":
        return "Đã điểm danh";
      case "Pending":
        return "Chờ xác nhận";
      case "Absent":
        return "Vắng mặt";
      default:
        return status;
    }
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredAudiences = audiences.filter(audience => {
    return (
      (audience.attendName && audience.attendName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (audience.phoneNumber && audience.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (audience.customerId && audience.customerId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (audience.attendId && audience.attendId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Phân trang
  const pageSize = 10;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAudiences = filteredAudiences.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredAudiences.length / pageSize);

  const columns = [
    {
      title: "Mã điểm danh",
      dataIndex: "attendId",
      key: "attendId",
      width: "15%",
    },
    {
      title: "Mã khách hàng",
      dataIndex: "customerId",
      key: "customerId",
      width: "15%",
    },
    {
      title: "Tên người tham dự",
      dataIndex: "attendName",
      key: "attendName",
      width: "15%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "15%",
    },
    
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
      render: (_, record) => (
        record.status !== "Confirmed" ? (
          <Popconfirm
            title="Điểm danh người tham dự"
            description={`Bạn có chắc muốn điểm danh cho ${record.attendName}?`}
            onConfirm={() => handleCheckIn(record)}
            okText="Có"
            cancelText="Không"
            icon={<QuestionCircleOutlined style={{ color: 'green' }} />}
          >
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              size="small"
              loading={checkingIn}
            >
              Điểm danh
            </Button>
          </Popconfirm>
        ) : (
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />} 
            size="small" 
            disabled
          >
            Đã điểm danh
          </Button>
        )
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
        {workshop && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <Title level={4}>{workshop.name}</Title>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500">Người hướng dẫn</p>
                <p className="font-medium">{workshop.master}</p>
              </div>
              <div>
                <p className="text-gray-500">Địa điểm</p>
                <p className="font-medium">{workshop.location}</p>
              </div>
              <div>
                <p className="text-gray-500">Ngày</p>
                <p className="font-medium">{workshop.date}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex justify-end">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && <Error message={error} />}

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : (
          <>
            <CustomTable 
              columns={columns}
              dataSource={paginatedAudiences}
              loading={loading}
            />

            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AudienceList;
