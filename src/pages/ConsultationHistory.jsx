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
import { User, Trash2, Calendar, Clock, FileText, Check } from "lucide-react";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Component form cho chi tiết lịch sử tư vấn
const ConsultationDetailForm = ({ form, initialData, loading }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
      initialValues={initialData}
    >
      <Row gutter={16}>
        <Col span={24} md={12}>
          <Form.Item
            label="Khách hàng"
            name="customerName"
            rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
          >
            <Input placeholder="Nhập tên khách hàng" disabled />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Bậc thầy tư vấn"
            name="masterName"
            rules={[{ required: true, message: "Vui lòng nhập tên bậc thầy" }]}
          >
            <Input placeholder="Nhập tên bậc thầy" disabled />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} md={12}>
          <Form.Item
            label="Ngày tư vấn"
            name="consultationDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày tư vấn" }]}
          >
            <DatePicker style={{ width: '100%' }} disabled />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Loại tư vấn"
            name="consultationType"
            rules={[{ required: true, message: "Vui lòng chọn loại tư vấn" }]}
          >
            <Select placeholder="Chọn loại tư vấn" disabled>
              <Option value="Online">Tư vấn online</Option>
              <Option value="Offline">Tư vấn trực tiếp</Option>
              <Option value="Phone">Tư vấn qua điện thoại</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} md={12}>
          <Form.Item
            label="Thời lượng (phút)"
            name="duration"
            rules={[{ required: true, message: "Vui lòng nhập thời lượng" }]}
          >
            <Input placeholder="Nhập thời lượng" disabled />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select placeholder="Chọn trạng thái" disabled>
              <Option value="Completed">Đã hoàn thành</Option>
              <Option value="Cancelled">Đã hủy</Option>
              <Option value="Postponed">Đã hoãn lại</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} md={12}>
          <Form.Item
            label="Dự án liên quan"
            name="relatedProject"
          >
            <Input placeholder="Nhập dự án liên quan" disabled />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Đánh giá từ khách hàng"
            name="rating"
          >
            <Rate disabled />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Chủ đề tư vấn"
        name="consultationTopics"
        rules={[{ required: true, message: "Vui lòng chọn chủ đề tư vấn" }]}
      >
        <Select mode="multiple" placeholder="Chọn chủ đề tư vấn" disabled>
          <Option value="Phong thủy hồ Koi">Phong thủy hồ Koi</Option>
          <Option value="Thiết kế hồ">Thiết kế hồ</Option>
          <Option value="Lựa chọn cá Koi">Lựa chọn cá Koi</Option>
          <Option value="Phong thủy nhà ở">Phong thủy nhà ở</Option>
          <Option value="Phong thủy văn phòng">Phong thủy văn phòng</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Ghi chú tư vấn"
        name="consultationNotes"
        rules={[{ required: true, message: "Vui lòng nhập ghi chú tư vấn" }]}
      >
        <TextArea
          placeholder="Nhập ghi chú về buổi tư vấn"
          autoSize={{ minRows: 3, maxRows: 6 }}
          disabled
        />
      </Form.Item>

      <Form.Item
        label="Kết quả/Giải pháp đề xuất"
        name="recommendations"
        rules={[{ required: true, message: "Vui lòng nhập kết quả tư vấn" }]}
      >
        <TextArea
          placeholder="Nhập kết quả và giải pháp đề xuất"
          autoSize={{ minRows: 3, maxRows: 6 }}
          disabled
        />
      </Form.Item>
    </Form>
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
          <Button 
            type="primary" 
            size="small"
            icon={<FileText className="w-4 h-4" />}
            onClick={() => handleOpenDetailModal(record)}
          >
            Chi tiết
          </Button>
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
            <Button type="primary" onClick={handleExportReport} icon={<FileText className="w-4 h-4" />}>
              Xuất báo cáo
            </Button>
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

      {/* Modal for Viewing Details */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Chi tiết buổi tư vấn
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Đóng
          </Button>
        ]}
        width={700}
        className="consultation-modal"
      >
        <div className="p-4">
          <ConsultationDetailForm
            form={form}
            initialData={selectedConsultation}
            loading={loading}
          />
        </div>
      </Modal>

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