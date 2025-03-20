import React, { useState } from "react";
import { 
  Table, 
  Tag, 
  Popconfirm, 
  message, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Upload, 
  Space, 
  Row, 
  Col, 
  Divider 
} from "antd";
import { Award, Trash2, Download, Upload as UploadIcon, Search, Filter } from "lucide-react";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import FilterBar from "../components/Common/FilterBar";

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
      title={
        <div className="text-xl font-semibold">
          Chi tiết chứng chỉ
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      className="certificate-modal"
    >
      <div className="p-4">
        <div className="space-y-4">
          <Row gutter={16}>
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Mã chứng chỉ</p>
                <p className="font-medium">{certificate?.certificateId}</p>
              </div>
            </Col>
            
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Học viên</p>
                <p className="font-medium">{certificate?.studentName}</p>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Khóa học</p>
                <p className="font-medium">{certificate?.courseName}</p>
              </div>
            </Col>
            
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Trạng thái</p>
                <Tag color={certificate?.status === "Đã cấp" ? "success" : "warning"}>
                  {certificate?.status}
                </Tag>
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Ngày cấp</p>
                <p className="font-medium">{certificate?.issueDate}</p>
              </div>
            </Col>
            
            <Col span={24} md={12}>
              <div>
                <p className="text-gray-500 mb-1">Ngày hết hạn</p>
                <p className="font-medium">{certificate?.expiryDate}</p>
              </div>
            </Col>
          </Row>

          <Divider />
          
          <div>
            <p className="text-gray-500 mb-2">Xem trước chứng chỉ</p>
            <div className="border border-gray-200 rounded-md p-4 flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1606768666853-403c90a981ad?q=80&w=2071&auto=format&fit=crop" 
                alt="Certificate Preview" 
                className="max-h-64 object-contain"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={onClose}>
              Đóng
            </CustomButton>
            <CustomButton 
              type="primary" 
              className="bg-blue-500" 
              icon={<Download size={16} />}
            >
              Tải chứng chỉ
            </CustomButton>
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
            <CustomButton icon={<UploadIcon size={16} />}>Chọn file</CustomButton>
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
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Hàm tìm kiếm
  const handleSearch = (value) => {
    setSearchTerm(value);
    // Trong thực tế, đây sẽ là API call để tìm kiếm
    console.log("Tìm kiếm với từ khóa:", value);
  };
  
  // Hàm xử lý filter theo trạng thái
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    console.log("Lọc theo trạng thái:", value);
  };
  
  // Hàm xóa chứng chỉ
  const handleDelete = (id) => {
    setCertificates(certificates.filter(cert => cert.id !== id));
    message.success("Đã xóa chứng chỉ thành công");
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
          <CustomButton type="primary" size="small" onClick={() => handleViewDetail(record)}>
            Xem chi tiết
          </CustomButton>
          
          {record.status === "Chờ cấp" ? (
            <CustomButton 
              type="default" 
              size="small" 
              onClick={() => handleChangeStatus(record.id, "Đã cấp")}
            >
              Cấp
            </CustomButton>
          ) : (
            <CustomButton 
              type="text" 
              size="small" 
              icon={<Download size={16} />}
            >
              Tải
            </CustomButton>
          )}
          
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chứng chỉ này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <CustomButton type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Tùy chọn trạng thái cho bộ lọc
  const statusOptions = [
    { value: "Đã cấp", label: "Đã cấp" },
    { value: "Chờ cấp", label: "Chờ cấp" }
  ];
  
  // Lọc dữ liệu theo từ khóa tìm kiếm và trạng thái
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
              <FilterBar 
                statusOptions={statusOptions}
                onStatusChange={handleStatusFilterChange}
                defaultValue="all"
                placeholder="Trạng thái"
                width="150px"
              />
              
              <CustomButton 
                type="primary" 
                className="bg-[#42855B]" 
                onClick={handleOpenCreateModal}
                icon={<Award size={16} />}
              >
                Cấp chứng chỉ mới
              </CustomButton>
            </div>
          </div>

          {error && <Error message={error} />}

          <Table
            columns={columns}
            dataSource={filteredCertificates}
            rowKey="id"
            loading={loading}
            pagination={{
              current: currentPage,
              total: filteredCertificates.length,
              pageSize: pageSize,
              showSizeChanger: true,
              showTotal: (total) => `Tổng số ${total} chứng chỉ`,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              }
            }}
          />
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

<style jsx global>{`
  .certificate-modal .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }
  .certificate-modal .ant-modal-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }
  .certificate-modal .ant-modal-body {
    padding: 12px;
  }
  .certificate-modal .ant-modal-footer {
    border-top: 1px solid #f0f0f0;
  }
`}</style> 