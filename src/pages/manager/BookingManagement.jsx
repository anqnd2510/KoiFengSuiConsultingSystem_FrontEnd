import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../../components/Common/SearchBar";
import BookingTableManager from "../../components/Booking/BookingTableManager";
import Pagination from "../../components/Common/Pagination";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import moment from "moment";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Spin,
  message,
  Card,
  Row,
  Col,
  Badge,
  Tabs,
  Tag,
  Tooltip,
  Statistic,
  Avatar,
  Progress,
  Button,
  Typography,
  Space,
  Divider,
} from "antd";
import CustomButton from "../../components/Common/CustomButton";
import { getBookingHistory } from "../../services/booking.service";
import {
  UserOutlined,
  TeamOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  CalendarOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  FireOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const pageSize = 10;

  // Thống kê
  const [stats, setStats] = useState({
    total: 0,
    unassigned: 0,
    online: 0,
    offline: 0,
    pending: 0,
    new: 0,
  });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getBookingHistory();
      console.log("Booking API response:", response);

      const assignmentData = JSON.parse(
        localStorage.getItem("staffAssignments") || "{}"
      );
      console.log("Local assignments:", assignmentData);

      if (!Array.isArray(response?.data)) {
        setBookings([]);
        setFilteredBookings([]);
        setError("Không có dữ liệu từ server");
        return;
      }

      const transformedData = response.data.map((booking) => {
        console.log("Processing booking:", booking);

        const localAssignment = assignmentData[booking.id];
        const hasStaff = booking.staffName?.trim() !== "";

        let staffName = "";
        const status = booking.status?.toLowerCase() || "pending";

        switch (status) {
          case "canceled":
            staffName = "Đã hủy lịch";
            break;
          case "pending":
            staffName = hasStaff
              ? booking.staffName
              : localAssignment?.staffName || "Chưa phân công";
            break;
          case "confirmed":
            staffName = "Đã xác nhận";
            break;
          case "completed":
            staffName = hasStaff
              ? booking.staffName
              : localAssignment?.staffName || "Đã xong";
            break;
          default:
            staffName = hasStaff
              ? booking.staffName
              : localAssignment?.staffName || "Không xác định";
        }

        const staffId = booking.staffId || localAssignment?.staffId || null;

        let createDate = booking.createDate || new Date().toISOString();
        let parsedDate = new Date(createDate);

        if (isNaN(parsedDate.getTime())) {
          console.warn(
            `Booking ${booking.id} có ngày tạo không hợp lệ (${booking.createDate}), sử dụng ngày hiện tại.`
          );
          parsedDate = new Date();
          createDate = parsedDate.toISOString();
        }

        const currentTime = new Date();
        const isNewBooking =
          (currentTime.getTime() - parsedDate.getTime()) / (1000 * 60 * 60) <=
          24;

        const formattedDate = `${parsedDate
          .getDate()
          .toString()
          .padStart(2, "0")}/${(parsedDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${parsedDate.getFullYear()} ${parsedDate
          .getHours()
          .toString()
          .padStart(2, "0")}:${parsedDate
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;

        return {
          id: booking.id || "",
          customerName: booking.customerName || "",
          description: booking.description || "",
          date: formattedDate,
          rawDate: createDate,
          consultingType: booking.type || "Trực tuyến",
          staff: staffName,
          staffId,
          status: booking.status || "pending",
          isNew: isNewBooking,
        };
      });

      console.log("Transformed bookings:", transformedData);

      const newStats = {
        total: transformedData.length,
        unassigned: transformedData.filter(
          (b) =>
            b.staff === "Chưa phân công" && b.status.toLowerCase() === "pending"
        ).length,
        online: transformedData.filter(
          (b) =>
            b.consultingType.toLowerCase() === "online" ||
            b.consultingType === "Trực tuyến"
        ).length,
        offline: transformedData.filter(
          (b) =>
            b.consultingType.toLowerCase() === "offline" ||
            b.consultingType === "Trực tiếp"
        ).length,
        pending: transformedData.filter(
          (b) => b.status.toLowerCase() === "pending"
        ).length,
        new: transformedData.filter((b) => b.isNew).length,
      };

      setBookings(transformedData);
      setFilteredBookings(transformedData);
      setStats(newStats);
      setError(null);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
      setFilteredBookings([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Cập nhật danh sách được lọc khi tab hoặc searchTerm thay đổi
  useEffect(() => {
    let result = [...bookings];

    // Lọc theo tab
    if (activeTab !== "all") {
      switch (activeTab) {
        case "unassigned":
          result = result.filter(
            (b) =>
              b.staff === "Chưa phân công" &&
              b.status.toLowerCase() === "pending"
          );
          break;
        case "online":
          result = result.filter(
            (b) =>
              b.consultingType.toLowerCase() === "online" ||
              b.consultingType === "Trực tuyến"
          );
          break;
        case "offline":
          result = result.filter(
            (b) =>
              b.consultingType.toLowerCase() === "offline" ||
              b.consultingType === "Trực tiếp"
          );
          break;
        case "pending":
          result = result.filter((b) => b.status.toLowerCase() === "pending");
          break;
        case "new":
          result = result.filter((b) => b.isNew);
          break;
        default:
          break;
      }
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.customerName.toLowerCase().includes(term) ||
          b.description.toLowerCase().includes(term) ||
          b.id.toLowerCase().includes(term)
      );
    }

    // Lọc theo khoảng thời gian
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = moment(dateRange[0]).startOf("day");
      const endDate = moment(dateRange[1]).endOf("day");

      result = result.filter((booking) => {
        if (!booking.rawDate) return false;
        const bookingDate = moment(booking.rawDate);
        return (
          bookingDate.isSameOrAfter(startDate) &&
          bookingDate.isSameOrBefore(endDate)
        );
      });
    }

    setFilteredBookings(result);
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
  }, [bookings, activeTab, searchTerm, dateRange]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleStaffChange = async (
    staffValue,
    staffName,
    recordId,
    reload = false
  ) => {
    console.log("handleStaffChange called with:", {
      staffValue,
      staffName,
      recordId,
      reload,
    });

    try {
      if (reload) {
        console.log("Reloading all bookings");
        await fetchBookings();
        return;
      }

      // Kiểm tra trạng thái của booking này trước khi cập nhật
      const booking = bookings.find((b) => b.id === recordId);
      if (
        booking &&
        booking.status &&
        booking.status.toLowerCase() === "canceled"
      ) {
        message.error("Không thể phân công cho lịch đã bị hủy!");
        return;
      }

      // Kiểm tra trạng thái đã được xác nhận chưa
      if (
        booking &&
        booking.status &&
        booking.status.toLowerCase() !== "confirmed"
      ) {
        message.error("Chỉ có thể phân công cho lịch đã được xác nhận!");
        return;
      }

      // Lưu trạng thái phân công vào localStorage để giữ lại sau khi refresh
      const assignmentData = JSON.parse(
        localStorage.getItem("staffAssignments") || "{}"
      );
      assignmentData[recordId] = { staffId: staffValue, staffName };
      localStorage.setItem("staffAssignments", JSON.stringify(assignmentData));

      // Cập nhật dữ liệu local ngay lập tức
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === recordId
            ? { ...booking, staff: staffName, staffId: staffValue }
            : booking
        )
      );

      message.success(`Đã phân công ${staffName} thành công!`);

      // Tải lại dữ liệu từ server sau khi cập nhật
      setTimeout(() => {
        fetchBookings();
      }, 1000);
    } catch (error) {
      console.error("Error updating staff:", error);
      message.error("Có lỗi xảy ra khi cập nhật dữ liệu");
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý lịch đặt hẹn"
        description="Phân công và quản lý các lịch tư vấn"
      />

      <div className="px-6 py-8">
        {/* Filter Controls - Styled elegantly */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="text-blue-600 p-2 bg-blue-50 rounded-full mr-3">
              <InfoCircleOutlined style={{ fontSize: "18px" }} />
            </div>
            <div>
              <Text strong className="text-gray-800 text-lg">
                Lọc và tìm kiếm
              </Text>
              <div className="text-gray-500 text-sm">
                Tìm kiếm và quản lý các lịch tư vấn theo tiêu chí
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center bg-gray-50 p-2 rounded-lg border border-gray-200">
              <CalendarOutlined className="text-blue-500 mr-2" />
              <DatePicker.RangePicker
                format="DD/MM/YYYY"
                placeholder={["Từ ngày", "Đến ngày"]}
                onChange={handleDateRangeChange}
                className="border-0 bg-transparent"
                allowClear={true}
                ranges={{
                  "Hôm nay": [moment().startOf("day"), moment().endOf("day")],
                  "Tuần này": [
                    moment().startOf("week"),
                    moment().endOf("week"),
                  ],
                  "Tháng này": [
                    moment().startOf("month"),
                    moment().endOf("month"),
                  ],
                }}
                value={dateRange}
              />
            </div>

            <div className="flex items-center gap-3">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Tìm kiếm..."
                className="w-full sm:w-64 rounded-lg border-gray-200 hover:border-blue-400 transition-all"
                allowClear
              />

              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={() => {
                  fetchBookings();
                  setDateRange(null);
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 rounded-lg hover:shadow-md transition-all duration-300"
              >
                Cập nhật
              </Button>
            </div>
          </div>
        </div>

        {/* Main Stats Card */}
        <Card
          className="mb-8 shadow-md border-0 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
          headStyle={{
            backgroundColor: "#f0f5ff",
            borderBottom: "2px solid #e6f7ff",
          }}
          title={
            <div className="flex items-center py-2">
              <div className="bg-blue-500 p-2 rounded-lg text-white mr-3">
                <CalendarOutlined style={{ fontSize: "18px" }} />
              </div>
              <div>
                <Title level={4} className="m-0 text-blue-600">
                  Tổng quan lịch tư vấn
                </Title>
                <Text type="secondary">
                  Theo dõi và quản lý tất cả các lịch tư vấn
                </Text>
              </div>
            </div>
          }
        >
          <div className="p-4">
            <Row gutter={[24, 24]}>
              <Col xs={12} sm={8} md={4}>
                <Card
                  className="text-center h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
                  bodyStyle={{ padding: "24px 12px" }}
                  style={{ borderTop: "3px solid #1890ff" }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <CalendarOutlined className="text-blue-500 text-xl" />
                    </div>
                  </div>
                  <Statistic
                    title={
                      <Text strong className="text-gray-600">
                        Tổng đặt lịch
                      </Text>
                    }
                    value={stats.total}
                    valueStyle={{
                      color: "#1890ff",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>

              <Col xs={12} sm={8} md={4}>
                <Card
                  className="text-center h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
                  bodyStyle={{ padding: "24px 12px" }}
                  style={{ borderTop: "3px solid #fa8c16" }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <ExclamationCircleOutlined className="text-orange-500 text-xl" />
                    </div>
                  </div>
                  <Statistic
                    title={
                      <Text strong className="text-gray-600">
                        Chưa phân công
                      </Text>
                    }
                    value={stats.unassigned}
                    valueStyle={{
                      color: "#fa8c16",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>

              <Col xs={12} sm={8} md={4}>
                <Card
                  className="text-center h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
                  bodyStyle={{ padding: "24px 12px" }}
                  style={{ borderTop: "3px solid #52c41a" }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FireOutlined className="text-green-500 text-xl" />
                    </div>
                  </div>
                  <Statistic
                    title={
                      <Text strong className="text-gray-600">
                        Mới tạo (24h)
                      </Text>
                    }
                    value={stats.new}
                    valueStyle={{
                      color: "#52c41a",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>

              <Col xs={12} sm={8} md={4}>
                <Card
                  className="text-center h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
                  bodyStyle={{ padding: "24px 12px" }}
                  style={{ borderTop: "3px solid #722ed1" }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <GlobalOutlined className="text-purple-500 text-xl" />
                    </div>
                  </div>
                  <Statistic
                    title={
                      <Text strong className="text-gray-600">
                        Tư vấn Trực tuyến
                      </Text>
                    }
                    value={stats.online}
                    valueStyle={{
                      color: "#722ed1",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>

              <Col xs={12} sm={8} md={4}>
                <Card
                  className="text-center h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
                  bodyStyle={{ padding: "24px 12px" }}
                  style={{ borderTop: "3px solid #13c2c2" }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-teal-100 p-3 rounded-full">
                      <EnvironmentOutlined className="text-teal-500 text-xl" />
                    </div>
                  </div>
                  <Statistic
                    title={
                      <Text strong className="text-gray-600">
                        Tư vấn Trực tiếp
                      </Text>
                    }
                    value={stats.offline}
                    valueStyle={{
                      color: "#13c2c2",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>

              <Col xs={12} sm={8} md={4}>
                <Card
                  className="text-center h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl overflow-hidden"
                  bodyStyle={{ padding: "24px 12px" }}
                  style={{ borderTop: "3px solid #faad14" }}
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <ClockCircleOutlined className="text-yellow-500 text-xl" />
                    </div>
                  </div>
                  <Statistic
                    title={
                      <Text strong className="text-gray-600">
                        Đang chờ
                      </Text>
                    }
                    value={stats.pending}
                    valueStyle={{
                      color: "#faad14",
                      fontSize: "28px",
                      fontWeight: "bold",
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Filter Tabs with Modern Style */}
        <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden border-0 hover:shadow-lg transition-all duration-300">
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            className="booking-tabs"
            animated={false}
            tabBarGutter={10}
            centered={false}
            type="card"
            size="large"
          >
            <TabPane
              tab={
                <Badge
                  count={stats.total}
                  offset={[10, 0]}
                  className="tab-badge"
                >
                  <Space size="small" align="center">
                    <CalendarOutlined />
                    <Text strong className="mr-2">
                      Tất cả
                    </Text>
                  </Space>
                </Badge>
              }
              key="all"
            />
            <TabPane
              tab={
                <Badge
                  count={stats.unassigned}
                  color="#fa8c16"
                  offset={[10, 0]}
                  className="tab-badge"
                >
                  <Space size="small" align="center">
                    <ExclamationCircleOutlined />
                    <Text strong className="mr-2">
                      Chưa phân công
                    </Text>
                  </Space>
                </Badge>
              }
              key="unassigned"
            />
            <TabPane
              tab={
                <Badge
                  count={stats.new}
                  color="#52c41a"
                  offset={[10, 0]}
                  className="tab-badge"
                >
                  <Space size="small" align="center">
                    <FireOutlined />
                    <Text strong className="mr-2">
                      Mới (24h)
                    </Text>
                  </Space>
                </Badge>
              }
              key="new"
            />
            <TabPane
              tab={
                <Badge
                  count={stats.online}
                  color="#722ed1"
                  offset={[10, 0]}
                  className="tab-badge"
                >
                  <Space size="small" align="center">
                    <GlobalOutlined />
                    <Text strong className="mr-2">
                      Trực tuyến
                    </Text>
                  </Space>
                </Badge>
              }
              key="online"
            />
            <TabPane
              tab={
                <Badge
                  count={stats.offline}
                  color="#13c2c2"
                  offset={[10, 0]}
                  className="tab-badge"
                >
                  <Space size="small" align="center">
                    <EnvironmentOutlined />
                    <Text strong className="mr-2">
                      Trực tiếp
                    </Text>
                  </Space>
                </Badge>
              }
              key="offline"
            />
            <TabPane
              tab={
                <Badge
                  count={stats.pending}
                  color="#faad14"
                  offset={[10, 0]}
                  className="tab-badge"
                >
                  <Space size="small" align="center">
                    <ClockCircleOutlined />
                    <Text strong className="mr-2">
                      Đang chờ
                    </Text>
                  </Space>
                </Badge>
              }
              key="pending"
            />
          </Tabs>
        </div>

        {error && <Error message={error} />}

        {loading ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <Spin size="large" />
            <div className="mt-3 text-gray-500">Đang tải dữ liệu...</div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border-0">
            <BookingTableManager
              bookings={filteredBookings.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )}
              loading={loading}
              onStaffChange={handleStaffChange}
            />

            {filteredBookings.length === 0 && !loading && (
              <div className="text-center py-16 text-gray-500">
                <ExclamationCircleOutlined style={{ fontSize: "32px" }} />
                <p className="mt-3">
                  Không tìm thấy lịch đặt hẹn nào phù hợp với tiêu chí tìm kiếm
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination with Modern Style */}
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.max(
              1,
              Math.ceil(filteredBookings.length / pageSize)
            )}
            onPageChange={handlePageChange}
          />
        </div>

        <style jsx global>{`
          .booking-modal .ant-modal-content {
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          }
          .booking-modal .ant-modal-header {
            border-bottom: 1px solid #f0f0f0;
            padding: 20px 24px;
          }
          .booking-modal .ant-modal-body {
            padding: 24px;
          }
          .booking-modal .ant-modal-footer {
            border-top: 1px solid #f0f0f0;
            padding: 16px 24px;
          }
          .booking-tabs .ant-tabs-nav {
            margin-bottom: 0;
            padding: 8px 12px 0;
          }
          .booking-tabs .ant-tabs-tab {
            padding: 12px 20px;
            border-radius: 8px 8px 0 0 !important;
            margin-right: 4px;
            transition: all 0.3s;
            overflow: visible;
          }
          .booking-tabs .ant-tabs-tab:hover {
            color: #1890ff;
            background-color: #e6f7ff;
          }
          .booking-tabs .ant-tabs-tab-active {
            background-color: #e6f7ff !important;
            border-bottom-color: #e6f7ff !important;
          }
          .booking-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #1890ff !important;
            font-weight: 600;
          }
          .ant-statistic-title {
            font-size: 14px;
            margin-bottom: 8px;
          }
          .ant-statistic-content {
            font-weight: 600;
          }
          .ant-card {
            border-radius: 12px;
            transition: all 0.3s;
          }
          .ant-table {
            border-radius: 12px;
          }
          .ant-table-thead > tr > th {
            background-color: #f9fafb;
            font-weight: 600;
          }
          .ant-btn {
            border-radius: 8px;
            height: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .ant-badge-count {
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
          }
          .ant-input-search .ant-input {
            border-radius: 8px !important;
            height: 40px;
          }
          .ant-input-search .ant-input-search-button {
            border-radius: 0 8px 8px 0 !important;
            height: 40px;
          }
          .ant-progress-text {
            font-weight: bold;
          }

          /* Định dạng cho cột ngày tháng */
          .ant-table .date-column {
            font-family: "SF Mono", Menlo, Monaco, Consolas, monospace;
            position: relative;
            white-space: nowrap;
          }

          .ant-table .date-column::before {
            content: "📅 ";
            opacity: 0.6;
          }

          .ant-table .booking-date {
            font-weight: 500;
            color: #1890ff;
          }

          .ant-table .booking-time {
            font-size: 0.85em;
            color: #52c41a;
            margin-left: 4px;
          }

          /* Hiệu ứng hover cho các dòng bảng */
          .ant-table-tbody > tr:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
            transform: translateY(-1px);
            transition: all 0.3s ease;
          }

          /* Thêm hiệu ứng cho các phần tử khác */
          .ant-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }

          /* Hiệu ứng pulse cho các badge số lượng */
          .ant-badge-count {
            transition: all 0.3s ease;
          }

          .ant-badge:hover .ant-badge-count {
            transform: scale(1.1);
            box-shadow: 0 0 8px rgba(24, 144, 255, 0.5);
          }

          .tab-badge .ant-badge-count {
            transition: all 0.3s;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
          }

          .booking-tabs .ant-tabs-tab:hover .tab-badge .ant-badge-count {
            transform: scale(1.1);
          }
        `}</style>
      </div>
    </div>
  );
};

export default BookingManagement;
