import React, { useState, useEffect } from "react";
import { Row, Col, Card, Table, Typography, message, Modal, Form, Input, InputNumber, Button, Space, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import Header from "../../components/Common/Header";
import SearchBar from "../../components/Common/SearchBar";
import Error from "../../components/Common/Error";
import CustomButton from "../../components/Common/CustomButton";
import ConsultationPackageService from "../../services/consultationPackage.service";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ConsultationPackage = () => {
  // State management
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [form] = Form.useForm();

  // Fetch packages on component mount
  useEffect(() => {
    fetchPackages();
  }, []);

  // Function to fetch all packages
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await ConsultationPackageService.getAllPackages();
      console.log("API response getAllPackages:", response);
      
      if (response && response.isSuccess && Array.isArray(response.data)) {
        // Log một số mẫu ID để kiểm tra định dạng
        if (response.data.length > 0) {
          console.log("Mẫu gói tư vấn đầu tiên:", response.data[0]);
          console.log("ID của gói tư vấn đầu tiên:", response.data[0].consultationPackageId);
        }
        
        setPackages(response.data);
        setError(null);
      } else {
        console.error("API response structure is not as expected:", response);
        setError("Định dạng dữ liệu không đúng. Vui lòng liên hệ quản trị viên.");
      }
    } catch (err) {
      console.error("Error fetching consultation packages:", err);
      setError("Không thể tải danh sách gói tư vấn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Filter packages based on search term
  const filteredPackages = packages.filter((pkg) =>
    pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.consultationPackageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle view package details
  const handleViewDetails = (record) => {
    setCurrentPackage(record);
    setIsViewModalVisible(true);
  };

  // Handle edit package
  const handleEdit = (record) => {
    setCurrentPackage(record);
    setIsEditMode(true);
    form.setFieldsValue({
      packageName: record.packageName,
      minPrice: record.minPrice,
      maxPrice: record.maxPrice,
      description: record.description,
      suitableFor: record.suitableFor,
      requiredInfo: record.requiredInfo,
      pricingDetails: record.pricingDetails,
    });
    setIsModalVisible(true);
  };

  // Handle delete package
  const handleDelete = async (id) => {
    try {
      console.log("Đang xóa gói tư vấn với ID:", id);
      
      // Kiểm tra ID trước khi gửi request
      if (!id) {
        message.error("ID gói tư vấn không hợp lệ");
        return;
      }
      
      // Gọi API xóa gói tư vấn
      const response = await ConsultationPackageService.deletePackage(id);
      console.log("Phản hồi từ API xóa:", response);

      if (response && response.isSuccess) {
        message.success(response.message || "Xóa gói tư vấn thành công");
        fetchPackages();
      } else {
        throw new Error(response?.message || "Xóa gói tư vấn thất bại");
      }
    } catch (err) {
      console.error("Error deleting package:", err);
      message.error(err.message || "Đã xảy ra lỗi khi xóa gói tư vấn");
    }
  };

  // Handle add new package
  const handleAddNew = () => {
    setCurrentPackage(null);
    setIsEditMode(false);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle view modal close
  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEditMode && currentPackage) {
        // Update package
        const response = await ConsultationPackageService.updatePackage(
          currentPackage.consultationPackageId,
          values
        );
        if (response && response.isSuccess) {
          message.success("Cập nhật gói tư vấn thành công");
          fetchPackages();
          setIsModalVisible(false);
        } else {
          message.error("Cập nhật gói tư vấn thất bại");
        }
      } else {
        // Create new package
        const response = await ConsultationPackageService.createPackage(values);
        if (response && response.isSuccess) {
          message.success("Tạo gói tư vấn mới thành công");
          fetchPackages();
          setIsModalVisible(false);
        } else {
          message.error("Tạo gói tư vấn mới thất bại");
        }
      }
    } catch (err) {
      console.error("Form validation failed or API error:", err);
    }
  };

  // Table columns definition
  const columns = [
    {
      title: "Mã gói",
      dataIndex: "consultationPackageId",
      key: "consultationPackageId",
      width: 200,
      render: (text) => <span className="font-mono text-xs">{text}</span>,
    },
    {
      title: "Tên gói",
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: "Giá tối thiểu",
      dataIndex: "minPrice",
      key: "minPrice",
      render: (price) => <span>{price.toLocaleString("vi-VN")} đ</span>,
    },
    {
      title: "Giá tối đa",
      dataIndex: "maxPrice",
      key: "maxPrice",
      render: (price) => <span>{price.toLocaleString("vi-VN")} đ</span>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title={
                <div>
                  <p>Bạn có chắc chắn muốn xóa gói tư vấn này?</p>
                  <p className="text-xs mt-2 font-mono text-gray-500">ID: {record.consultationPackageId}</p>
                  <p className="text-xs font-mono text-gray-500">Tên: {record.packageName}</p>
                </div>
              }
              onConfirm={() => {
                console.log("Xác nhận xóa gói tư vấn:", record);
                handleDelete(record.consultationPackageId);
              }}
              okText="Có"
              cancelText="Không"
            >
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="mb-6">
        <Header title="Quản lý gói tư vấn" description="Quản lý gói tư vấn" />
      </div>

      {error && <Error message={error} />}

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <CustomButton 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddNew}
          >
            Thêm gói tư vấn mới
          </CustomButton>
          
          <div className="w-75">
            <SearchBar  
              placeholder="Tìm kiếm gói tư vấn..." 
              onSearch={handleSearch} 
            />
          </div>
        </div>

        <Card className="bg-white rounded-lg shadow-sm">
          <Table
            columns={columns}
            dataSource={filteredPackages}
            rowKey="consultationPackageId"
            loading={loading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
            }}
          />
        </Card>
      </div>

      {/* Modal for Add/Edit Package */}
      <Modal
        title={isEditMode ? "Chỉnh sửa gói tư vấn" : "Thêm gói tư vấn mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            {isEditMode ? "Cập nhật" : "Tạo mới"}
          </Button>,
        ]}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="packageName"
                label="Tên gói"
                rules={[{ required: true, message: "Vui lòng nhập tên gói tư vấn" }]}
              >
                <Input placeholder="Nhập tên gói tư vấn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="suitableFor"
                label="Phù hợp với"
                rules={[{ required: true, message: "Vui lòng nhập đối tượng phù hợp" }]}
              >
                <Input placeholder="Nhập đối tượng phù hợp với gói tư vấn" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="minPrice"
                label="Giá tối thiểu"
                rules={[{ required: true, message: "Vui lòng nhập giá tối thiểu" }]}
              >
                <InputNumber 
                  placeholder="Nhập giá tối thiểu" 
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxPrice"
                label="Giá tối đa"
                rules={[{ required: true, message: "Vui lòng nhập giá tối đa" }]}
              >
                <InputNumber 
                  placeholder="Nhập giá tối đa" 
                  style={{ width: '100%' }}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả gói tư vấn" }]}
          >
            <TextArea 
              placeholder="Nhập mô tả chi tiết về gói tư vấn" 
              autoSize={{ minRows: 3, maxRows: 5 }} 
            />
          </Form.Item>
          
          <Form.Item
            name="requiredInfo"
            label="Thông tin cần thiết"
            rules={[{ required: true, message: "Vui lòng nhập thông tin cần thiết" }]}
          >
            <TextArea 
              placeholder="Nhập các thông tin cần thiết khách hàng cần cung cấp" 
              autoSize={{ minRows: 3, maxRows: 5 }} 
            />
          </Form.Item>
          
          <Form.Item
            name="pricingDetails"
            label="Chi tiết giá"
            rules={[{ required: true, message: "Vui lòng nhập chi tiết giá" }]}
          >
            <TextArea 
              placeholder="Nhập chi tiết về cách tính giá của gói tư vấn" 
              autoSize={{ minRows: 3, maxRows: 5 }} 
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for View Package Details */}
      <Modal
        title="Chi tiết gói tư vấn"
        open={isViewModalVisible}
        onCancel={handleViewModalClose}
        footer={[
          <Button key="back" onClick={handleViewModalClose}>
            Đóng
          </Button>,
          <Button 
            key="edit" 
            type="primary" 
            onClick={() => {
              setIsViewModalVisible(false);
              handleEdit(currentPackage);
            }}
          >
            Chỉnh sửa
          </Button>,
        ]}
        width={700}
      >
        {currentPackage && (
          <div className="mt-4">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <Title level={4} className="m-0">{currentPackage.packageName}</Title>
                  <Text type="secondary">Mã gói: {currentPackage.consultationPackageId}</Text>
                </div>
              </Col>
              
              <Col span={12}>
                <Card title="Thông tin giá" className="h-full">
                  <p><Text strong>Giá tối thiểu:</Text> {currentPackage.minPrice.toLocaleString("vi-VN")} đ</p>
                  <p><Text strong>Giá tối đa:</Text> {currentPackage.maxPrice.toLocaleString("vi-VN")} đ</p>
                  <div className="mt-4">
                    <Text strong>Chi tiết giá:</Text>
                    <p className="whitespace-pre-wrap mt-1">{currentPackage.pricingDetails}</p>
                  </div>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="Đối tượng & Yêu cầu" className="h-full">
                  <div className="mb-4">
                    <Text strong>Phù hợp với:</Text>
                    <p className="whitespace-pre-wrap mt-1">{currentPackage.suitableFor}</p>
                  </div>
                  <div>
                    <Text strong>Thông tin cần thiết:</Text>
                    <p className="whitespace-pre-wrap mt-1">{currentPackage.requiredInfo}</p>
                  </div>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card title="Mô tả chi tiết">
                  <p className="whitespace-pre-wrap">{currentPackage.description}</p>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ConsultationPackage;

