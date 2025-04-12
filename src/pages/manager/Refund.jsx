import React, { useState, useEffect } from "react";
import { Tag, Modal, Form, Input, DatePicker, Select, message, Space, Image } from "antd";
import Header from "../../components/Common/Header";
import SearchBar from "../../components/Common/SearchBar";
import CustomButton from "../../components/Common/CustomButton";
import CustomTable from "../../components/Common/CustomTable";
import Pagination from "../../components/Common/Pagination";
import BackButton from "../../components/Common/BackButton";
import { EyeOutlined } from "@ant-design/icons";
import { getWaitingForRefundOrders } from "../../services/order.service";
import { generateRefundCode } from "../../services/payment.service";

const { TextArea } = Input;

const Refund = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [refundData, setRefundData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [refundQRCode, setRefundQRCode] = useState(null);
  const [generatingCode, setGeneratingCode] = useState(false);

  const fetchRefundOrders = async () => {
    try {
      setLoading(true);
      const response = await getWaitingForRefundOrders();
      if (response.data) {
        console.log("API response data:", response.data);
        const formattedData = response.data.map(order => {
          console.log("Customer ID from API:", order.customerId, order.CustomerId);
          return {
            id: order.orderId,
            customerId: order.customerId || order.CustomerId, // Thử cả hai trường hợp
            customerName: order.customerName,
            serviceType: order.serviceType,
            amount: order.amount,
            status: "Chờ hoàn tiền",
            createdAt: new Date(order.createDate).toLocaleDateString("vi-VN"),
            description: order.description || "Không có mô tả",
            paymentId: order.paymentId,
            paymentDate: order.paymentDate ? new Date(order.paymentDate).toLocaleDateString("vi-VN") : null,
            note: order.note
          };
        });
        console.log("Formatted data:", formattedData);
        setRefundData(formattedData);
        setTotalPages(Math.ceil(formattedData.length / 10));
      }
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundOrders();
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (record) => {
    setSelectedRefund(record);
    setRefundQRCode(null);
    setIsViewModalVisible(true);
  };

  const handleGenerateRefundCode = async () => {
    if (!selectedRefund) return;
    
    try {
      setGeneratingCode(true);
      console.log("Sending refund request with:", {
        orderId: selectedRefund.id,
        customerId: selectedRefund.customerId
      });
      const response = await generateRefundCode(selectedRefund.id, selectedRefund.customerId);
      console.log("QR code response:", response.data);
      
      if (response.data && response.data.customerRefundQR) {
        // Thêm timestamp để tránh cache
        const qrImageUrl = `${response.data.customerRefundQR}${response.data.customerRefundQR.includes('?') ? '&' : '?'}t=${Date.now()}`;
        setRefundQRCode(qrImageUrl);
        message.success("Đã tạo mã hoàn tiền thành công");
      } else {
        message.error("Không nhận được mã QR từ máy chủ");
      }
    } catch (error) {
      console.error("Refund error:", error);
      message.error(error.message || "Có lỗi xảy ra khi tạo mã hoàn tiền");
    } finally {
      setGeneratingCode(false);
    }
  };

  const filteredData = refundData.filter(item =>
    Object.values(item).some(val =>
      val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedData = filteredData.slice((currentPage - 1) * 10, currentPage * 10);

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
      width: "15%",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: "20%",
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "serviceType",
      key: "serviceType",
      width: "15%",
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      width: "15%",
      render: (amount) => (
        <span>{amount.toLocaleString("vi-VN")} đ</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <Tag color="gold">
          {status}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
    },
    {
      title: "Thao tác",
      key: "action",
      width: "10%",
      render: (_, record) => (
        <CustomButton
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Xem
        </CustomButton>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý hoàn tiền"
        description="Xem và quản lý các yêu cầu hoàn tiền"
      />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
              </div>
              <div className="w-72">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

            <CustomTable
              columns={columns}
              dataSource={paginatedData}
              loading={loading}
              pagination={false}
            />

            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal
        title={<div className="text-xl font-semibold">Chi tiết yêu cầu hoàn tiền</div>}
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Space key="footer">
            <CustomButton
              type="primary"
              onClick={handleGenerateRefundCode}
              loading={generatingCode}
              disabled={!!refundQRCode}
            >
              {refundQRCode ? "Đã tạo mã hoàn tiền" : "Tạo mã hoàn tiền"}
            </CustomButton>
            <CustomButton
              onClick={() => setIsViewModalVisible(false)}
            >
              Đóng
            </CustomButton>
          </Space>
        ]}
        width={700}
      >
        {selectedRefund && (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-500 mb-1">Mã giao dịch</p>
                <p className="font-medium">{selectedRefund.id}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Tên khách hàng</p>
                <p className="font-medium">{selectedRefund.customerName}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Loại dịch vụ</p>
                <p className="font-medium">{selectedRefund.serviceType}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Tổng tiền</p>
                <p className="font-medium">{selectedRefund.amount.toLocaleString("vi-VN")} đ</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Trạng thái</p>
                <Tag color="gold">{selectedRefund.status}</Tag>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày tạo</p>
                <p className="font-medium">{selectedRefund.createdAt}</p>
              </div>
              {selectedRefund.paymentDate && (
                <div>
                  <p className="text-gray-500 mb-1">Ngày thanh toán</p>
                  <p className="font-medium">{selectedRefund.paymentDate}</p>
                </div>
              )}
              {selectedRefund.paymentId && (
                <div>
                  <p className="text-gray-500 mb-1">Mã thanh toán</p>
                  <p className="font-medium">{selectedRefund.paymentId}</p>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <p className="text-gray-500 mb-1">Mô tả</p>
              <p className="font-medium bg-gray-50 p-4 rounded-lg">
                {selectedRefund.description}
              </p>
            </div>

            {selectedRefund.note && (
              <div className="mb-4">
                <p className="text-gray-500 mb-1">Ghi chú</p>
                <p className="font-medium bg-gray-50 p-4 rounded-lg">
                  {selectedRefund.note}
                </p>
              </div>
            )}

            {refundQRCode && (
              <div className="mt-4">
                <p className="text-gray-500 mb-2">Mã QR hoàn tiền</p>
                <div className="flex justify-center">
                  <iframe 
                    src={refundQRCode}
                    title="QR Code hoàn tiền"
                    width="220"
                    height="220"
                    className="border rounded-lg"
                    style={{ border: "1px solid #eee" }}
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Quét mã QR để thực hiện hoàn tiền
                </p>
                <p className="text-center text-xs text-gray-400 mt-1">
                  <a href={refundQRCode} target="_blank" rel="noopener noreferrer">
                    Mở trong tab mới
                  </a>
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Refund;
