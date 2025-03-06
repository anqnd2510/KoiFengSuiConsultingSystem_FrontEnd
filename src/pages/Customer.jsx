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
  Upload,
  InputNumber,
  Switch
} from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import { User, Trash2, Calendar, Phone, Mail, Home, UploadCloud, FileText, CheckCircle, XCircle, Star, Shield, CreditCard } from "lucide-react";
import dayjs from 'dayjs';
import CustomTable from "../components/Common/CustomTable";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Component form cho Khách hàng
const CustomerForm = ({ form, initialData, loading }) => {
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
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input placeholder="Nhập họ và tên khách hàng" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} md={12}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Membership"
            name="membership"
            rules={[{ required: true, message: "Vui lòng chọn gói thành viên" }]}
          >
            <Select placeholder="Chọn gói thành viên">
              <Option value="Diamond">Kim cương</Option>
              <Option value="Gold">Vàng</Option>
              <Option value="Silver">Bạc</Option>
              <Option value="Basic">Cơ bản</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} md={8}>
          <Form.Item
            label="Ngày sinh"
            name="birthDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker placeholder="Chọn ngày sinh" style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </Col>

        <Col span={24} md={8}>
          <Form.Item
            label="Cung mệnh"
            name="zodiac"
            rules={[{ required: true, message: "Vui lòng chọn cung mệnh" }]}
          >
            <Select placeholder="Chọn cung mệnh">
              <Option value="Bạch Dương">Bạch Dương</Option>
              <Option value="Kim Ngưu">Kim Ngưu</Option>
              <Option value="Song Tử">Song Tử</Option>
              <Option value="Cự Giải">Cự Giải</Option>
              <Option value="Sư Tử">Sư Tử</Option>
              <Option value="Xử Nữ">Xử Nữ</Option>
              <Option value="Thiên Bình">Thiên Bình</Option>
              <Option value="Bọ Cạp">Bọ Cạp</Option>
              <Option value="Nhân Mã">Nhân Mã</Option>
              <Option value="Ma Kết">Ma Kết</Option>
              <Option value="Bảo Bình">Bảo Bình</Option>
              <Option value="Song Ngư">Song Ngư</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={24} md={8}>
          <Form.Item
            label="Sinh mệnh"
            name="lifeElement"
            rules={[{ required: true, message: "Vui lòng chọn sinh mệnh" }]}
          >
            <Select placeholder="Chọn sinh mệnh">
              <Option value="Kim">Kim</Option>
              <Option value="Mộc">Mộc</Option>
              <Option value="Thủy">Thủy</Option>
              <Option value="Hỏa">Hỏa</Option>
              <Option value="Thổ">Thổ</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} md={16}>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input placeholder="Nhập địa chỉ khách hàng" />
          </Form.Item>
        </Col>

        <Col span={24} md={8}>
          <Form.Item
            label="Ngày đăng ký"
            name="registrationDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày đăng ký" }]}
          >
            <DatePicker placeholder="Chọn ngày đăng ký" style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Trạng thái"
        name="status"
        valuePropName="checked"
        initialValue={initialData?.status === "Actived"}
      >
        <Switch 
          checkedChildren="Actived" 
          unCheckedChildren="Banned" 
          defaultChecked={initialData?.status === "Actived"} 
        />
      </Form.Item>

      <Form.Item
        label="Ảnh đại diện"
        name="avatar"
      >
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false} // Ngăn tự động upload
        >
          <div className="flex flex-col items-center">
            <UploadCloud className="w-6 h-6 text-gray-400" />
            <div className="mt-2">Upload</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Ghi chú"
        name="notes"
      >
        <TextArea
          placeholder="Nhập ghi chú về khách hàng"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>
    </Form>
  );
};

const Customer = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [error, setError] = useState(null);
  
  // States cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock data cho danh sách khách hàng
  const initialData = [
    {
      id: 1,
      fullName: "Nguyễn Thị Anh",
      email: "nguyenthianh@example.com",
      phone: "0901234567",
      membership: "Diamond",
      birthDate: "1985-05-15",
      registrationDate: "2023-01-10",
      address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
      status: "Actived",
      zodiac: "Kim Ngưu",
      lifeElement: "Mộc",
      notes: "Khách hàng thân thiết, quan tâm đến phong thủy hồ cá và thiết kế không gian sống.",
      avatar: "https://example.com/avatar1.jpg"
    },
    {
      id: 2,
      fullName: "Trần Văn Bình",
      email: "tranvanbinh@example.com",
      phone: "0912345678",
      membership: "Gold",
      birthDate: "1990-08-22",
      registrationDate: "2023-03-15",
      address: "456 Đường Nguyễn Huệ, Quận 3, TP.HCM",
      status: "Actived",
      zodiac: "Sư Tử",
      lifeElement: "Hỏa",
      notes: "Khách hàng có sở thích nuôi cá Koi và học hỏi về phong thủy.",
      avatar: "https://example.com/avatar2.jpg"
    },
    {
      id: 3,
      fullName: "Lê Thị Châu",
      email: "lethichau@example.com",
      phone: "0923456789",
      membership: "Silver",
      birthDate: "1995-12-10",
      registrationDate: "2023-06-20",
      address: "789 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
      status: "Banned",
      zodiac: "Nhân Mã",
      lifeElement: "Thủy",
      notes: "Khách hàng mới, quan tâm đến các hội thảo về phong thủy và nuôi cá Koi.",
      avatar: "https://example.com/avatar3.jpg"
    },
    {
      id: 4,
      fullName: "Phạm Văn Dũng",
      email: "phamvandung@example.com",
      phone: "0934567890",
      membership: "Diamond",
      birthDate: "1980-03-05",
      registrationDate: "2022-11-25",
      address: "101 Đường Hai Bà Trưng, Quận 1, TP.HCM",
      status: "Actived",
      zodiac: "Song Ngư",
      lifeElement: "Kim",
      notes: "Khách hàng có sở thích sưu tầm cá Koi đắt tiền và rất quan tâm đến phong thủy.",
      avatar: "https://example.com/avatar4.jpg"
    },
  ];

  const [data, setData] = useState(initialData);

  // Hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // Hàm xóa khách hàng
  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
    message.success("Đã xóa khách hàng thành công");
  };

  // Hàm chuyển đổi trạng thái
  const handleToggleStatus = (id) => {
    const newData = data.map(item => {
      if (item.id === id) {
        const newStatus = item.status === "Actived" ? "Banned" : "Actived";
        message.success(`Đã chuyển đổi trạng thái thành ${newStatus}`);
        return {
          ...item,
          status: newStatus
        };
      }
      return item;
    });
    setData(newData);
  };

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm mở modal để tạo mới
  const handleOpenCreateModal = () => {
    setSelectedCustomer(null);
    form.resetFields();
    form.setFieldsValue({
      status: true // Mặc định là Actived
    });
    setIsModalOpen(true);
  };

  // Hàm mở modal để chỉnh sửa
  const handleOpenEditModal = (customer) => {
    setSelectedCustomer(customer);
    form.setFieldsValue({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      membership: customer.membership,
      birthDate: customer.birthDate ? dayjs(customer.birthDate) : undefined,
      registrationDate: customer.registrationDate ? dayjs(customer.registrationDate) : undefined,
      address: customer.address,
      status: customer.status === "Actived",
      zodiac: customer.zodiac,
      lifeElement: customer.lifeElement,
      notes: customer.notes,
    });
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    form.resetFields();
  };

  // Hàm lưu dữ liệu
  const handleSave = () => {
    form.validateFields().then((values) => {
      setLoading(true);
      
      setTimeout(() => {
        const formattedValues = {
          ...values,
          status: values.status ? "Actived" : "Banned",
          birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
          registrationDate: values.registrationDate ? values.registrationDate.format('YYYY-MM-DD') : null,
        };

        if (selectedCustomer) {
          // Cập nhật
          const newData = data.map(item => {
            if (item.id === selectedCustomer.id) {
              return {
                ...item,
                ...formattedValues
              };
            }
            return item;
          });
          setData(newData);
          message.success("Đã cập nhật thông tin khách hàng thành công");
        } else {
          // Tạo mới
          const newId = Math.max(...data.map(item => item.id)) + 1;
          const newCustomer = {
            id: newId,
            ...formattedValues
          };
          setData([...data, newCustomer]);
          message.success("Đã tạo mới khách hàng thành công");
        }
        
        setLoading(false);
        handleCloseModal();
      }, 1000);
    });
  };

  // Cấu hình các cột cho bảng
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
      width: "15%",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img
              src={record.avatar}
              alt={record.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/40?text=User";
              }}
            />
          </div>
          <div>
            <div className="font-medium">{record.fullName}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      width: "15%",
      render: (_, record) => (
        <div>
          <div>
            <Phone className="inline-block mr-1 w-4 h-4" /> 
            {record.phone}
          </div>
          <div className="mt-1">
            <Mail className="inline-block mr-1 w-4 h-4" /> 
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: "Membership",
      dataIndex: "membership",
      key: "membership",
      width: "10%",
      render: (membership) => {
        let color = "blue";
        if (membership === "Diamond") color = "purple";
        if (membership === "Gold") color = "gold";
        if (membership === "Silver") color = "gray";
        if (membership === "Basic") color = "blue";
        return (
          <Tag color={color} icon={<CreditCard className="inline-block mr-1 w-4 h-4" />}>
            {membership}
          </Tag>
        );
      },
    },
    {
      title: "Phong thủy",
      key: "fengshui",
      width: "15%",
      render: (_, record) => (
        <div>
          <div>
            <Star className="inline-block mr-1 w-4 h-4" /> 
            {record.zodiac}
          </div>
          <div className="mt-1">
            <Shield className="inline-block mr-1 w-4 h-4" /> 
            {record.lifeElement}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "registrationDate",
      key: "registrationDate",
      width: "10%",
      render: (date) => (
        <div>
          <Calendar className="inline-block mr-1 w-4 h-4" /> 
          {dayjs(date).format('DD/MM/YYYY')}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status, record) => (
        <Switch
          checkedChildren={<CheckCircle className="w-3 h-3" />}
          unCheckedChildren={<XCircle className="w-3 h-3" />}
          checked={status === "Actived"}
          onChange={() => handleToggleStatus(record.id)}
        />
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: "10%",
      ellipsis: true,
      render: (address) => (
        <div>
          <Home className="inline-block mr-1 w-4 h-4" /> 
          {address}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <CustomButton 
            type="primary" 
            className="bg-blue-500"
            onClick={() => handleOpenEditModal(record)}
          >
            Chỉnh sửa
          </CustomButton>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa khách hàng này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <CustomButton type="primary" danger>
              Xóa
            </CustomButton>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Lọc dữ liệu theo tìm kiếm
  const filteredData = data.filter((item) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase()) ||
    item.phone.toLowerCase().includes(searchText.toLowerCase()) ||
    item.membership.toLowerCase().includes(searchText.toLowerCase())
  );

  // Phân trang dữ liệu
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý khách hàng"
        description="Quản lý thông tin và danh sách khách hàng"
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <SearchBar
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            onSearch={handleSearch}
            className="w-64"
          />
        </div>

        {error && <Error message={error} />}

        <CustomTable
          columns={columns}
          dataSource={paginatedData}
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

      {/* Modal for Create/Edit */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            {selectedCustomer ? "Chỉnh sửa thông tin khách hàng" : "Thêm khách hàng mới"}
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        className="customer-modal"
      >
        <div className="p-4">
          <CustomerForm
            form={form}
            initialData={selectedCustomer}
            loading={loading}
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseModal}>
              Hủy bỏ
            </CustomButton>
            <CustomButton type="primary" className="bg-blue-500" onClick={handleSave} loading={loading}>
              {selectedCustomer ? "Cập nhật" : "Tạo mới"}
            </CustomButton>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .customer-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .customer-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .customer-modal .ant-modal-body {
          padding: 12px;
        }
        .customer-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default Customer; 