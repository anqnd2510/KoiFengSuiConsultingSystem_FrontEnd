import React, { useState } from "react";
import { 
  Space, 
  Table, 
  Button, 
  Typography, 
  Tag, 
  Popconfirm, 
  message, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Divider, 
  Row, 
  Col,
  Rate
} from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import { User, Trash2, Calendar, Clock, FileText, Check } from "lucide-react";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Component modal xem chi tiết tư vấn
const ConsultationDetail = ({ consultation, visible, onClose }) => {
  return (
    <Modal
      title={
        <div className="text-xl font-semibold">
          Chi tiết buổi tư vấn
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      className="consultation-modal"
    >
      <div className="p-4">
        <div className="space-y-4">
          <Row gutter={16}>
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Khách hàng</p>
                <div className="flex items-center gap-2">
                  <User className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-medium">{consultation?.customerName}</p>
                    <p className="text-sm text-gray-500">{consultation?.customerEmail}</p>
                  </div>
                </div>
              </div>
            </Col>
            
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Bậc thầy tư vấn</p>
                <p className="font-medium">{consultation?.masterName}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Ngày tư vấn</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{consultation?.consultationDate}</p>
                </div>
              </div>
            </Col>
            
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Thời lượng</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{consultation?.duration} phút</p>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Loại tư vấn</p>
                <Tag color={
                  consultation?.consultationType === "Online" ? "green" :
                  consultation?.consultationType === "Offline" ? "gold" : "purple"
                }>
                  {consultation?.consultationType}
                </Tag>
              </div>
            </Col>
            
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Trạng thái</p>
                <Tag color={
                  consultation?.status === "Completed" ? "success" :
                  consultation?.status === "Cancelled" ? "error" : "warning"
                }>
                  {consultation?.status === "Completed" ? "Hoàn thành" :
                   consultation?.status === "Cancelled" ? "Đã hủy" : "Hoãn lại"}
                </Tag>
              </div>
            </Col>
          </Row>

          <div>
            <p className="text-gray-500 mb-1">Chủ đề tư vấn</p>
            <div className="flex flex-wrap gap-2">
              {consultation?.consultationTopics.map(topic => (
                <Tag color="blue" key={topic}>
                  {topic}
                </Tag>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Đánh giá</p>
            <Rate disabled defaultValue={consultation?.rating} />
          </div>

          <Divider />
          
          <div>
            <p className="text-gray-500 mb-1">Ghi chú tư vấn</p>
            <p className="font-medium mt-1">{consultation?.consultationNotes}</p>
          </div>
          
          <div>
            <p className="text-gray-500 mb-1">Kết quả/Giải pháp đề xuất</p>
            <p className="font-medium mt-1">{consultation?.recommendations}</p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={onClose}>
              Đóng
            </CustomButton>
            <CustomButton 
              type="primary" 
              className="bg-blue-500" 
              icon={<FileText size={16} />}
            >
              Xuất báo cáo
            </CustomButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const ConsultationHistory = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [error, setError] = useState("Đã xảy ra lỗi");
  
  // States cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock data cho lịch sử tư vấn
  const initialData = [
    {
      id: 1,
      customerName: "Nguyễn Văn An",
      customerEmail: "nguyenvanan@example.com",
      masterName: "Trần Phong Thủy",
      consultationDate: "2023-06-15",
      consultationType: "Online",
      duration: 60,
      status: "Completed",
      consultationTopics: ["Phong thủy hồ Koi", "Thiết kế hồ"],
      relatedProject: "Dự án biệt thự Vinhomes",
      rating: 5,
      consultationNotes: "Khách hàng muốn tư vấn về thiết kế hồ Koi cho biệt thự mới xây.",
      recommendations: "Đề xuất xây dựng hồ Koi kích thước 4x6m tại khu vực sân sau, hướng Đông Nam để đón khí vượng."
    },
    {
      id: 2,
      customerName: "Trần Thị Bình",
      customerEmail: "tranthib@example.com",
      masterName: "Nguyễn Văn Phong",
      consultationDate: "2023-06-20",
      consultationType: "Offline",
      duration: 90,
      status: "Completed",
      consultationTopics: ["Lựa chọn cá Koi", "Phong thủy nhà ở"],
      relatedProject: "",
      rating: 4,
      consultationNotes: "Khách hàng cần tư vấn về loại cá Koi phù hợp với mệnh Thổ.",
      recommendations: "Đề xuất lựa chọn cá Koi màu vàng (Yamabuki) và màu cam (Kohaku) để tăng vận khí tài lộc."
    },
    {
      id: 3,
      customerName: "Lê Văn Cường",
      customerEmail: "levanc@example.com",
      masterName: "Trần Phong Thủy",
      consultationDate: "2023-07-05",
      consultationType: "Phone",
      duration: 45,
      status: "Cancelled",
      consultationTopics: ["Phong thủy văn phòng"],
      relatedProject: "Văn phòng công ty ABC",
      rating: 0,
      consultationNotes: "Khách hàng muốn tư vấn bố trí hồ cá trong văn phòng công ty.",
      recommendations: ""
    },
    {
      id: 4,
      customerName: "Phạm Thanh Đào",
      customerEmail: "phamthanhd@example.com",
      masterName: "Lê Thủy Sinh",
      consultationDate: "2023-07-15",
      consultationType: "Online",
      duration: 60,
      status: "Postponed",
      consultationTopics: ["Thiết kế hồ", "Lựa chọn cá Koi"],
      relatedProject: "",
      rating: 0,
      consultationNotes: "Khách hàng cần tư vấn thiết kế hồ cho khu vườn nhỏ.",
      recommendations: ""
    },
    {
      id: 5,
      customerName: "Hoàng Minh Tuấn",
      customerEmail: "hoangmt@example.com",
      masterName: "Nguyễn Văn Phong",
      consultationDate: "2023-08-10",
      consultationType: "Offline",
      duration: 120,
      status: "Completed",
      consultationTopics: ["Phong thủy hồ Koi", "Phong thủy nhà ở"],
      relatedProject: "Nhà phố Hà Đông",
      rating: 5,
      consultationNotes: "Khách hàng muốn tư vấn tổng thể về phong thủy cho nhà mới và vị trí đặt hồ Koi.",
      recommendations: "Đề xuất bố trí hồ Koi ở khu vực sân trước, kích thước 3x2m, hướng Bắc để cân bằng năng lượng cho ngôi nhà."
    },
  ];

  const [data, setData] = useState(initialData);

  // Hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm mở modal để xem chi tiết
  const handleOpenDetailModal = (consultation) => {
    setSelectedConsultation(consultation);
    form.setFieldsValue({
      customerName: consultation.customerName,
      masterName: consultation.masterName,
      consultationDate: consultation.consultationDate,
      consultationType: consultation.consultationType,
      duration: consultation.duration,
      status: consultation.status,
      consultationTopics: consultation.consultationTopics,
      relatedProject: consultation.relatedProject,
      rating: consultation.rating,
      consultationNotes: consultation.consultationNotes,
      recommendations: consultation.recommendations,
    });
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConsultation(null);
    form.resetFields();
  };

  // Xuất báo cáo
  const handleExportReport = () => {
    message.success("Đã xuất báo cáo lịch sử tư vấn thành công");
  };

  // Cấu hình các cột cho bảng
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: "15%",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-gray-400" />
          <div>
            <div className="font-medium">{record.customerName}</div>
            <div className="text-xs text-gray-500">{record.customerEmail}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Bậc thầy",
      dataIndex: "masterName",
      key: "masterName",
      width: "12%",
    },
    {
      title: "Ngày & Thời gian",
      key: "consultationDate",
      width: "15%",
      render: (_, record) => (
        <div>
          <div>
            <Calendar className="inline-block mr-1 w-4 h-4" /> 
            {record.consultationDate}
          </div>
          <div className="mt-1">
            <Clock className="inline-block mr-1 w-4 h-4" /> 
            {record.duration} phút
          </div>
        </div>
      ),
    },
    {
      title: "Loại tư vấn",
      key: "consultationType",
      dataIndex: "consultationType",
      width: "10%",
      render: (type) => {
        let color = "blue";
        if (type === "Online") color = "green";
        if (type === "Offline") color = "gold";
        if (type === "Phone") color = "purple";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Chủ đề tư vấn",
      key: "consultationTopics",
      dataIndex: "consultationTopics",
      width: "15%",
      render: (topics) => (
        <>
          {topics.map(tag => (
            <Tag color="blue" key={tag} className="mb-1 mr-1">
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      width: "10%",
      render: (status) => {
        let color = "green";
        let icon = <Check className="inline-block mr-1 w-4 h-4" />;
        
        if (status === "Cancelled") {
          color = "red";
          icon = <Trash2 className="inline-block mr-1 w-4 h-4" />;
        } else if (status === "Postponed") {
          color = "orange";
          icon = <Clock className="inline-block mr-1 w-4 h-4" />;
        }
        
        return (
          <Tag color={color} icon={icon}>
            {status === "Completed" ? "Hoàn thành" : 
              status === "Cancelled" ? "Đã hủy" : "Hoãn lại"}
          </Tag>
        );
      },
    },
    {
      title: "Đánh giá",
      key: "rating",
      dataIndex: "rating",
      width: "10%",
      render: (rating) => (
        <Rate disabled defaultValue={rating} />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "13%",
      render: (_, record) => (
        <Space size="middle">
          <CustomButton 
            type="primary" 
            className="bg-blue-500"
            icon={<FileText className="w-4 h-4" />}
            onClick={() => handleOpenDetailModal(record)}
          >
            Chi tiết
          </CustomButton>
        </Space>
      ),
    },
  ];

  // Lọc dữ liệu theo tìm kiếm
  const filteredData = data.filter((item) =>
    item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.customerEmail.toLowerCase().includes(searchText.toLowerCase()) ||
    item.masterName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.status.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.consultationTopics.some(topic => topic.toLowerCase().includes(searchText.toLowerCase())))
  );

  // Phân trang dữ liệu
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Lịch sử tư vấn phong thủy Koi"
        description="Quản lý thông tin và lịch sử các buổi tư vấn phong thủy"
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex gap-2 mb-4">
            <CustomButton 
              type="primary" 
              className="bg-blue-500"
              onClick={handleExportReport} 
              icon={<FileText className="w-4 h-4" />}
            >
              Xuất báo cáo
            </CustomButton>
          </div>
          <SearchBar
            placeholder="Tìm kiếm theo tên khách hàng, bậc thầy, chủ đề..."
            onSearch={handleSearch}
            className="w-64"
          />
        </div>

        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          rowKey="id"
          bordered
        />

        <div className="mt-4 flex justify-end">
          <Pagination
            current={currentPage}
            total={filteredData.length}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal xem chi tiết tư vấn */}
      {selectedConsultation && (
        <ConsultationDetail
          consultation={selectedConsultation}
          visible={isModalOpen}
          onClose={handleCloseModal}
        />
      )}

      <style jsx global>{`
        .consultation-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .consultation-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .consultation-modal .ant-modal-body {
          padding: 12px;
        }
        .consultation-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default ConsultationHistory; 