import React, { useState } from "react";
import SearchBar from "../components/Common/SearchBar";
import BookingTable from "../components/Booking/BookingTable";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import { Modal, Form, Input, DatePicker, TimePicker, Select } from "antd";
import CustomButton from "../components/Common/CustomButton";

const BookingSchedule = () => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      customerName: "John Smith",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyễn Trọng Mạnh",
      status: "pending",
      isOnline: true,
    },
    {
      id: 2,
      customerName: "Trần Thị B",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Chưa phân công",
      status: "done",
      isOnline: false,
    },
    {
      id: 3,
      customerName: "Lê Văn C",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Chưa phân công",
      status: "cancel",
      isOnline: true,
    },
    {
      id: 4,
      customerName: "Phạm Thị D",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyễn Trọng Mạnh",
      status: "scheduled",
      isOnline: true,
    },
    {
      id: 5,
      customerName: "Hoàng Văn E",
      description: "Chỉ số tiêu chuẩn của nước nuôi cá Koi khỏe mạnh",
      date: "9/12",
      time: "8:00-10:00",
      master: "Nguyễn Trọng Mạnh",
      status: "pending",
      isOnline: false,
    },
    // Thêm data mẫu khác
  ]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

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
    form.validateFields().then(values => {
      console.log("Form values:", values);
      handleCloseModal();
    });
  };
  
  const handleMasterChange = (masterValue, recordId) => {
    // Nếu không có giá trị, gán là "Chưa phân công"
    const finalMasterValue = masterValue || "Chưa phân công";
    
    // Cập nhật danh sách booking khi thay đổi bậc thầy
    const updatedBookings = bookings.map(booking => {
      if (booking.id === recordId) {
        return { ...booking, master: finalMasterValue };
      }
      return booking;
    });
    
    setBookings(updatedBookings);
    console.log(`Đã phân công bậc thầy ${finalMasterValue} cho lịch hẹn ${recordId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý lịch đặt hẹn"
        description="Báo cáo và tổng quan về lịch đặt hẹn"
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-6 flex justify-end items-center">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && <Error message={error} />}

        <BookingTable 
          bookings={bookings} 
          onMasterChange={handleMasterChange}
        />

        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />

        {/* Modal tạo lịch tư vấn */}
        <Modal
          title={
            <div className="text-xl font-semibold">
              Tạo lịch tư vấn
            </div>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={700}
          className="booking-modal"
        >
          <div className="p-4">
            <Form
              form={form}
              layout="vertical"
            >
              <Form.Item
                label="Mã tư vấn"
                name="consultingId"
                rules={[{ required: true, message: "Vui lòng nhập mã tư vấn" }]}
              >
                <Input placeholder="Nhập mã tư vấn" />
              </Form.Item>

              <Form.Item
                label="Thời gian bắt đầu"
                name="startTime"
                rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu" }]}
              >
                <TimePicker format="HH:mm" className="w-full" />
              </Form.Item>

              <Form.Item
                label="Thời gian kết thúc"
                name="endTime"
                rules={[{ required: true, message: "Vui lòng chọn thời gian kết thúc" }]}
              >
                <TimePicker format="HH:mm" className="w-full" />
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
                rules={[{ required: true, message: "Vui lòng chọn loại tư vấn" }]}
              >
                <Select
                  placeholder="Chọn loại tư vấn"
                  options={[
                    { value: "online", label: "Online" },
                    { value: "offline", label: "Offline" }
                  ]}
                />
              </Form.Item>
            </Form>

            <div className="flex justify-end gap-3 mt-6">
              <CustomButton onClick={handleCloseModal}>
                Hủy bỏ
              </CustomButton>
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
