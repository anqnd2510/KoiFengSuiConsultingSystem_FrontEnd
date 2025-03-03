import React, { useState } from "react";
import { 
  Table, 
  Button, 
  Tag, 
  Popconfirm, 
  message, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Upload, 
  Space 
} from "antd";
import { Award, Trash2, Download, Upload as UploadIcon, Search, Filter } from "lucide-react";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";

const { Option } = Select;

// Dữ liệu mẫu cho chứng chỉ
const initialCertificates = [
  {
    id: 1,
    studentName: "Nguyễn Văn A",
    courseName: "Phong thủy Koi cơ bản",
    issueDate: "2023-05-15",
    expiryDate: "2026-05-15",
    status: "Đã cấp",
    certificateId: "CERT-001-2023"
  },
  {
    id: 2,
    studentName: "Trần Thị B",
    courseName: "Phong thủy Koi nâng cao",
    issueDate: "2023-06-20",
    expiryDate: "2026-06-20",
    status: "Đã cấp",
    certificateId: "CERT-002-2023"
  },
  {
    id: 3,
    studentName: "Lê Văn C",
    courseName: "Đại Đạo Chi Giản - Phong Thủy Cổ Học",
    issueDate: "2023-07-10",
    expiryDate: "2026-07-10",
    status: "Chờ cấp",
    certificateId: "CERT-003-2023"
  },
  {
    id: 4,
    studentName: "Phạm Thị D",
    courseName: "Phong thủy Koi cơ bản",
    issueDate: "2023-08-05",
    expiryDate: "2026-08-05",
    status: "Đã cấp",
    certificateId: "CERT-004-2023"
  },
  {
    id: 5,
    studentName: "Hoàng Văn E",
    courseName: "Đại Đạo Chi Giản - Phong Thủy Cổ Học",
    issueDate: "2023-09-15",
    expiryDate: "2026-09-15",
    status: "Chờ cấp",
    certificateId: "CERT-005-2023"
  },
];

// Component modal xem chi tiết chứng chỉ
const CertificateDetail = ({ certificate, visible, onClose }) => {
  return (
    <Modal
      title="Chi tiết chứng chỉ"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button key="download" type="primary" icon={<Download size={16} />}>
          Tải chứng chỉ
        </Button>,
      ]}
      width={700}
    >
      <div className="space-y-4">
        <div>
          <p className="text-gray-500">Mã chứng chỉ</p>
          <p className="font-medium">{certificate?.certificateId}</p>
        </div>
        
        <div>
          <p className="text-gray-500">Học viên</p>
          <p className="font-medium">{certificate?.studentName}</p>
        </div>
        
        <div>
          <p className="text-gray-500">Khóa học</p>
          <p className="font-medium">{certificate?.courseName}</p>
        </div>
        
        <div>
          <p className="text-gray-500">Ngày cấp</p>
          <p className="font-medium">{certificate?.issueDate}</p>
        </div>
        
        <div>
          <p className="text-gray-500">Ngày hết hạn</p>
          <p className="font-medium">{certificate?.expiryDate}</p>
        </div>
        
        <div>
          <p className="text-gray-500">Trạng thái</p>
          <Tag color={certificate?.status === "Đã cấp" ? "success" : "warning"}>
            {certificate?.status}
          </Tag>
        </div>
        
        <div>
          <p className="text-gray-500">Xem trước chứng chỉ</p>
          <div className="mt-2 border border-gray-200 rounded-md p-4 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1606768666853-403c90a981ad?q=80&w=2071&auto=format&fit=crop" 
              alt="Certificate Preview" 
              className="max-h-64 object-contain"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Component modal tạo chứng chỉ mới
const CreateCertificateModal = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  
  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
    });
  };
  
  return (
    <Modal
      title="Cấp chứng chỉ mới"
      open={visible}
      onCancel={onClose}
      onOk={handleSubmit}
      okText="Cấp chứng chỉ"
      cancelText="Hủy bỏ"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        <Form.Item
          name="studentName"
          label="Học viên"
          rules={[{ required: true, message: "Vui lòng chọn học viên" }]}
        >
          <Select placeholder="Chọn học viên">
            <Option value="Nguyễn Văn A">Nguyễn Văn A</Option>
            <Option value="Trần Thị B">Trần Thị B</Option>
            <Option value="Lê Văn C">Lê Văn C</Option>
            <Option value="Phạm Thị D">Phạm Thị D</Option>
            <Option value="Hoàng Văn E">Hoàng Văn E</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="courseName"
          label="Khóa học"
          rules={[{ required: true, message: "Vui lòng chọn khóa học" }]}
        >
          <Select placeholder="Chọn khóa học">
            <Option value="Phong thủy Koi cơ bản">Phong thủy Koi cơ bản</Option>
            <Option value="Phong thủy Koi nâng cao">Phong thủy Koi nâng cao</Option>
            <Option value="Đại Đạo Chi Giản - Phong Thủy Cổ Học">Đại Đạo Chi Giản - Phong Thủy Cổ Học</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="certificateId"
          label="Mã chứng chỉ"
          rules={[{ required: true, message: "Vui lòng nhập mã chứng chỉ" }]}
        >
          <Input placeholder="Ví dụ: CERT-006-2023" />
        </Form.Item>
        
        <Form.Item
          name="issueDate"
          label="Ngày cấp"
          rules={[{ required: true, message: "Vui lòng chọn ngày cấp" }]}
        >
          <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày cấp" className="w-full" />
        </Form.Item>
        
        <Form.Item
          name="expiryDate"
          label="Ngày hết hạn"
          rules={[{ required: true, message: "Vui lòng chọn ngày hết hạn" }]}
        >
          <DatePicker format="YYYY-MM-DD" placeholder="Chọn ngày hết hạn" className="w-full" />
        </Form.Item>
        
        <Form.Item
          name="certificateTemplate"
          label="Mẫu chứng chỉ"
          rules={[{ required: true, message: "Vui lòng chọn mẫu chứng chỉ" }]}
        >
          <Select placeholder="Chọn mẫu chứng chỉ">
            <Option value="template1">Mẫu chuẩn</Option>
            <Option value="template2">Mẫu cao cấp</Option>
            <Option value="template3">Mẫu đặc biệt</Option>
          </Select>
        </Form.Item>
        
        <Form.Item
          name="certificateFile"
          label="Tải lên file chứng chỉ (tùy chọn)"
        >
          <Upload maxCount={1} listType="picture">
            <Button icon={<UploadIcon size={16} />}>Chọn file</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Certificate = () => {
  const [certificates, setCertificates] = useState(initialCertificates);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(initialCertificates.length);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Hàm tìm kiếm
  const handleSearch = (value) => {
    setSearchTerm(value);
    // Trong thực tế, đây sẽ là API call để tìm kiếm
    console.log("Tìm kiếm với từ khóa:", value);
  };
  
  // Hàm xóa chứng chỉ
  const handleDelete = (id) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
    message.success("Đã xóa chứng chỉ thành công");
  };
  
  // Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Trong thực tế, đây sẽ là API call để lấy dữ liệu trang mới
  };
  
  // Hàm xem chi tiết chứng chỉ
  const handleViewDetail = (certificate) => {
    setSelectedCertificate(certificate);
    setDetailModalVisible(true);
  };
  
  // Hàm đóng modal chi tiết
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
  };
  
  // Hàm mở modal tạo chứng chỉ mới
  const handleOpenCreateModal = () => {
    setCreateModalVisible(true);
  };
  
  // Hàm đóng modal tạo chứng chỉ
  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };
  
  // Hàm cấp chứng chỉ mới
  const handleCreateCertificate = (values) => {
    const newCertificate = {
      id: certificates.length + 1,
      studentName: values.studentName,
      courseName: values.courseName,
      issueDate: values.issueDate.format("YYYY-MM-DD"),
      expiryDate: values.expiryDate.format("YYYY-MM-DD"),
      status: "Đã cấp",
      certificateId: values.certificateId
    };
    
    setCertificates([...certificates, newCertificate]);
    setCreateModalVisible(false);
    message.success("Đã cấp chứng chỉ thành công");
  };
  
  // Hàm thay đổi trạng thái chứng chỉ
  const handleChangeStatus = (id, newStatus) => {
    const updatedCertificates = certificates.map(cert => {
      if (cert.id === id) {
        return { ...cert, status: newStatus };
      }
      return cert;
    });
    
    setCertificates(updatedCertificates);
    message.success(`Đã chuyển trạng thái thành ${newStatus}`);
  };
  
  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "Mã chứng chỉ",
      dataIndex: "certificateId",
      key: "certificateId",
    },
    {
      title: "Học viên",
      dataIndex: "studentName",
      key: "studentName",
    },
    {
      title: "Khóa học",
      dataIndex: "courseName",
      key: "courseName",
    },
    {
      title: "Ngày cấp",
      dataIndex: "issueDate",
      key: "issueDate",
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Đã cấp" ? "success" : "warning"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size="small" onClick={() => handleViewDetail(record)}>
            Xem chi tiết
          </Button>
          
          {record.status === "Chờ cấp" ? (
            <Button 
              type="default" 
              size="small" 
              onClick={() => handleChangeStatus(record.id, "Đã cấp")}
            >
              Cấp
            </Button>
          ) : (
            <Button 
              type="text" 
              size="small" 
              icon={<Download size={16} />}
            >
              Tải
            </Button>
          )}
          
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chứng chỉ này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý chứng chỉ"
        description="Cấp và quản lý chứng chỉ cho học viên đã hoàn thành khóa học phong thủy Koi"
      />

      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <SearchBar
              placeholder="Tìm kiếm theo tên học viên, khóa học hoặc mã chứng chỉ"
              onSearch={handleSearch}
            />
            
            <div className="flex gap-2">
              <Select 
                defaultValue="all" 
                style={{ width: 150 }}
                onChange={(value) => console.log("Lọc theo khóa học:", value)}
              >
                <Option value="all">Tất cả khóa học</Option>
                <Option value="basic">Phong thủy Koi cơ bản</Option>
                <Option value="advanced">Phong thủy Koi nâng cao</Option>
                <Option value="master">Đại Đạo Chi Giản</Option>
              </Select>
              
              <Select 
                defaultValue="all" 
                style={{ width: 150 }}
                onChange={(value) => console.log("Lọc theo trạng thái:", value)}
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="issued">Đã cấp</Option>
                <Option value="pending">Chờ cấp</Option>
              </Select>
              
              <Button 
                type="primary" 
                className="bg-[#42855B]" 
                onClick={handleOpenCreateModal}
                icon={<Award size={16} />}
              >
                Cấp chứng chỉ mới
              </Button>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={certificates}
            rowKey="id"
            pagination={false}
            loading={loading}
          />

          <div className="mt-4 flex justify-end">
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      
      {/* Modal xem chi tiết chứng chỉ */}
      {selectedCertificate && (
        <CertificateDetail
          certificate={selectedCertificate}
          visible={detailModalVisible}
          onClose={handleCloseDetailModal}
        />
      )}
      
      {/* Modal cấp chứng chỉ mới */}
      <CreateCertificateModal
        visible={createModalVisible}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateCertificate}
      />
    </div>
  );
};

export default Certificate; 