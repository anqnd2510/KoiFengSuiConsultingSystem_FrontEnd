import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../../components/Common/SearchBar";
import BookingTableManager from "../../components/Booking/BookingTableManager";
import Pagination from "../../components/Common/Pagination";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Spin,
  message,
} from "antd";
import CustomButton from "../../components/Common/CustomButton";
import { getBookingHistory } from "../../services/booking.service";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBookingHistory();
      console.log("Booking API response:", response);

      // Lấy dữ liệu phân công từ localStorage
      const assignmentData = JSON.parse(
        localStorage.getItem("staffAssignments") || "{}"
      );
      console.log("Local assignments:", assignmentData);

      if (response?.data && Array.isArray(response.data)) {
        const transformedData = response.data.map((booking) => {
          console.log("Processing booking:", booking);

          // Kiểm tra nếu có dữ liệu phân công trong localStorage
          const localAssignment = assignmentData[booking.id];

          // Ưu tiên dữ liệu từ API, nếu không có thì dùng localStorage
          const hasStaff = booking.staffName && booking.staffName.trim() !== "";
          const staffName = hasStaff
            ? booking.staffName
            : localAssignment
            ? localAssignment.staffName
            : "Chưa phân công";
          const staffId =
            booking.staffId ||
            (localAssignment ? localAssignment.staffId : null);

          return {
            id: booking.id || "",
            customerName: booking.customerName || "",
            description: booking.description || "",
            date: booking.bookingDate || "",
            consultingType: booking.type || "Online",
            staff: staffName,
            staffId: staffId,
            status: booking.status || "pending",
          };
        });

        console.log("Transformed bookings:", transformedData);
        setBookings(transformedData);
        setError(null);
      } else {
        setError("Không có dữ liệu từ server");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleSearch = (searchTerm) => {
    console.log("Tìm kiếm:", searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Chuyển đến trang:", page);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log("Form values:", values);
      handleCloseModal();
    });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý lịch đặt hẹn"
        description="Báo cáo và tổng quan về lịch đặt hẹn"
      />

      <div className="p-6">
        <div className="mb-6 flex justify-end items-center">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && <Error message={error} />}

        {loading ? (
          <div className="text-center py-4">
            <Spin size="large" />
          </div>
        ) : (
          <BookingTableManager
            bookings={bookings}
            loading={loading}
            onStaffChange={handleStaffChange}
          />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(bookings.length / pageSize))}
          onPageChange={handlePageChange}
        />

        <Modal
          title={<div className="text-xl font-semibold">Tạo lịch tư vấn</div>}
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={700}
          className="booking-modal"
        >
          <div className="p-4">
            <Form form={form} layout="vertical">
              <Form.Item
                label="Mã tư vấn"
                name="consultingId"
                rules={[{ required: true, message: "Vui lòng nhập mã tư vấn" }]}
              >
                <Input placeholder="Nhập mã tư vấn" />
              </Form.Item>

              <Form.Item
                label="Ngày"
                name="date"
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="Loại tư vấn"
                name="type"
                rules={[
                  { required: true, message: "Vui lòng chọn loại tư vấn" },
                ]}
              >
                <Select
                  placeholder="Chọn loại tư vấn"
                  options={[
                    { value: "online", label: "Online" },
                    { value: "offline", label: "Offline" },
                  ]}
                />
              </Form.Item>
            </Form>

            <div className="flex justify-end gap-3 mt-6">
              <CustomButton onClick={handleCloseModal}>Hủy bỏ</CustomButton>
              <CustomButton type="primary" onClick={handleSave}>
                Tạo mới
              </CustomButton>
            </div>
          </div>
        </Modal>

        <style jsx global>{`
          .booking-modal .ant-modal-content {
            border-radius: 12px;
            overflow: hidden;
          }
          .booking-modal .ant-modal-header {
            border-bottom: 1px solid #f0f0f0;
            padding: 16px 24px;
          }
          .booking-modal .ant-modal-body {
            padding: 12px;
          }
          .booking-modal .ant-modal-footer {
            border-top: 1px solid #f0f0f0;
          }
        `}</style>
      </div>
    </div>
  );
};

export default BookingManagement;
