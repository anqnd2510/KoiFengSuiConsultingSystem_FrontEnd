import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Typography,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Popconfirm,
  Tooltip,
  Upload,
  Switch,
  Tag
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
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
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState(false);

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
          console.log(
            "ID của gói tư vấn đầu tiên:",
            response.data[0].consultationPackageId
          );
        }

        // Đảm bảo các gói tư vấn có trạng thái
        const mappedPackages = response.data.map(pkg => ({
          ...pkg,
          status: pkg.status || "Active" // Mặc định là Active nếu không có
        }));

        setPackages(mappedPackages);
        setError(null);
      } else {
        console.error("API response structure is not as expected:", response);
        setError(
          "Định dạng dữ liệu không đúng. Vui lòng liên hệ quản trị viên."
        );
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
  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.consultationPackageId
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý thay đổi trạng thái gói tư vấn
  const handleStatusChange = (packageId, checked) => {
    // Hiển thị modal xác nhận trước khi thay đổi
    Modal.confirm({
      title: "Xác nhận thay đổi",
      content: "Bạn chắc chắn muốn đổi trạng thái gói tư vấn này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const newStatus = checked ? "Active" : "Inactive";
          
          // Gọi API cập nhật trạng thái
          const response = await ConsultationPackageService.updatePackageStatus(packageId, newStatus);

          if (response && response.isSuccess) {
            message.success("Cập nhật trạng thái thành công!");
            
            // Cập nhật state local
            setPackages(prevPackages => 
              prevPackages.map(pkg => 
                pkg.consultationPackageId === packageId 
                  ? {...pkg, status: newStatus}
                  : pkg
              )
            );
          } else {
            message.error(response?.message || "Không thể cập nhật trạng thái");
            // Nếu thất bại, đặt lại trạng thái switch
            setTimeout(() => {
              setPackages(prevPackages => [...prevPackages]);
            }, 0);
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
          message.error("Có lỗi xảy ra khi cập nhật trạng thái");
          // Nếu có lỗi, đặt lại trạng thái switch
          setTimeout(() => {
            setPackages(prevPackages => [...prevPackages]);
          }, 0);
        }
      },
      onCancel() {
        // Nếu người dùng hủy, đặt lại trạng thái switch
        setTimeout(() => {
          setPackages(prevPackages => [...prevPackages]);
        }, 0);
      }
    });
  };

  // Handle view package details
  const handleViewDetails = (record) => {
    setCurrentPackage(record);
    setIsViewModalVisible(true);
  };

  // Handle image change
  const handleImageChange = ({ fileList }) => {
    console.log("Image change:", fileList);
    if (fileList.length > 0) {
      setImageFile(fileList[0].originFileObj);

      // Hiển thị preview ảnh
      if (fileList[0].originFileObj) {
        const url = URL.createObjectURL(fileList[0].originFileObj);
        setImageUrl(url);
      }
    } else {
      setImageFile(null);
      setImageUrl("");
    }
  };

  // Handle edit package
  const handleEdit = (record) => {
    setCurrentPackage(record);
    setIsEditMode(true);

    // Xử lý hình ảnh
    setImageFile(null);
    if (record.imageUrl) {
      console.log("Đang tải hình ảnh từ URL:", record.imageUrl);
      setImageUrl(record.imageUrl);
    } else {
      setImageUrl("");
    }

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

  // Handle add new package
  const handleAddNew = () => {
    setCurrentPackage(null);
    setIsEditMode(false);
    form.resetFields();
    setImageFile(null);
    setImageUrl("");
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setImageFile(null);
    setImageUrl("");
  };

  // Handle view modal close
  const handleViewModalClose = () => {
    setIsViewModalVisible(false);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Thêm file ảnh vào values
      const submitData = {
        ...values,
        imageFile: imageFile,
      };

      // Nếu đang trong mode chỉnh sửa và không có file ảnh mới, thêm imageUrl hiện tại
      if (isEditMode && currentPackage && !imageFile && imageUrl) {
        submitData.imageUrl = imageUrl;
        console.log("Sử dụng imageUrl hiện tại:", imageUrl);
      }

      if (isEditMode && currentPackage) {
        // Update package
        setModalLoading(true);
        const response = await ConsultationPackageService.updatePackage(
          currentPackage.consultationPackageId,
          submitData
        );
        setModalLoading(false);

        if (response && response.isSuccess) {
          message.success("Cập nhật gói tư vấn thành công");
          fetchPackages();
          setIsModalVisible(false);
          setImageFile(null);
          setImageUrl("");
        } else {
          message.error(response?.message || "Cập nhật gói tư vấn thất bại");
        }
      } else {
        // Create new package
        setModalLoading(true);
        const response = await ConsultationPackageService.createPackage(
          submitData
        );
        setModalLoading(false);

        if (response && response.isSuccess) {
          message.success("Tạo gói tư vấn mới thành công");
          fetchPackages();
          setIsModalVisible(false);
          setImageFile(null);
          setImageUrl("");
        } else {
          message.error(response?.message || "Tạo gói tư vấn mới thất bại");
        }
      }
    } catch (err) {
      console.error("Form validation failed or API error:", err);
      if (err.response) {
        message.error(
          err.response.data?.message || "Đã xảy ra lỗi khi lưu dữ liệu"
        );
      } else {
        message.error("Đã xảy ra lỗi khi lưu dữ liệu");
      }
    }
  };

  // Table columns definition
  const columns = [
    {
      title: "Mã gói",
      dataIndex: "consultationPackageId",
      key: "consultationPackageId",
      width: 150,
      ellipsis: true,
      render: (text) => <span className="font-mono text-xs">{text}</span>,
    },
    {
      title: "Tên gói",
      dataIndex: "packageName",
      key: "packageName",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Giá tối thiểu",
      dataIndex: "minPrice",
      key: "minPrice",
      width: 120,
      align: "left",
      render: (price) => <span>{price.toLocaleString("vi-VN")} đ</span>,
    },
    {
      title: "Giá tối đa",
      dataIndex: "maxPrice",
      key: "maxPrice",
      width: 120,
      align: "left",
      render: (price) => <span>{price.toLocaleString("vi-VN")} đ</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center",
      render: (status, record) => {
        const isActive = status === "Active";
        return (
          <Switch
            checked={isActive}
            onChange={(checked) => handleStatusChange(record.consultationPackageId, checked)}
          />
        );
      }
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 200,
      render: (text) => (
        <div className="truncate max-w-full" title={text}>
          {text}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 160,
      align: "left",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <CustomButton
            type="default"
            size="small"
            onClick={() => handleViewDetails(record)}
          >
            Xem
          </CustomButton>
          <CustomButton
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
          >
            Chỉnh sửa
          </CustomButton>
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
            onClick={handleAddNew}
            className="flex items-center"
          >
            <span className="mr-1">+</span> Thêm gói tư vấn mới
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
            scroll={{ x: 1100 }}
            bordered
          />
        </Card>
      </div>

      {/* Modal for Add/Edit Package */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            {isEditMode ? "Chỉnh sửa gói tư vấn" : "Tạo gói tư vấn mới"}
          </div>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <CustomButton
            key="submit"
            type="primary"
            onClick={handleSubmit}
            loading={modalLoading}
          >
            {isEditMode ? "Cập nhật" : "Tạo mới"}
          </CustomButton>,
        ]}
        width={800}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="packageName"
                label="Tên gói"
                rules={[
                  { required: true, message: "Vui lòng nhập tên gói tư vấn" },
                ]}
              >
                <Input placeholder="Nhập tên gói tư vấn" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="suitableFor"
                label="Phù hợp với"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập đối tượng phù hợp",
                  },
                ]}
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
                rules={[
                  { required: true, message: "Vui lòng nhập giá tối thiểu" },
                ]}
              >
                <InputNumber
                  placeholder="Nhập giá tối thiểu"
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxPrice"
                label="Giá tối đa"
                rules={[
                  { required: true, message: "Vui lòng nhập giá tối đa" },
                ]}
              >
                <InputNumber
                  placeholder="Nhập giá tối đa"
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả gói tư vấn" },
            ]}
          >
            <TextArea
              placeholder="Nhập mô tả chi tiết về gói tư vấn"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>

          <Form.Item
            name="requiredInfo"
            label="Thông tin cần thiết"
            rules={[
              { required: true, message: "Vui lòng nhập thông tin cần thiết" },
            ]}
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

          <Form.Item
            name="imageUrl"
            label="Hình ảnh"
            rules={[
              {
                required: !isEditMode && !imageFile,
                message: "Vui lòng tải lên hình ảnh cho gói tư vấn",
              },
            ]}
          >
            <div className="mt-2">
              <Upload
                listType="picture-card"
                onChange={handleImageChange}
                maxCount={1}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith("image/");
                  if (!isImage) {
                    message.error("Chỉ chấp nhận file hình ảnh!");
                    return Upload.LIST_IGNORE;
                  }
                  return false; // Không tự động upload
                }}
                fileList={
                  imageUrl
                    ? [
                        {
                          uid: "-1",
                          name: "image.png",
                          status: "done",
                          url: imageUrl,
                        },
                      ]
                    : []
                }
              >
                {imageUrl ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>

              {imageUrl && (
                <div className="mt-2">
                  <p className="text-gray-600 text-sm">Hình ảnh đã chọn:</p>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="mt-1 h-20 object-cover rounded"
                    onError={(e) => {
                      console.error("Lỗi tải hình ảnh preview:", e);
                      e.target.src =
                        "https://placehold.co/200x100?text=Không+tải+được+ảnh";
                      message.warning(
                        "Không thể hiển thị hình ảnh, nhưng bạn vẫn có thể tải lên hình mới"
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Detail Modal */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Chi tiết gói tư vấn: {currentPackage?.packageName}
          </div>
        }
        open={isViewModalVisible}
        onCancel={handleViewModalClose}
        footer={[
          <CustomButton key="close" onClick={handleViewModalClose}>
            Đóng
          </CustomButton>,
        ]}
        width={800}
      >
        {currentPackage && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              {currentPackage.imageUrl && (
                <img
                  src={currentPackage.imageUrl}
                  alt={currentPackage.packageName}
                  className="max-h-[250px] w-full object-contain rounded-lg mx-auto"
                />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Mã gói</p>
                <p className="text-base font-medium text-gray-800">{currentPackage.consultationPackageId}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Tên gói</p>
                <p className="text-base font-medium text-gray-800">{currentPackage.packageName}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Giá tối thiểu</p>
                <p className="text-base font-medium text-gray-800">{currentPackage.minPrice?.toLocaleString('vi-VN')} đ</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Giá tối đa</p>
                <p className="text-base font-medium text-gray-800">{currentPackage.maxPrice?.toLocaleString('vi-VN')} đ</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Trạng thái</p>
                <Tag color={currentPackage.status === "Active" ? "green" : "red"}>
                  {currentPackage.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                </Tag>
              </div>
            </div>

            <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-100">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Phù hợp với</p>
                <p className="text-base text-gray-700 leading-relaxed bg-gray-50 p-4 rounded">
                  {currentPackage.suitableFor}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Mô tả</p>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded">
                  {currentPackage.description}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Thông tin cần thiết</p>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded">
                  {currentPackage.requiredInfo}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Chi tiết giá</p>
                <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded">
                  {currentPackage.pricingDetails}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ConsultationPackage;
