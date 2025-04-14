import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Tag,
  message,
  Spin,
  Button,
  Popconfirm,
  Alert,
  Typography,
} from "antd";
import { CheckCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import CustomTable from "../../components/Common/CustomTable";
import Error from "../../components/Common/Error";
import Header from "../../components/Common/Header";
import BackButton from "../../components/Common/BackButton";
import { checkInAudience, getAudiencesByWorkshopId } from "../../services/audience.service";
import { getWorkshopById } from "../../services/workshopstaff.service";

const { Title } = Typography;

// Thông tin workshop mặc định (sẽ được thay thế bằng dữ liệu từ API)
const defaultWorkshopInfo = {
  name: "Workshop",
  master: "Không xác định",
  location: "Không xác định",
  date: "Không xác định",
  startTime: "Chưa có thông tin",
  endTime: "Chưa có thông tin"
};

const AudienceList = () => {
  const { workshopId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [audiences, setAudiences] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [workshop, setWorkshop] = useState(defaultWorkshopInfo);

  // Lấy thông tin workshop
  useEffect(() => {
    const fetchWorkshopInfo = async () => {
      try {
        const workshopData = await getWorkshopById(workshopId);
        if (workshopData) {
          // Xử lý thời gian
          let startTime = "Chưa có thông tin";
          let endTime = "Chưa có thông tin";

          // Thử các trường khác nhau có thể chứa thông tin thời gian
          if (workshopData.timeStart) startTime = workshopData.timeStart;
          else if (workshopData.startTime) startTime = workshopData.startTime;
          else if (workshopData.start_time) startTime = workshopData.start_time;
          else if (workshopData.time_start) startTime = workshopData.time_start;

          if (workshopData.timeEnd) endTime = workshopData.timeEnd;
          else if (workshopData.endTime) endTime = workshopData.endTime;
          else if (workshopData.end_time) endTime = workshopData.end_time;
          else if (workshopData.time_end) endTime = workshopData.time_end;

          // Format thời gian nếu có
          if (startTime !== "Chưa có thông tin" && startTime.length > 5) {
            startTime = startTime.substring(0, 5);
          }
          if (endTime !== "Chưa có thông tin" && endTime.length > 5) {
            endTime = endTime.substring(0, 5);
          }

          setWorkshop({
            name: workshopData.workshopName || "Workshop",
            master: workshopData.masterName || "Không xác định",
            location: workshopData.location || "Không xác định",
            date: workshopData.startDate ? new Date(workshopData.startDate).toLocaleDateString('vi-VN') : "Không xác định",
            startTime: startTime,
            endTime: endTime
          });
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin workshop:", err);
      }
    };

    if (workshopId) {
      fetchWorkshopInfo();
    }
  }, [workshopId]);

  // Lấy dữ liệu người tham dự
  useEffect(() => {
    const fetchAudiences = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Đang lấy danh sách người tham dự cho workshop ID:", workshopId);
        
        const result = await getAudiencesByWorkshopId(workshopId);
        
        if (result.success) {
          console.log("Lấy danh sách người tham dự thành công:", result.data);
          
          const formattedAudiences = result.data.map((audience, index) => ({
            id: index + 1,
            attendId: audience.attendId,
            workshopId: workshopId,
            attendName: audience.workshopName || "Người tham dự",
            phoneNumber: audience.phoneNumber || "Không có",
            customerId: audience.customerName || "Không có",
            status: audience.status || "Pending",
          }));
          
          setAudiences(formattedAudiences);
        } else {
          setAudiences([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu người tham dự:", err);
        setAudiences([]);
      } finally {
        setLoading(false);
      }
    };

    if (workshopId) {
      fetchAudiences();
    } else {
      setLoading(false);
    }
  }, [workshopId]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
    console.log("Searching for:", searchTerm);
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
        setAudiences((prevAudiences) =>
          prevAudiences.map((item) =>
            item.id === audience.id ? { ...item, status: "Confirmed" } : item
          )
        );
      } else {
        message.error(result.message || "Không thể điểm danh");
      }
    } catch (err) {
      console.error("Lỗi khi điểm danh:", err);
      message.error("Lỗi khi điểm danh: " + (err.message || "Không xác định"));
    } finally {
      setCheckingIn(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
      case "CheckedIn":
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
      case "CheckedIn":
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
  const filteredAudiences = audiences.filter((audience) => {
    return (
      (audience.attendName &&
        audience.attendName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (audience.phoneNumber &&
        audience.phoneNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (audience.customerId &&
        audience.customerId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (audience.attendId &&
        audience.attendId.toLowerCase().includes(searchTerm.toLowerCase()))
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
      title: "Tên người tham dự",
      dataIndex: "attendName",
      key: "attendName",
      width: "20%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "15%",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerId",
      key: "customerId",
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
      render: (_, record) =>
        record.status !== "Confirmed" && record.status !== "CheckedIn" ? (
          <Popconfirm
            title="Điểm danh người tham dự"
            description={`Bạn có chắc muốn điểm danh cho ${record.attendName}?`}
            onConfirm={() => handleCheckIn(record)}
            okText="Có"
            cancelText="Không"
            icon={<QuestionCircleOutlined style={{ color: "green" }} />}
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
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        title="Người tham dự"
        description="Báo cáo và tất cả khán giả đã tham gia trong hội thảo"
      />

      {/* Main Content */}
      <div className="p-6">
        {workshop && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <BackButton to="/staff/workshop-staff" />
              <Title level={4}>{workshop.name}</Title>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-500">Diễn giả</p>
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
              <div>
                <p className="text-gray-500">Thời gian</p>
                <div className="font-medium">
                  <p>Bắt đầu: {workshop.startTime}</p>
                  <p>Kết thúc: {workshop.endTime}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">Danh sách người tham dự</h2>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : (
          <>
            {audiences.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Không tìm thấy người tham dự cho workshop này</p>
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
          </>
        )}
      </div>
    </div>
  );
};

export default AudienceList;
