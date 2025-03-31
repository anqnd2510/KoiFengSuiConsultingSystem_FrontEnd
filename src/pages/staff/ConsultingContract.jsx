import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Spin,
  message,
  Upload,
  Button,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import Header from "../../components/Common/Header";
import SearchBar from "../../components/Common/SearchBar";
import Pagination from "../../components/Common/Pagination";
import Error from "../../components/Common/Error";
import CustomButton from "../../components/Common/CustomButton";
import { getAllBookingOffline } from "../../services/booking.service";
// Giả định service cho hợp đồng
import {
  createContract,
  getAllContracts,
} from "../../services/contract.service";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ConsultingContract = () => {
  const [contracts, setContracts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("bookings");
  const [stats, setStats] = useState({
    pendingBookings: 0,
    completedBookings: 0,
    activeContracts: 0,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch danh sách booking offline
  const fetchBookings = useCallback(async () => {
    try {
      setBookingsLoading(true);
      const response = await getAllBookingOffline();

      if (response?.data && Array.isArray(response.data)) {
        // Xử lý dữ liệu booking
        const offlineBookings = response.data.map((booking) => ({
          id: booking.bookingOfflineId,
          status: booking.status,
          customerName: booking.customerName || "Không có tên",
          customerEmail: booking.customerEmail || "Không có email",
          location: booking.location || "Không có địa điểm",
          description: booking.description || "Không có mô tả",
          bookingDate: booking.bookingDate,
          hasContract: booking.hasContract || false, // Thêm trường này để biết booking đã có hợp đồng chưa
        }));

        console.log("Processed bookings:", offlineBookings);
        setBookings(offlineBookings);
        setTotalPages(Math.ceil(offlineBookings.length / 10));
        setError(null); // Xóa lỗi nếu có

        // Tính toán số liệu thống kê
        const pendingCount = offlineBookings.filter(
          (b) => b.status === "Scheduled" && !b.hasContract
        ).length;
        const completedCount = offlineBookings.filter(
          (b) => b.status === "Completed"
        ).length;

        setStats((prev) => ({
          ...prev,
          pendingBookings: pendingCount,
          completedBookings: completedCount,
        }));
      } else {
        console.error("Invalid booking data format:", response);
        setBookings([]); // Đặt mảng rỗng thay vì hiển thị lỗi
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu đặt lịch. Vui lòng thử lại sau.");
    } finally {
      setBookingsLoading(false);
    }
  }, []);

  // Fetch danh sách hợp đồng
  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllContracts();

      if (response?.data && Array.isArray(response.data)) {
        setContracts(response.data);
        setError(null);

        // Cập nhật số liệu thống kê
        const activeCount = response.data.filter(
          (c) => c.status === "active"
        ).length;
        setStats((prev) => ({
          ...prev,
          activeContracts: activeCount,
        }));
      } else {
        setContracts([]);
        setError(null); // Đảm bảo không hiển thị lỗi khi chỉ là không có dữ liệu
      }
    } catch (err) {
      console.error("Error fetching contracts:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu hợp đồng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
    fetchContracts();
  }, [fetchBookings, fetchContracts]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  // Lọc bookings dựa trên tìm kiếm và trạng thái
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "pending")
      return (
        matchesSearch && booking.status === "Scheduled" && !booking.hasContract
      );
    if (filterStatus === "completed")
      return matchesSearch && booking.status === "Completed";
    if (filterStatus === "hasContract")
      return matchesSearch && booking.hasContract;

    return matchesSearch && booking.status === filterStatus;
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
    form.setFieldsValue({
      bookingId: booking.id,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setPreviewUrl(null);
    form.resetFields();
  };

  const handleCreateContract = async (values) => {
    try {
      setLoading(true);

      // Kiểm tra xem có file PDF được chọn không
      if (
        !values.pdfFile ||
        !values.pdfFile.fileList ||
        values.pdfFile.fileList.length === 0
      ) {
        message.error("Vui lòng tải lên file hợp đồng PDF");
        setLoading(false);
        return;
      }

      // Tạo FormData để gửi dữ liệu
      const formData = new FormData();
      formData.append("BookingOfflineId", values.bookingId);
      formData.append("PdfFile", values.pdfFile.fileList[0].originFileObj);

      // Gọi API tạo hợp đồng
      const response = await createContract(formData);

      // Kiểm tra response từ API
      if (response && (response.status === 200 || response.status === 201)) {
        message.success("Tạo hợp đồng thành công");
        handleCloseModal();
        // Cập nhật lại danh sách booking và hợp đồng
        fetchBookings();
        fetchContracts();
      } else {
        message.error(response?.data?.message || "Tạo hợp đồng thất bại");
      }
    } catch (err) {
      console.error("Error creating contract:", err);
      message.error(
        "Có lỗi xảy ra khi tạo hợp đồng: " +
          (err.message || "Lỗi không xác định")
      );
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm xử lý khi file thay đổi
  const handleFileChange = (info) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      // Tạo URL để xem trước file
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const columns = [
    {
      title: "Mã hợp đồng",
      dataIndex: "contractNumber",
      key: "contractNumber",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Tổng giá trị",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `${amount.toLocaleString()} VNĐ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "gray";
        let text = "Chưa xác định";

        switch (status) {
          case "active":
            color = "green";
            text = "Đang hiệu lực";
            break;
          case "expired":
            color = "red";
            text = "Hết hạn";
            break;
          case "pending":
            color = "orange";
            text = "Chờ xác nhận";
            break;
          default:
            break;
        }

        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <CustomButton type="primary" size="small">
            Xem chi tiết
          </CustomButton>
          <CustomButton size="small">In hợp đồng</CustomButton>
        </div>
      ),
    },
  ];

  // Columns cho bảng booking
  const bookingColumns = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Ngày đặt lịch",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        let color = "gray";
        let text = "Chưa xác định";
        let bgColor = "bg-gray-100";

        switch (status) {
          case "Scheduled":
            color = record.hasContract ? "#52c41a" : "#1890ff";
            text = record.hasContract ? "Đã có hợp đồng" : "Cần tạo hợp đồng";
            bgColor = record.hasContract ? "bg-green-50" : "bg-blue-50";
            break;
          case "Completed":
            color = "#52c41a";
            text = "Đã hoàn thành";
            bgColor = "bg-green-50";
            break;
          case "Cancelled":
            color = "#f5222d";
            text = "Đã hủy";
            bgColor = "bg-red-50";
            break;
          default:
            break;
        }

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}
            style={{ color }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <CustomButton
            type="primary"
            size="small"
            onClick={() => handleOpenModal(record)}
            disabled={record.status !== "Scheduled" || record.hasContract}
            className={
              record.status === "Scheduled" && !record.hasContract
                ? "bg-blue-500 hover:bg-blue-600"
                : ""
            }
          >
            {record.hasContract ? "Đã có hợp đồng" : "Tạo hợp đồng"}
          </CustomButton>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý hợp đồng tư vấn"
        description="Tạo và quản lý hợp đồng tư vấn offline"
      />

      <div className="p-6">
        {/* Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow">
          <div className="flex border-b">
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === "bookings"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("bookings")}
            >
              Lịch tư vấn
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm ${
                activeTab === "contracts"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("contracts")}
            >
              Hợp đồng đã tạo
            </button>
          </div>
        </div>

        {activeTab === "bookings" && (
          <>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  Danh sách lịch tư vấn offline
                </h2>
                <p className="text-gray-500 text-sm">
                  Quản lý và tạo hợp đồng cho các buổi tư vấn
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <Select
                  defaultValue="all"
                  style={{ width: 180 }}
                  onChange={handleStatusFilter}
                  className="w-full md:w-auto"
                >
                  <Select.Option value="all">Tất cả trạng thái</Select.Option>
                  <Select.Option value="pending">
                    Cần tạo hợp đồng
                  </Select.Option>
                  <Select.Option value="hasContract">
                    Đã có hợp đồng
                  </Select.Option>
                  <Select.Option value="Completed">Đã hoàn thành</Select.Option>
                  <Select.Option value="Cancelled">Đã hủy</Select.Option>
                </Select>
                <SearchBar
                  onSearch={handleSearch}
                  placeholder="Tìm kiếm lịch tư vấn..."
                  className="w-full md:w-64"
                />
              </div>
            </div>

            {error && <Error message={error} />}

            {bookingsLoading ? (
              <div className="text-center py-4">
                <Spin size="large" />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow mb-8">
                <Table
                  columns={bookingColumns}
                  dataSource={filteredBookings}
                  rowKey="id"
                  pagination={false}
                  rowClassName={(record) =>
                    record.status === "Scheduled" && !record.hasContract
                      ? "bg-blue-50 hover:bg-blue-100"
                      : ""
                  }
                  locale={{
                    emptyText: searchTerm
                      ? "Không tìm thấy kết quả phù hợp"
                      : "Chưa có lịch tư vấn nào",
                  }}
                />
              </div>
            )}

            <div className="mt-4 mb-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}

        {activeTab === "contracts" && (
          <>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-xl font-semibold">
                  Danh sách hợp đồng đã tạo
                </h2>
                <p className="text-gray-500 text-sm">
                  Quản lý tất cả các hợp đồng tư vấn
                </p>
              </div>
              <SearchBar
                onSearch={(term) => console.log("Tìm kiếm hợp đồng:", term)}
                placeholder="Tìm kiếm hợp đồng..."
                className="w-full md:w-64 mt-3 md:mt-0"
              />
            </div>

            {loading ? (
              <div className="text-center py-4">
                <Spin size="large" />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <Table
                  columns={columns}
                  dataSource={contracts}
                  rowKey="id"
                  pagination={false}
                  locale={{ emptyText: "Chưa có hợp đồng nào được tạo" }}
                />
              </div>
            )}
          </>
        )}

        <Modal
          title={
            <div className="text-xl font-semibold">
              Tạo hợp đồng tư vấn mới
              {selectedBooking && (
                <div className="text-sm font-normal text-gray-500 mt-1">
                  Khách hàng: {selectedBooking.customerName} -{" "}
                  {selectedBooking.customerEmail}
                </div>
              )}
            </div>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={800}
          className="contract-modal"
        >
          <div className="p-4">
            <Form form={form} layout="vertical" onFinish={handleCreateContract}>
              <Form.Item name="bookingId" hidden>
                <Input />
              </Form.Item>

              {selectedBooking && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                  <h3 className="font-medium mb-2 text-blue-800">
                    Thông tin lịch tư vấn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Khách hàng:</strong>{" "}
                        {selectedBooking.customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {selectedBooking.customerEmail}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Địa điểm:</strong> {selectedBooking.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>Ngày tư vấn:</strong>{" "}
                        {moment(selectedBooking.bookingDate).format(
                          "DD/MM/YYYY HH:mm"
                        )}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Trạng thái:</strong>{" "}
                        <span className="text-green-600">Đã lên lịch</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <strong>Mô tả:</strong> {selectedBooking.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 p-4 rounded-lg mb-4 border border-yellow-100">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-500 mr-2 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h3 className="font-medium text-yellow-800 text-sm">
                      Lưu ý quan trọng
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Vui lòng tải lên file hợp đồng đã được ký kết giữa hai
                      bên. Chỉ chấp nhận file PDF.
                    </p>
                  </div>
                </div>
              </div>

              <Form.Item
                label="Tải lên file hợp đồng (PDF)"
                name="pdfFile"
                rules={[
                  { required: true, message: "Vui lòng tải lên file hợp đồng" },
                ]}
              >
                <Upload
                  listType="picture"
                  beforeUpload={(file) => {
                    // Kiểm tra định dạng file
                    const isPdf = file.type === "application/pdf";
                    if (!isPdf) {
                      message.error("Chỉ chấp nhận file PDF!");
                    }
                    return false; // Ngăn chặn tự động upload
                  }}
                  onChange={handleFileChange}
                  accept=".pdf"
                  maxCount={1}
                >
                  <Button
                    icon={<UploadOutlined />}
                    className="bg-white border border-gray-300 hover:bg-gray-50"
                  >
                    Chọn file PDF
                  </Button>
                </Upload>
              </Form.Item>

              {previewUrl && (
                <div className="mt-4 border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                    <h3 className="font-medium text-gray-700">
                      Xem trước hợp đồng
                    </h3>
                    <Button
                      type="link"
                      onClick={() => window.open(previewUrl, "_blank")}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Mở rộng
                    </Button>
                  </div>
                  <div className="pdf-preview-container">
                    <iframe
                      src={previewUrl}
                      title="PDF Preview"
                      className="w-full h-[400px] border-0"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <CustomButton
                  onClick={handleCloseModal}
                  className="border border-gray-300"
                >
                  Hủy bỏ
                </CustomButton>
                <CustomButton
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Tạo hợp đồng
                </CustomButton>
              </div>
            </Form>
          </div>
        </Modal>

        <style jsx global>{`
          .contract-modal .ant-modal-content {
            border-radius: 12px;
            overflow: hidden;
          }
          .contract-modal .ant-modal-header {
            border-bottom: 1px solid #f0f0f0;
            padding: 16px 24px;
          }
          .contract-modal .ant-modal-body {
            padding: 12px;
          }
          .contract-modal .ant-modal-footer {
            border-top: 1px solid #f0f0f0;
          }
          .ant-table-row-level-0:hover {
            transition: all 0.3s;
          }
          .pdf-preview-container {
            background-color: #f5f5f5;
            padding: 8px;
            border-radius: 0 0 8px 8px;
          }
          .pdf-preview-container iframe {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            background-color: white;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ConsultingContract;
