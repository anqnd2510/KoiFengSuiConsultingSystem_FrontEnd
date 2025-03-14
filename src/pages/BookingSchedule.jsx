import React, { useState, useEffect } from "react";
import SearchBar from "../components/Common/SearchBar";
import BookingTable from "../components/Booking/BookingTable";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
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
import CustomButton from "../components/Common/CustomButton";
import { getBookingHistory, assignMaster } from "../services/booking.service";

const BookingSchedule = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [masterList, setMasterList] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getBookingHistory();

        if (response?.data && Array.isArray(response.data)) {
          const transformedData = response.data.map((booking) => ({
            id: booking.id || "",
            customerName: booking.customerName || "",
            description: booking.description || "",
            date: booking.bookingDate || "",
            consultingType: booking.type,
            master: booking.masterName || "Chưa phân công",
            status: booking.status || "pending",
          }));

          setBookings(transformedData);
          setError(null);
        } else {
          setError("Không có dữ liệu từ server");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleSearch = (searchTerm) => {
    console.log("Tìm kiếm:", searchTerm);
  };

  const handlePageChange = (page) => {
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

  const handleMasterChange = (masterValue, recordId) => {
    // Tìm tên master từ masterValue (masterId)
    const selectedMaster = masterList.find((m) => m.value === masterValue);
    const masterName = selectedMaster ? selectedMaster.label : masterValue;

    const updatedBookings = bookings.map((booking) => {
      if (booking.id === recordId) {
        return { ...booking, master: masterName };
      }
      return booking;
    });

    setBookings(updatedBookings);
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
          <BookingTable
            bookings={bookings}
            onMasterChange={handleMasterChange}
          />
        )}

        <Pagination
          currentPage={1}
          totalPages={5}
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

export default BookingSchedule;
