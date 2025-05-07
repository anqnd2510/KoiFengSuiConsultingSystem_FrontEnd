import React, { useState, useEffect } from "react";
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
  Switch,
  Spin,
  Dropdown,
  Menu,
  Radio,
  Badge,
  Card,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import CustomButton from "../../components/Common/CustomButton";
import {
  User,
  Trash2,
  Calendar,
  Phone,
  Mail,
  Home,
  UploadCloud,
  FileText,
  CheckCircle,
  XCircle,
  Star,
  Shield,
  CreditCard,
  Filter,
  Clock,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import dayjs from "dayjs";
import CustomTable from "../../components/Common/CustomTable";
import { getAllCustomers } from "../../services/account.service";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

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
              { type: "email", message: "Email không hợp lệ" },
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
            name="phoneNumber"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Tên đăng nhập"
            name="userName"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input placeholder="Nhập tên đăng nhập" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} md={8}>
          <Form.Item
            label="Ngày sinh"
            name="dob"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker
              placeholder="Chọn ngày sinh"
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
            />
          </Form.Item>
        </Col>

        <Col span={24} md={8}>
          <Form.Item
            label="Cung mệnh"
            name="lifePalace"
            rules={[{ required: true, message: "Vui lòng chọn cung mệnh" }]}
          >
            <Select placeholder="Chọn cung mệnh">
              <Option value="Càn">Càn</Option>
              <Option value="Khảm">Khảm</Option>
              <Option value="Cấn">Cấn</Option>
              <Option value="Chấn">Chấn</Option>
              <Option value="Tốn">Tốn</Option>
              <Option value="Ly">Ly</Option>
              <Option value="Khôn">Khôn</Option>
              <Option value="Đoài">Đoài</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={24} md={8}>
          <Form.Item
            label="Ngũ hành"
            name="element"
            rules={[{ required: true, message: "Vui lòng chọn ngũ hành" }]}
          >
            <Select placeholder="Chọn ngũ hành">
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
        <Col span={24} md={12}>
          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="Male">Nam</Option>
              <Option value="Female">Nữ</Option>
              <Option value="Other">Khác</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item label="Trạng thái" name="isActive" valuePropName="checked">
            <Switch
              checkedChildren="Hoạt động"
              unCheckedChildren="Vô hiệu"
              defaultChecked={initialData?.isActive}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Ảnh đại diện" name="imageUrl">
        <Input placeholder="Nhập đường dẫn ảnh đại diện" />
      </Form.Item>
    </Form>
  );
};

const Customer = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // States cho filter
  const [genderFilter, setGenderFilter] = useState("all"); // all, male, female, other
  const [dateFilter, setDateFilter] = useState(null); // [startDate, endDate]

  // States cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState(false);

  // Fetch dữ liệu từ API
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await getAllCustomers();
      console.log("Customers response:", response);

      if (response && response.isSuccess && Array.isArray(response.data)) {
        // Chỉ lấy các trường cần thiết
        const formattedData = response.data.map((customer, index) => ({
          key: index.toString(),
          customerId: customer.customerId,
          userName: customer.userName,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          fullName: customer.fullName,
          dob: customer.dob,
          gender: customer.gender,
          lifePalace: customer.lifePalace || "Chưa xác định",
          element: customer.element || "Chưa xác định",
          imageUrl:
            customer.imageUrl || "https://via.placeholder.com/40?text=User",
          createDate: customer.createDate,
          isActive: customer.isActive,
        }));

        setData(formattedData);
        setTotalItems(formattedData.length);
        setError(null);
      } else {
        setError("Không thể tải dữ liệu khách hàng");
        message.error("Không thể tải dữ liệu khách hàng");
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Đã xảy ra lỗi khi tải dữ liệu khách hàng");
      message.error("Đã xảy ra lỗi khi tải dữ liệu khách hàng");
    } finally {
      setLoading(false);
    }
  };

  // Reset tất cả bộ lọc
  const resetFilters = () => {
    setGenderFilter("all");
    setDateFilter(null);
    setSearchText("");
    setCurrentPage(1);
  };

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
  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    form.setFieldsValue({
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      userName: customer.userName,
      dob: customer.dob ? dayjs(customer.dob) : undefined,
      gender: customer.gender,
      lifePalace: customer.lifePalace,
      element: customer.element,
      isActive: customer.isActive,
      imageUrl: customer.imageUrl,
    });
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    try {
      // Đóng modal trước
      setIsModalOpen(false);

      // Sau đó xóa dữ liệu sau khi animation đóng hoàn tất
      setTimeout(() => {
        setSelectedCustomer(null);
        form.resetFields();
      }, 300);
    } catch (error) {
      console.error("Lỗi khi đóng modal:", error);
    }
  };

  // Hàm lưu dữ liệu - chỉ demo, không có API cập nhật
  const handleSave = () => {
    form.validateFields().then((values) => {
      setFormLoading(true);

      setTimeout(() => {
        message.info("Chức năng cập nhật thông tin đang được phát triển");
        setFormLoading(false);
        handleCloseModal();
      }, 1000);
    });
  };

  // Lấy giới tính dạng text
  const getGenderText = (gender) => {
    switch (gender) {
      case "Male":
        return "Nam";
      case "Female":
        return "Nữ";
      default:
        return "Khác";
    }
  };

  // Lấy màu badge cho trạng thái
  const getStatusBadgeColor = (isActive) => {
    return isActive ? "success" : "error";
  };

  // Lấy text cho trạng thái
  const getStatusText = (isActive) => {
    return isActive ? "Hoạt động" : "Vô hiệu";
  };

  // Cấu hình các cột cho bảng
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
      width: "22%",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {record.imageUrl &&
          record.imageUrl !== "https://via.placeholder.com/40?text=User" ? (
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <img
                src={record.imageUrl}
                alt={record.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40?text=User";
                }}
              />
            </div>
          ) : (
            <Avatar
              style={{
                backgroundColor: "#1890ff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
              size="large"
              icon={<UserOutlined />}
            />
          )}
          <div>
            <div className="font-medium">{record.fullName}</div>
            <div className="text-xs text-gray-500">{record.userName}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Liên hệ",
      key: "contact",
      width: "22%",
      render: (_, record) => (
        <div>
          <div>
            <Phone className="inline-block mr-1 w-4 h-4" />
            {record.phoneNumber}
          </div>
          <div className="mt-1">
            <Mail className="inline-block mr-1 w-4 h-4" />
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: "Thông tin cá nhân",
      key: "info",
      width: "22%",
      render: (_, record) => (
        <div>
          <div>
            <Calendar className="inline-block mr-1 w-4 h-4" />
            {record.dob
              ? dayjs(record.dob).format("DD/MM/YYYY")
              : "Chưa cập nhật"}
          </div>
          <div className="mt-1">
            <User className="inline-block mr-1 w-4 h-4" />
            {getGenderText(record.gender)}
          </div>
        </div>
      ),
    },
    {
      title: "Phong thủy",
      key: "fengshui",
      width: "22%",
      render: (_, record) => (
        <div>
          <div>
            <Star className="inline-block mr-1 w-4 h-4" />
            Cung: {record.lifePalace}
          </div>
          <div className="mt-1">
            <Shield className="inline-block mr-1 w-4 h-4" />
            Ngũ hành: {record.element}
          </div>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      key: "createDate",
      width: "12%",
      render: (_, record) => (
        <div>
          {record.createDate ? (
            <div>
              <Calendar className="inline-block mr-1 w-4 h-4" />
              {dayjs(record.createDate).format("DD/MM/YYYY")}
            </div>
          ) : (
            <span className="text-gray-400">Chưa có dữ liệu</span>
          )}
        </div>
      ),
    },
  ];

  // Áp dụng các bộ lọc
  const applyFilters = (data) => {
    let filteredData = data;

    // Lọc theo giới tính
    if (genderFilter !== "all") {
      filteredData = filteredData.filter(
        (item) => item.gender?.toLowerCase() === genderFilter
      );
    }

    // Lọc theo ngày tạo
    if (dateFilter && dateFilter[0] && dateFilter[1]) {
      const startDate = dateFilter[0].startOf("day");
      const endDate = dateFilter[1].endOf("day");

      filteredData = filteredData.filter((item) => {
        if (!item.createDate) return false;
        const createDate = dayjs(item.createDate);
        return createDate.isAfter(startDate) && createDate.isBefore(endDate);
      });
    }

    // Lọc theo tìm kiếm
    if (searchText) {
      filteredData = filteredData.filter(
        (item) =>
          item.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.phoneNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
          item.userName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filteredData;
  };

  // Áp dụng lọc vào dữ liệu
  const filteredData = applyFilters(data);

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Hiển thị số lượng bản ghi đang được áp dụng lọc
  const filterCount = data.length - filteredData.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý khách hàng"
        description="Quản lý thông tin và danh sách khách hàng"
      />

      {/* Main Content */}
      <div className="p-6">
        {/* Thanh công cụ và tìm kiếm */}
        <div className="mb-6">
          <Card className="shadow-sm">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 flex-wrap">
              {/* Các bộ lọc */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-500">Bộ lọc:</span>
                </div>

                {/* Lọc theo giới tính */}
                <Select
                  value={genderFilter}
                  onChange={(value) => setGenderFilter(value)}
                  style={{ width: 120 }}
                  placeholder="Giới tính"
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="male">Nam</Option>
                  <Option value="female">Nữ</Option>
                  <Option value="other">Khác</Option>
                </Select>

                {/* Lọc theo ngày tạo */}
                <RangePicker
                  value={dateFilter}
                  onChange={(dates) => setDateFilter(dates)}
                  placeholder={["Từ ngày", "Đến ngày"]}
                  format="DD/MM/YYYY"
                  style={{ width: 240 }}
                />

                {/* Nút reset bộ lọc */}
                <Button
                  type="default"
                  onClick={resetFilters}
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Đặt lại
                </Button>
              </div>

              {/* Tìm kiếm và tải lại */}
              <div className="flex items-center gap-3">
                <SearchBar
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  onSearch={handleSearch}
                  value={searchText}
                  className="w-64"
                />
                <Button
                  type="primary"
                  className="bg-blue-500"
                  onClick={() => fetchCustomers()}
                  icon={<RefreshCw className="w-4 h-4 mr-1" />}
                >
                  Tải lại
                </Button>
              </div>
            </div>

            {/* Hiển thị thông tin lọc */}
            {filterCount > 0 && (
              <div className="mt-3 text-blue-600 text-sm">
                Đã lọc {filterCount} khách hàng từ tổng số {data.length} bản ghi
              </div>
            )}
          </Card>
        </div>

        {error && <Error message={error} />}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin tip="Đang tải dữ liệu..." />
          </div>
        ) : (
          <>
            <Card className="shadow-sm">
              <CustomTable
                columns={columns}
                dataSource={currentData}
                loading={false}
                pagination={false}
                onRow={(record) => ({
                  onClick: () => handleViewDetails(record),
                  className: "cursor-pointer hover:bg-gray-50",
                })}
              />
              <div className="mt-4 flex justify-between items-center">
                <div className="text-gray-500 text-sm">
                  Hiển thị {currentData.length} khách hàng trong tổng số{" "}
                  {filteredData.length} kết quả
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Modal for View Details */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Chi tiết thông tin khách hàng
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        className="customer-modal"
        maskClosable={true}
        destroyOnClose={true}
        closable={true}
        mask={true}
        keyboard={true}
      >
        <div className="p-4">
          <CustomerForm
            form={form}
            initialData={selectedCustomer}
            loading={formLoading}
          />

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseModal}>Đóng</CustomButton>
            <CustomButton
              type="primary"
              className="bg-blue-500"
              onClick={handleSave}
              loading={formLoading}
            >
              Cập nhật
            </CustomButton>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .customer-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
        .customer-modal .ant-modal-close {
          color: rgba(0, 0, 0, 0.45);
        }
        .customer-modal .ant-modal-close:hover {
          color: rgba(0, 0, 0, 0.75);
        }
        .customer-modal .ant-modal-mask {
          background-color: rgba(0, 0, 0, 0.45);
        }
      `}</style>
    </div>
  );
};

export default Customer;
