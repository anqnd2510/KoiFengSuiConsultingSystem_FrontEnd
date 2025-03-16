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

// Dữ liệu mẫu cho các workshop
const workshopData = {
  // Feng Shui for Beginners
  "357B32FE-63D8-44D3-8": [
    {
      id: "FS001",
      name: "Nguyễn Văn Minh",
      phone: "0987123456",
      email: "nguyenvanminh@gmail.com",
      date: "15/03/2023",
      status: "Chờ xác nhận",
      registerId: "R101"
    },
    {
      id: "FS002",
      name: "Trần Thị Hoa",
      phone: "0912345678",
      email: "tranthihoa@gmail.com",
      date: "16/03/2023",
      status: "Đã điểm danh",
      registerId: "R102"
    },
    {
      id: "FS003",
      name: "Lê Văn Tâm",
      phone: "0909876543",
      email: "levantam@gmail.com",
      date: "17/03/2023",
      status: "Vắng mặt",
      registerId: "R103"
    }
  ],
  // Advanced Koi Care
  "A9A5E712-15F4-448F-A": [
    {
      id: "KC001",
      name: "Phạm Thị Lan",
      phone: "0978654321",
      email: "phamthilan@gmail.com",
      date: "10/04/2023",
      status: "Chờ xác nhận",
      registerId: "R201"
    },
    {
      id: "KC002",
      name: "Hoàng Văn Đức",
      phone: "0965432109",
      email: "hoangvanduc@gmail.com",
      date: "11/04/2023",
      status: "Đã điểm danh",
      registerId: "R202"
    },
    {
      id: "KC003",
      name: "Ngô Thị Mai",
      phone: "0932109876",
      email: "ngothimai@gmail.com",
      date: "12/04/2023",
      status: "Chờ xác nhận",
      registerId: "R203"
    },
    {
      id: "KC004",
      name: "Vũ Văn Hùng",
      phone: "0945678901",
      email: "vuvanhung@gmail.com",
      date: "13/04/2023",
      status: "Vắng mặt",
      registerId: "R204"
    }
  ]
};

// Dữ liệu mẫu mặc định
const defaultAudiences = [
  {
    id: "T01",
    name: "Nguyễn Văn A",
    phone: "0987654321",
    email: "nguyenvana@gmail.com",
    date: "01/05/2023",
    status: "Chờ xác nhận",
    registerId: "R001"
  },
  {
    id: "T02",
    name: "Trần Thị B",
    phone: "0912345678",
    email: "tranthib@gmail.com",
    date: "02/05/2023",
    status: "Đã điểm danh",
    registerId: "R002"
  },
  {
    id: "T03",
    name: "Lê Văn C",
    phone: "0909123456",
    email: "levanc@gmail.com",
    date: "03/05/2023",
    status: "Vắng mặt",
    registerId: "R003"
  },
  {
    id: "T04",
    name: "Phạm Thị D",
    phone: "0978123456",
    email: "phamthid@gmail.com",
    date: "04/05/2023",
    status: "Chờ xác nhận",
    registerId: "R004"
  }
];

// Thông tin workshop
const workshopInfo = {
  "357B32FE-63D8-44D3-8": {
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

  // Lấy dữ liệu mẫu dựa trên workshopId
  useEffect(() => {
    setLoading(true);
    
    // Tìm thông tin workshop
    const info = workshopInfo[workshopId];
    setWorkshop(info);
    
    // Lấy danh sách người tham dự theo workshopId
    const audienceList = workshopData[workshopId] || defaultAudiences;
    setAudiences(audienceList);
    
    if (info) {
      message.success(`Đã tải danh sách người tham dự cho workshop: ${info.name}`);
    } else {
      message.info("Hiển thị dữ liệu mẫu cho người tham dự");
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
    if (!workshopId || !audience.registerId) {
      message.error("Thiếu thông tin cần thiết để điểm danh");
      return;
    }

    setCheckingIn(true);
    
    try {
      // Gọi API điểm danh
      const result = await checkInAudience(workshopId, audience.registerId);
      
      if (result.success) {
        message.success(`Điểm danh thành công cho ${audience.name}`);
        // Cập nhật trạng thái người tham dự trong danh sách
        setAudiences(prevAudiences => 
          prevAudiences.map(item => 
            item.id === audience.id 
              ? { ...item, status: "Đã điểm danh" } 
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
            ? { ...item, status: "Đã điểm danh" } 
            : item
        )
      );
    } finally {
      setCheckingIn(false);
    }
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

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredAudiences = audiences.filter(audience => {
    return (
      (audience.name && audience.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (audience.phone && audience.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (audience.email && audience.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (audience.id && audience.id.toLowerCase().includes(searchTerm.toLowerCase()))
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
      width: "15%",
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
      width: "15%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
      render: (_, record) => (
        record.status !== "Đã điểm danh" ? (
          <Popconfirm
            title="Điểm danh người tham dự"
            description={`Bạn có chắc muốn điểm danh cho ${record.name}?`}
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
        {workshop ? (
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
        ) : (
          <Alert
            message="Không tìm thấy thông tin workshop"
            description="Không thể tìm thấy thông tin workshop với ID đã cung cấp. Hiển thị dữ liệu mẫu."
            type="warning"
            showIcon
            className="mb-4"
          />
        )}

        <Alert
          message="Đang sử dụng dữ liệu mẫu"
          description="Hiển thị dữ liệu mẫu cho mục đích demo. Chức năng điểm danh sẽ gọi API thực tế."
          type="info"
          showIcon
          className="mb-4"
        />

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
