import React, { useState, useEffect } from "react";
import { Tag, Modal, Form, Input, DatePicker, Select, message, Space, Image, Tabs } from "antd";
import Header from "../../components/Common/Header";
import SearchBar from "../../components/Common/SearchBar";
import CustomButton from "../../components/Common/CustomButton";
import CustomTable from "../../components/Common/CustomTable";
import Pagination from "../../components/Common/Pagination";
import BackButton from "../../components/Common/BackButton";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { getWaitingForRefundOrders } from "../../services/order.service";
import { generateRefundCode, getManagerRefundedList, confirmRefund } from "../../services/payment.service";

const { TextArea } = Input;
const { TabPane } = Tabs;

const Refund = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [refundedCurrentPage, setRefundedCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [refundedSearchQuery, setRefundedSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refundedLoading, setRefundedLoading] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [refundData, setRefundData] = useState([]);
  const [refundedData, setRefundedData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [refundedTotalPages, setRefundedTotalPages] = useState(1);
  const [refundQRCode, setRefundQRCode] = useState(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [refundedServiceTypeFilter, setRefundedServiceTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("1");
  const [apiError, setApiError] = useState(false);

  const fetchRefundOrders = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await getWaitingForRefundOrders();
      
      if (response && response.data) {
        console.log("API response data:", response.data);
        const formattedData = response.data.map(order => {
          return {
            id: order.orderId,
            customerId: order.customerId || order.CustomerId,
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
        
        setRefundData(formattedData);
        setTotalPages(Math.ceil(formattedData.length / 10));
      } else {
        setRefundData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching refund orders:", error);
      setRefundData([]);
      setTotalPages(1);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefundedOrders = async () => {
    if (refundedLoading) return;
    
    try {
      setRefundedLoading(true);
      const response = await getManagerRefundedList();
      
      if (response && response.isSuccess) {
        console.log("Refunded API response data:", response.data);
        if (response.data && response.data.length > 0) {
          const formattedData = response.data.map(order => {
            return {
              id: order.orderId,
              customerId: order.customerId,
              customerName: order.customerName,
              serviceType: order.serviceType,
              amount: order.amount,
              status: "Chờ khách hàng xác nhận",
              createdAt: new Date(order.createDate).toLocaleDateString("vi-VN"),
              description: order.description || "Không có mô tả",
              paymentId: order.paymentId,
              refundDate: order.paymentDate ? new Date(order.paymentDate).toLocaleDateString("vi-VN") : null,
              paymentDate: order.paymentDate ? new Date(order.paymentDate).toLocaleDateString("vi-VN") : null,
              note: order.note
            };
          });
          console.log("Formatted refunded data:", formattedData);
          setRefundedData(formattedData);
          setRefundedTotalPages(Math.ceil(formattedData.length / 10));
        } else {
          // Không có dữ liệu phù hợp
          console.log("Không tìm thấy đơn hàng đã hoàn tiền");
          setRefundedData([]);
          setRefundedTotalPages(1);
        }
      } else if (response) {
        // Trường hợp API trả về lỗi
        console.log("API trả về lỗi:", response.message);
        setRefundedData([]);
        setRefundedTotalPages(1);
      } else {
        console.log("API trả về response không hợp lệ");
        setRefundedData([]);
        setRefundedTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching refunded orders:", error);
      setRefundedData([]);
      setRefundedTotalPages(1);
      setApiError(true);
    } finally {
      setRefundedLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setApiError(false);
        
        // Tải dữ liệu đơn hàng chờ hoàn tiền
        await fetchRefundOrders();
        
        // Nếu tab hiện tại là tab danh sách đã hoàn tiền, thì mới gọi API
        if (activeTab === "2") {
          await fetchRefundedOrders();
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setApiError(true);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "2" && refundedData.length === 0 && !refundedLoading && !apiError) {
      fetchRefundedOrders();
    }
  }, [activeTab]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setRefundedCurrentPage(1);
  };

  const handleViewDetails = (record) => {
    setSelectedRefund(record);
    setRefundQRCode(null);
    setIsViewModalVisible(true);
  };

  const handleGenerateRefundCode = async () => {
    if (!selectedRefund) return;
    
    // Nếu đã có mã QR, chỉ hiển thị lại mã đã có
    if (refundQRCode) {
      return;
    }
    
    try {
      setGeneratingCode(true);
      console.log("Sending refund request with:", {
        orderId: selectedRefund.id,
        customerId: selectedRefund.customerId
      });
      const response = await generateRefundCode(selectedRefund.id, selectedRefund.customerId);
      console.log("QR code response:", response);
      
      if (response.isSuccess && response.data && response.data.customerRefundQR) {
        // Thêm timestamp để tránh cache
        const qrImageUrl = `${response.data.customerRefundQR}${response.data.customerRefundQR.includes('?') ? '&' : '?'}t=${Date.now()}`;
        setRefundQRCode(qrImageUrl);
        message.success("Đã tạo mã hoàn tiền thành công");
      } else {
        setApiError(true);
        message.error(response.message || "Không nhận được mã QR từ máy chủ");
      }
    } catch (error) {
      console.error("Refund error:", error);
      setApiError(true);
      message.error("Có lỗi xảy ra khi tạo mã hoàn tiền. Vui lòng thử lại sau");
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleServiceTypeFilter = (value) => {
    setServiceTypeFilter(value);
    setCurrentPage(1);
    setRefundedCurrentPage(1);
  };

  const handleRefundedServiceTypeFilter = (value) => {
    setRefundedServiceTypeFilter(value);
    setRefundedCurrentPage(1);
  };

  const getFilteredData = () => {
    if (activeTab === "1") {
      return refundData.filter(item =>
        (serviceTypeFilter === "all" || item.serviceType === serviceTypeFilter) &&
        Object.values(item).some(val =>
          val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      return refundedData.filter(item =>
        (refundedServiceTypeFilter === "all" || item.serviceType === refundedServiceTypeFilter) &&
        Object.values(item).some(val =>
          val?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  };

  const filteredData = getFilteredData();
  const paginatedData = activeTab === "1" 
    ? filteredData.slice((currentPage - 1) * 10, currentPage * 10)
    : filteredData.slice((refundedCurrentPage - 1) * 10, refundedCurrentPage * 10);

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
      render: (serviceType) => {
        switch (serviceType) {
          case "BookingOnline":
            return "Tư vấn trực tuyến";
          case "BookingOffline":
            return "Tư vấn trực tiếp";
          case "Course":
            return "Khóa học";
          case "RegisterAttend":
            return "Tham dự hội thảo";
          default:
            return serviceType;
        }
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      width: "10%",
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
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: "10%",
    },
    {
      title: "Thao tác",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <CustomButton
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            className="mr-1"
          >
            Xem
          </CustomButton>
          {record.status === "Chờ hoàn tiền" && (
            <CustomButton
              type="primary"
              size="small"
              onClick={() => handleConfirmRefund(record)}
              className="bg-green-500 hover:bg-green-600"
            >
              Xác nhận
            </CustomButton>
          )}
        </Space>
      ),
    },
  ];

  const refundedColumns = [
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
      width: "15%",
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "serviceType",
      key: "serviceType",
      width: "15%",
      render: (serviceType) => {
        switch (serviceType) {
          case "BookingOnline":
            return "Tư vấn trực tuyến";
          case "BookingOffline":
            return "Tư vấn trực tiếp";
          case "Course":
            return "Khóa học";
          case "RegisterAttend":
            return "Tham dự hội thảo";
          default:
            return serviceType;
        }
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "amount",
      key: "amount",
      width: "10%",
      render: (amount) => (
        <span>{amount.toLocaleString("vi-VN")} đ</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status) => (
        <Tag color="green">
          {status}
        </Tag>
      ),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      width: "10%",
    },
    {
      title: "Ngày hoàn tiền",
      dataIndex: "refundDate",
      key: "refundDate",
      width: "10%",
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

  const handleRefresh = () => {
    if (activeTab === "1") {
      fetchRefundOrders();
    } else {
      fetchRefundedOrders();
    }
    message.success("Đã cập nhật dữ liệu mới nhất");
  };

  const handleConfirmRefund = async (record) => {
    try {
      const confirmModal = Modal.confirm({
        title: "Xác nhận hoàn tiền",
        content: `Bạn có chắc chắn muốn xác nhận hoàn tiền cho đơn hàng "${record.id}" của khách hàng "${record.customerName}" không?`,
        okText: "Xác nhận",
        cancelText: "Hủy",
        okButtonProps: {
          className: "bg-blue-500"
        },
        onOk: async () => {
          confirmModal.update({
            okButtonProps: {
              loading: true,
              className: "bg-blue-500"
            },
            cancelButtonProps: {
              disabled: true
            }
          });
          
          try {
            const response = await confirmRefund(record.id);
            
            if (response.isSuccess) {
              message.success("Xác nhận hoàn tiền thành công");
              // Làm mới dữ liệu
              fetchRefundOrders();
              fetchRefundedOrders();
            } else {
              message.error(response.message || "Xác nhận hoàn tiền thất bại");
            }
          } catch (error) {
            console.error("Error confirming refund:", error);
            message.error("Có lỗi xảy ra khi xác nhận hoàn tiền");
          }
        }
      });
    } catch (error) {
      console.error("Error confirming refund:", error);
      message.error("Có lỗi xảy ra khi xác nhận hoàn tiền");
    }
  };

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
                <CustomButton 
                  onClick={() => {
                    if (activeTab === "1") {
                      if (!loading) {
                        fetchRefundOrders();
                        message.success("Đã làm mới danh sách chờ hoàn tiền");
                      } else {
                        message.info("Đang tải dữ liệu, vui lòng đợi");
                      }
                    } else {
                      if (!refundedLoading) {
                        fetchRefundedOrders();
                        message.success("Đã làm mới danh sách đã hoàn tiền");
                      } else {
                        message.info("Đang tải dữ liệu, vui lòng đợi");
                      }
                    }
                  }}
                  icon={<ReloadOutlined />}
                  disabled={loading || refundedLoading}
                >
                  Làm mới
                </CustomButton>
              </div>
              <div className="flex gap-3">
                <Select
                  value={serviceTypeFilter}
                  onChange={handleServiceTypeFilter}
                  style={{ width: 180 }}
                  options={[
                    { value: "all", label: "Tất cả loại dịch vụ" },
                    { value: "BookingOnline", label: "Tư vấn trực tuyến" },
                    { value: "BookingOffline", label: "Tư vấn trực tiếp" },
                    { value: "Course", label: "Khóa học" },
                    { value: "RegisterAttend", label: "Tham dự hội thảo" },
                  ]}
                  className="mr-2"
                />
                <div className="w-72">
                  <SearchBar onSearch={handleSearch} />
                </div>
              </div>
            </div>

            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab}
              type="card"
              className="mb-4"
            >
              <TabPane tab="Yêu cầu hoàn tiền" key="1">
              </TabPane>
              <TabPane tab="Danh sách hoàn tiền" key="2">
              </TabPane>
            </Tabs>

            {activeTab === "1" ? (
              loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="bg-white rounded-lg">
                  <div className="text-center py-8">
                    <p className="text-gray-500">Không có đơn hàng đang chờ hoàn tiền</p>
                  </div>
                </div>
              ) : (
                <>
                  <CustomTable
                    columns={columns}
                    dataSource={paginatedData}
                    loading={loading}
                    pagination={false}
                  />

                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(filteredData.length / 10)}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </>
              )
            ) : (
              refundedLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <div className="bg-white rounded-lg">
                  <div className="text-center py-8">
                    <p className="text-gray-500">Không có đơn hàng đã hoàn tiền</p>
                  </div>
                </div>
              ) : (
                <>
                  <CustomTable
                    columns={refundedColumns}
                    dataSource={paginatedData}
                    loading={refundedLoading}
                    pagination={false}
                  />

                  <div className="mt-4">
                    <Pagination
                      currentPage={refundedCurrentPage}
                      totalPages={Math.ceil(filteredData.length / 10)}
                      onPageChange={setRefundedCurrentPage}
                    />
                  </div>
                </>
              )
            )}
          </div>
        </div>
      </div>

      <Modal
        title={<div className="text-xl font-semibold">Chi tiết yêu cầu hoàn tiền</div>}
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Space key="footer">
            {selectedRefund && selectedRefund.status === "Chờ hoàn tiền" && (
              <CustomButton
                type="primary"
                onClick={handleGenerateRefundCode}
                loading={generatingCode}
              >
                {refundQRCode ? "Hiển thị mã hoàn tiền" : "Tạo mã hoàn tiền"}
              </CustomButton>
            )}
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
                <p className="font-medium">
                  {(() => {
                    switch (selectedRefund.serviceType) {
                      case "BookingOnline":
                        return "Tư vấn trực tuyến";
                      case "BookingOffline":
                        return "Tư vấn trực tiếp";
                      case "Course":
                        return "Khóa học";
                      case "RegisterAttend":
                        return "Tham dự hội thảo";
                      default:
                        return selectedRefund.serviceType;
                    }
                  })()}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Tổng tiền</p>
                <p className="font-medium">{selectedRefund.amount.toLocaleString("vi-VN")} đ</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Trạng thái</p>
                <Tag color={selectedRefund.status === "Đã hoàn tiền" ? "green" : "gold"}>
                  {selectedRefund.status}
                </Tag>
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
              {selectedRefund.refundDate && (
                <div>
                  <p className="text-gray-500 mb-1">Ngày hoàn tiền</p>
                  <p className="font-medium">{selectedRefund.refundDate}</p>
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

            {refundQRCode && selectedRefund.status === "Chờ hoàn tiền" && (
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
