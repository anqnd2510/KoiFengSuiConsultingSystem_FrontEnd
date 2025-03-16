import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tag, message, Spin, Button, Popconfirm } from "antd";
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import CustomTable from "../components/Common/CustomTable";
import Error from "../components/Common/Error";
import { getAudiencesByWorkshopId, formatAudiencesData, checkInAudience } from "../services/audience.service";

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

  // Fetch danh sách người tham dự từ API
  const fetchAudiences = async () => {
    if (!workshopId) {
      setError("Không tìm thấy ID workshop");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await getAudiencesByWorkshopId(workshopId);
      console.log("Dữ liệu người tham dự gốc:", data);
      
      if (!data || data.length === 0) {
        message.info("Không có dữ liệu người tham dự");
        setAudiences([]);
      } else {
        const formattedData = formatAudiencesData(data);
        console.log("Dữ liệu người tham dự đã định dạng:", formattedData);
        setAudiences(formattedData);
        message.success(`Đã tải ${formattedData.length} người tham dự`);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu người tham dự:", err);
      setError(`Không thể tải dữ liệu người tham dự: ${err.message}`);
      message.error("Không thể tải dữ liệu người tham dự");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được mount hoặc workshopId thay đổi
  useEffect(() => {
    fetchAudiences();
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
      message.error(err.message || "Đã xảy ra lỗi khi điểm danh");
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
