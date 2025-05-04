import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spin,
  message,
  Button,
  Descriptions,
  Card,
  Tag,
  Divider,
  Empty,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  UserOutlined,
  BookOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import {
  getContractById,
  approveContract,
  rejectContract,
} from "../../services/contract.service";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchContractDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getContractById(id);
      console.log("Contract detail:", data);

      setContract(data);
    } catch (error) {
      console.error("Error in fetchContractDetail:", error);
      setError(error.message || "Không thể tải thông tin hợp đồng");
      message.error("Không thể tải thông tin hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchContractDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  // Hàm chuyển đổi trạng thái từ API sang hiển thị UI
  const getStatusDisplay = (status) => {
    if (!status) return { label: "Không xác định", color: "default" };

    switch (status.toLowerCase()) {
      case "pending":
        return {
          label: "Chờ xử lý",
          color: "warning",
        };
      case "contractrejectedbymanager":
        return {
          label: "Bị từ chối bởi quản lý",
          color: "error",
        };
      case "contractrejectedbycustomer":
        return {
          label: "Bị từ chối bởi khách hàng",
          color: "error",
        };
      case "contractapprovedbymanager":
        return {
          label: "Được duyệt bởi quản lý",
          color: "processing",
        };
      case "verifyingotp":
        return {
          label: "Đang xác thực OTP",
          color: "purple",
        };
      case "firstpaymentpending":
        return {
          label: "Chờ thanh toán lần đầu",
          color: "orange",
        };
      case "firstpaymentsuccess":
        return {
          label: "Đã thanh toán lần đầu",
          color: "success",
        };
      default:
        return { label: status, color: "default" };
    }
  };

  // Hàm xử lý phê duyệt hợp đồng
  const handleApprove = async () => {
    try {
      setActionLoading(true);
      // Gọi API phê duyệt hợp đồng
      await approveContract(id);

      message.success("Hợp đồng đã được phê duyệt thành công");
      // Tải lại thông tin hợp đồng sau khi phê duyệt
      await fetchContractDetail();
    } catch (error) {
      console.error("Lỗi khi phê duyệt hợp đồng:", error);
      message.error("Không thể phê duyệt hợp đồng. Vui lòng thử lại sau.");
    } finally {
      setActionLoading(false);
    }
  };

  // Hàm xử lý từ chối hợp đồng
  const handleReject = async () => {
    try {
      setActionLoading(true);
      // Gọi API từ chối hợp đồng
      await rejectContract(id);

      message.success("Hợp đồng đã bị từ chối");
      // Tải lại thông tin hợp đồng sau khi từ chối
      await fetchContractDetail();
    } catch (error) {
      console.error("Lỗi khi từ chối hợp đồng:", error);
      message.error("Không thể từ chối hợp đồng. Vui lòng thử lại sau.");
    } finally {
      setActionLoading(false);
    }
  };

  // Kiểm tra xem có thể thực hiện hành động không (chỉ cho phép khi trạng thái là "pending")
  const canPerformActions = () => {
    if (!contract || !contract.status) return false;
    const status = contract.status.toLowerCase();
    return status === "pending";
  };

  return (
    <>
      <header className="h-[90px] bg-[#B4925A] flex items-center px-8">
        <h1 className="text-2xl font-semibold text-white">Chi tiết hợp đồng</h1>
      </header>

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/manager/contract")}
          >
            Quay lại
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={fetchContractDetail}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>

        <Spin spinning={loading}>
          {error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button type="primary" onClick={fetchContractDetail}>
                Thử lại
              </Button>
            </div>
          ) : contract ? (
            <div className="space-y-8">
              <Card className="shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#B4925A]">
                    {contract.contractName || "Không có tên"}
                  </h2>
                  <div className="flex items-center gap-4">
                    {contract.status && (
                      <Tag color={getStatusDisplay(contract.status).color}>
                        {getStatusDisplay(contract.status).label}
                      </Tag>
                    )}

                    {/* Thêm nút Approve/Reject */}
                    {canPerformActions() && (
                      <div className="flex gap-3">
                        <Button
                          type="primary"
                          className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 shadow-md transition-all duration-300 flex items-center"
                          onClick={handleApprove}
                          loading={actionLoading}
                          icon={<span className="mr-1">✓</span>}
                        >
                          Phê duyệt
                        </Button>
                        <Button
                          danger
                          className="shadow-md transition-all duration-300 flex items-center"
                          onClick={handleReject}
                          loading={actionLoading}
                          icon={<span className="mr-1">✕</span>}
                        >
                          Từ chối
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Divider />

                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Mã hợp đồng" span={2}>
                    <span className="font-semibold text-[#B4925A]">
                      #{contract.contractId}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Mã tài liệu">
                    {contract.docNo || "-"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày tạo">
                    {formatDate(contract.createdDate)}
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày cập nhật">
                    {formatDate(contract.updatedDate)}
                  </Descriptions.Item>

                  {/* Nếu API không trả về trường createdBy, ẩn phần này đi */}
                  {contract.createdBy && (
                    <Descriptions.Item label="Người tạo">
                      {contract.createdBy || "-"}
                    </Descriptions.Item>
                  )}

                  <Descriptions.Item label="Link hợp đồng" span={2}>
                    {contract.contractURL || contract.contractUrl ? (
                      <a
                        href={contract.contractURL || contract.contractUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Xem tài liệu
                      </a>
                    ) : (
                      "-"
                    )}
                  </Descriptions.Item>

                  {contract.note && (
                    <Descriptions.Item label="Ghi chú" span={2}>
                      {contract.note}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>

              {/* Tạo khoảng cách giữa các phần */}
              <div className="h-8"></div>

              {/* Phần thông tin đặt lịch */}
              {(contract.bookingOffline || contract.bookingProfile) && (
                <Card
                  className="shadow-sm"
                  title={
                    <div className="flex items-center space-x-2">
                      <ScheduleOutlined className="text-[#B4925A]" />
                      <span className="text-lg font-medium">
                        Thông tin đặt lịch
                      </span>
                    </div>
                  }
                >
                  {contract.bookingOffline ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                          <div className="flex items-center space-x-2 mb-3">
                            <BookOutlined className="text-lg text-[#B4925A]" />
                            <Title level={5} className="m-0">
                              Thông tin đặt lịch
                            </Title>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <Text type="secondary">Mã đặt lịch:</Text>
                              <div className="font-medium mt-1">
                                {contract.bookingOffline.bookingOfflineId ||
                                  "-"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                          <div className="flex items-center space-x-2 mb-3">
                            <UserOutlined className="text-lg text-[#B4925A]" />
                            <Title level={5} className="m-0">
                              Thông tin người tham gia
                            </Title>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <Text type="secondary">Khách hàng:</Text>
                              <div className="font-medium mt-1">
                                {contract.bookingOffline.customerName ||
                                  "Chưa có thông tin"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : contract.bookingProfile ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                          <div className="flex items-center space-x-2 mb-3">
                            <BookOutlined className="text-lg text-[#B4925A]" />
                            <Title level={5} className="m-0">
                              Thông tin đặt lịch
                            </Title>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <Text type="secondary">Mã đặt lịch:</Text>
                              <div className="font-medium mt-1">
                                {contract.bookingProfile.bookingProfileId ||
                                  "-"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                          <div className="flex items-center space-x-2 mb-3">
                            <UserOutlined className="text-lg text-[#B4925A]" />
                            <Title level={5} className="m-0">
                              Thông tin người tham gia
                            </Title>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <Text type="secondary">Khách hàng:</Text>
                              <div className="font-medium mt-1">
                                {contract.bookingProfile.customerName ||
                                  "Chưa có thông tin"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Empty description="Không có thông tin đặt lịch" />
                  )}
                </Card>
              )}

              {/* Tạo khoảng cách trước phần danh sách mục hợp đồng nếu có */}
              {contract.contractItems && contract.contractItems.length > 0 && (
                <>
                  <div className="h-8"></div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Danh sách mục hợp đồng
                    </h3>
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                            STT
                          </th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                            Tên mục
                          </th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                            Mô tả
                          </th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                            Giá trị
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {contract.contractItems.map((item, index) => (
                          <tr
                            key={item.id || index}
                            className="hover:bg-gray-50"
                          >
                            <td className="py-3 px-6">{index + 1}</td>
                            <td className="py-3 px-6 font-medium">
                              {item.name || "-"}
                            </td>
                            <td className="py-3 px-6">
                              {item.description || "-"}
                            </td>
                            <td className="py-3 px-6">
                              {item.value
                                ? item.value.toLocaleString("vi-VN") + " VNĐ"
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Không tìm thấy thông tin hợp đồng</p>
            </div>
          )}
        </Spin>
      </div>
    </>
  );
};

export default ContractDetail;
