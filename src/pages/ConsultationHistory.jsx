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
  Col
} from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import { User, Trash2, Calendar, FileText, Check, Clock, Filter, Phone, DollarSign, Video } from "lucide-react";

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
                <p className="text-gray-500 mb-1">Số điện thoại</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{consultation?.customerPhone}</p>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Bậc thầy tư vấn</p>
                <p className="font-medium">{consultation?.masterName}</p>
              </div>
            </Col>
            
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Giá tiền</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{consultation?.price?.toLocaleString('vi-VN')} VNĐ</p>
                </div>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Ngày & giờ tư vấn</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{consultation?.consultationDate}</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">{consultation?.consultationTime}</p>
                </div>
              </div>
            </Col>
            
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Loại tư vấn</p>
                <Tag color={
                  consultation?.consultationType === "Online" ? "green" :
                  consultation?.consultationType === "Offline" ? "gold" : "blue"
                }>
                  {consultation?.consultationType}
                </Tag>
              </div>
            </Col>
          </Row>

          {consultation?.consultationType === "Online" && (
            <Row gutter={16}>
              <Col span={24}>
                <div>
                  <p className="text-gray-500 mb-1">Link Meet</p>
                  <a 
                    href={consultation?.meetLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    {consultation?.meetLink}
                  </a>
                </div>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col span={24}>
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
              {consultation?.consultationTopics?.map(topic => (
                <Tag color="blue" key={topic}>
                  {topic}
                </Tag>
              ))}
            </div>
          </div>

          <Divider />
          
          <div>
            <p className="text-gray-500 mb-1">Ghi chú tư vấn</p>
            <p className="font-medium mt-1">{consultation?.consultationNotes}</p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={onClose}>
              Đóng
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
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
      customerPhone: "0901234567",
      masterName: "Trần Phong Thủy",
      consultationDate: "2023-06-15",
      consultationTime: "09:00 - 10:00",
      consultationType: "Online",
      status: "Completed",
      consultationTopics: ["Phong thủy hồ Koi", "Thiết kế hồ"],
      relatedProject: "Dự án biệt thự Vinhomes",
      consultationNotes: "Khách hàng muốn tư vấn về thiết kế hồ Koi cho biệt thự mới xây.",
      price: 1500000,
      meetLink: "https://meet.google.com/abc-defg-hij"
    },
    {
      id: 2,
      customerName: "Trần Thị Bình",
      customerEmail: "tranthib@example.com",
      customerPhone: "0912345678",
      masterName: "Nguyễn Văn Phong",
      consultationDate: "2023-06-20",
      consultationTime: "14:00 - 15:30",
      consultationType: "Offline",
      status: "Completed",
      consultationTopics: ["Lựa chọn cá Koi", "Phong thủy nhà ở"],
      relatedProject: "",
      consultationNotes: "Khách hàng cần tư vấn về loại cá Koi phù hợp với mệnh Thổ.",
      price: 2000000
    },
    {
      id: 3,
      customerName: "Lê Văn Cường",
      customerEmail: "levanc@example.com",
      customerPhone: "0923456789",
      masterName: "Trần Phong Thủy",
      consultationDate: "2023-07-05",
      consultationTime: "10:30 - 11:30",
      consultationType: "Online",
      status: "Cancelled",
      consultationTopics: ["Phong thủy văn phòng"],
      relatedProject: "Văn phòng công ty ABC",
      consultationNotes: "Khách hàng muốn tư vấn bố trí hồ cá trong văn phòng công ty.",
      price: 1500000,
      meetLink: "https://meet.google.com/xyz-abcd-efg"
    },
    {
      id: 4,
      customerName: "Phạm Thanh Đào",
      customerEmail: "phamthanhd@example.com",
      customerPhone: "0934567890",
      masterName: "Lê Thủy Sinh",
      consultationDate: "2023-07-15",
      consultationTime: "15:00 - 16:00",
      consultationType: "Online",
      status: "Postponed",
      consultationTopics: ["Thiết kế hồ", "Lựa chọn cá Koi"],
      relatedProject: "",
      consultationNotes: "Khách hàng cần tư vấn thiết kế hồ cho khu vườn nhỏ.",
      price: 1200000,
      meetLink: "https://meet.google.com/mno-pqrs-tuv"
    },
    {
      id: 5,
      customerName: "Hoàng Minh Tuấn",
      customerEmail: "hoangmt@example.com",
      customerPhone: "0945678901",
      masterName: "Nguyễn Văn Phong",
      consultationDate: "2023-08-10",
      consultationTime: "09:30 - 11:00",
      consultationType: "Offline",
      status: "Completed",
      consultationTopics: ["Phong thủy hồ Koi", "Phong thủy nhà ở"],
      relatedProject: "Nhà phố Hà Đông",
      consultationNotes: "Khách hàng muốn tư vấn tổng thể về phong thủy cho nhà mới và vị trí đặt hồ Koi.",
      price: 2500000
    },
  ];

  // Đảm bảo không còn loại tư vấn "Phone"
  const cleanedData = initialData.map(item => ({
    ...item,
    consultationType: item.consultationType === "Phone" ? "Online" : item.consultationType
  }));

  const [data, setData] = useState(cleanedData);

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
      customerEmail: consultation.customerEmail,
      customerPhone: consultation.customerPhone,
      masterName: consultation.masterName,
      consultationDate: consultation.consultationDate,
      consultationTime: consultation.consultationTime,
      consultationType: consultation.consultationType,
      status: consultation.status,
      consultationTopics: consultation.consultationTopics,
      relatedProject: consultation.relatedProject,
      consultationNotes: consultation.consultationNotes,
      price: consultation.price,
      meetLink: consultation.meetLink
    });
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConsultation(null);
    form.resetFields();
  };

  // Hàm xử lý filter theo trạng thái
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Hàm xử lý filter theo loại tư vấn
  const handleTypeFilterChange = (value) => {
    setTypeFilter(value);
    setCurrentPage(1);
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
      title: "Ngày tư vấn",
      key: "consultationDate",
      dataIndex: "consultationDate",
      width: "15%",
      render: (date) => (
        <div>
          <Calendar className="inline-block mr-1 w-4 h-4" /> 
          {date}
        </div>
      ),
    },
    {
      title: "Loại tư vấn",
      key: "consultationType",
      dataIndex: "consultationType",
      width: "10%",
      render: (type) => {
        // Đảm bảo loại tư vấn chỉ là Online hoặc Offline
        const validType = type === "Phone" ? "Online" : type;
        const color = validType === "Online" ? "green" : "gold";
        return <Tag color={color}>{validType}</Tag>;
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

  // Lọc dữ liệu theo tìm kiếm và bộ lọc
  const filteredData = data.filter((item) => {
    // Lọc theo từ khóa tìm kiếm
    const matchesSearchTerm = 
      item.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.customerEmail.toLowerCase().includes(searchText.toLowerCase()) ||
      item.masterName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.status.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.consultationTopics.some(topic => topic.toLowerCase().includes(searchText.toLowerCase())));
    
    // Lọc theo trạng thái
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    // Lọc theo loại tư vấn
    const matchesType = typeFilter === "all" || item.consultationType === typeFilter;
    
    return matchesSearchTerm && matchesStatus && matchesType;
  });

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
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <SearchBar
              placeholder="Tìm kiếm theo tên khách hàng, bậc thầy, chủ đề..."
              onSearch={handleSearch}
              className="w-64 mb-2 md:mb-0"
            />
            
            <div className="flex flex-wrap gap-2">
              <Select 
                defaultValue="all" 
                style={{ width: 150 }}
                onChange={handleStatusFilterChange}
                placeholder="Trạng thái"
                suffixIcon={<Filter size={16} />}
                className="mb-2 md:mb-0"
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="Completed">Hoàn thành</Option>
                <Option value="Cancelled">Đã hủy</Option>
                <Option value="Postponed">Hoãn lại</Option>
              </Select>
              
              <Select 
                defaultValue="all" 
                style={{ width: 150 }}
                onChange={handleTypeFilterChange}
                placeholder="Loại tư vấn"
                suffixIcon={<Filter size={16} />}
                className="mb-2 md:mb-0"
              >
                <Option value="all">Tất cả loại</Option>
                <Option value="Online">Online</Option>
                <Option value="Offline">Offline</Option>
              </Select>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={paginatedData}
            pagination={false}
            rowKey="id"
            bordered
            loading={loading}
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