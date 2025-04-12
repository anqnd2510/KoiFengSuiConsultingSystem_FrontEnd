import React, { useState, useEffect } from "react";
import Header from "../../components/Common/Header";
import SearchBar from "../../components/Common/SearchBar";
import CustomTable from "../../components/Common/CustomTable";
import CustomButton from "../../components/Common/CustomButton";
import Pagination from "../../components/Common/Pagination";
import { EyeOutlined } from "@ant-design/icons";
import { Tag, message, Modal, Descriptions, Spin } from "antd";
import { getPendingConfirmOrders, getOrderById, updateOrderToPaid } from "../../services/order.service";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 10;
  const navigate = useNavigate();

  // State cho modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getPendingConfirmOrders();
      
      if (response && response.data) {
        const formattedOrders = response.data.map(order => ({
          key: order.orderId,
          id: order.orderId,
          customerName: order.customerName || 'Chưa có tên',
          serviceType: order.serviceType || 'Không xác định',
          total: order.amount || 0,
          status: order.status || 'PendingConfirm',
          description: order.description || 'Không có mô tả',
          createDate: order.createdDate ? new Date(order.createdDate).toLocaleDateString('vi-VN') : 'Không xác định'
        }));
        setOrders(formattedOrders);
      } else {
        setOrders([]);
        message.info("Không có đơn hàng nào chờ xác nhận");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (err.message.includes("đăng nhập lại")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        navigate("/login");
        return;
      }
      setError(err.message);
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [navigate]);

  const handleView = async (id) => {
    try {
      setModalLoading(true);
      const response = await getOrderById(id);
      if (response && response.data) {
        setSelectedOrder(response.data);
        setIsModalVisible(true);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdatePayment = async (orderId) => {
    try {
      setModalLoading(true);
      const response = await updateOrderToPaid(orderId);
      if (response.isSuccess) {
        message.success(response.message || "Cập nhật trạng thái thanh toán thành công");
        setIsModalVisible(false);
        fetchOrders(); // Tải lại danh sách đơn hàng
      } else {
        message.error(response.message || "Có lỗi xảy ra khi cập nhật trạng thái thanh toán");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      if (error.message.includes("đăng nhập lại")) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        message.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        navigate("/login");
        return;
      }
      message.error(error.message || "Có lỗi xảy ra khi cập nhật trạng thái thanh toán");
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên khách hàng", 
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "serviceType", 
      key: "serviceType",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      render: (total) => total.toLocaleString("vi-VN") + " VNĐ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "blue";
        let text = "Đang xử lý";
        
        switch (status) {
          case "PendingConfirm":
            color = "gold";
            text = "Chờ xác nhận";
            break;
          case "Paid":
            color = "green";
            text = "Đã thanh toán";
            break;
          case "Cancelled":
            color = "red";
            text = "Đã hủy";
            break;
          default:
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      key: "createDate",
      width: 200,
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
      render: (_, record) => (
        <CustomButton
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleView(record.id)}
        >
          Xem
        </CustomButton>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Phân trang dữ liệu
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="p-0">
      <Header
        title="Quản lý đơn hàng"
        description="Xem và quản lý các đơn hàng trong hệ thống"
      />
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-end mb-6">
          <div className="w-72">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-500 bg-red-50 p-4 rounded">
            {error}
          </div>
        )}

        <CustomTable
          columns={columns}
          dataSource={paginatedOrders}
          loading={loading}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredOrders.length / pageSize)}
          onPageChange={handlePageChange}
        />
      </div>

      <Modal
        title={
          <div className="text-center border-b pb-3">
            <h2 className="text-xl font-bold mb-1">CHI TIẾT ĐƠN HÀNG</h2>
            <p className="text-gray-500">Mã đơn hàng: {selectedOrder?.orderId}</p>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          selectedOrder?.status === "PendingConfirm" ? (
            <div className="flex justify-end border-t pt-3">
              <CustomButton
                type="primary"
                onClick={() => handleUpdatePayment(selectedOrder.orderId)}
                loading={modalLoading}
              >
                Cập nhật thanh toán
              </CustomButton>
            </div>
          ) : null
        }
        width={800}
        className="invoice-modal"
      >
        {modalLoading ? (
          <div className="text-center py-5">
            <Spin size="large" />
          </div>
        ) : selectedOrder ? (
          <div className="p-4">
            {/* Thông tin khách hàng */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Thông tin khách hàng</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Tên khách hàng:</p>
                  <p className="font-medium">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Loại dịch vụ:</p>
                  <p className="font-medium">{selectedOrder.serviceType}</p>
                </div>
              </div>
            </div>

            {/* Thông tin thanh toán */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Thông tin thanh toán</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Tổng tiền:</p>
                  <p className="font-bold text-lg text-red-600">
                    {selectedOrder.amount?.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Trạng thái:</p>
                  <Tag color={selectedOrder.status === "PendingConfirm" ? "gold" : "green"} className="text-base">
                    {selectedOrder.status === "PendingConfirm" ? "Chờ xác nhận" : "Đã thanh toán"}
                  </Tag>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Mã thanh toán:</p>
                  <p className="font-medium">{selectedOrder.paymentId || "Chưa có"}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Cổng thanh toán:</p>
                  <p className="font-medium">{selectedOrder.paymentReference || "Chưa có"}</p>
                </div>
              </div>
            </div>

            {/* Thông tin đơn hàng */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Thông tin đơn hàng</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Mã đơn hàng:</p>
                  <p className="font-medium">{selectedOrder.orderCode}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Ngày tạo:</p>
                  <p className="font-medium">
                    {new Date(selectedOrder.createdDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Ngày thanh toán:</p>
                  <p className="font-medium">
                    {selectedOrder.paymentDate 
                      ? new Date(selectedOrder.paymentDate).toLocaleString("vi-VN") 
                      : "Chưa thanh toán"}
                  </p>
                </div>
              </div>
            </div>

            {/* Ghi chú và mô tả */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">Ghi chú & Mô tả</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Ghi chú:</p>
                  <p className="font-medium">{selectedOrder.note || "Không có ghi chú"}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Mô tả:</p>
                  <p className="font-medium">{selectedOrder.description || "Không có mô tả"}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>Không có dữ liệu</div>
        )}
      </Modal>
    </div>
  );
};

export default Order;
