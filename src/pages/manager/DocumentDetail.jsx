import React, { useState, useEffect } from "react";
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
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  getDocumentById,
  approveDocument,
  rejectDocument,
} from "../../services/document.service";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDocumentDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getDocumentById(id);
      console.log("Document detail raw:", data);

      setDocument(data);
    } catch (error) {
      console.error("Error in fetchDocumentDetail:", error);
      setError(error.message || "Không thể tải thông tin hồ sơ");
      message.error("Không thể tải thông tin hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDocumentDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // In ra dữ liệu để debug mỗi khi document thay đổi
  useEffect(() => {
    if (document) {
      console.log("Processed document for display:", document);
      console.log("Date values:", {
        createdDate: document.createdDate,
        createDate: document.createDate,
        formattedCreatedDate: formatDate(
          document.createdDate || document.createDate
        ),
      });
    }
  }, [document]);

  useEffect(() => {
    if (document) {
      console.log("Document status:", document.status);
      console.log("Can perform actions:", canPerformActions());
    }
  }, [document]);

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  // Hàm chuyển đổi trạng thái từ API sang hiển thị UI
  const getStatusDisplay = (status) => {
    if (!status) return { label: "Không xác định", color: "default" };

    switch (status.toLowerCase()) {
      case "draft":
      case "nháp":
        return { label: "Nháp", color: "default" };
      case "published":
      case "đã xuất bản":
        return { label: "Đã xuất bản", color: "green" };
      case "under review":
      case "đang xem xét":
        return { label: "Đang xem xét", color: "yellow" };
      case "rejected":
      case "bị từ chối":
        return { label: "Bị từ chối", color: "red" };
      case "archived":
      case "đã lưu trữ":
        return { label: "Đã lưu trữ", color: "blue" };
      default:
        return { label: status, color: "default" };
    }
  };

  // Hàm xử lý phê duyệt hồ sơ
  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await approveDocument(id);
      message.success("Phê duyệt hồ sơ thành công");
      fetchDocumentDetail(); // Tải lại dữ liệu sau khi phê duyệt
    } catch (error) {
      console.error("Error approving document:", error);
      message.error(error.message || "Không thể phê duyệt hồ sơ");
    } finally {
      setActionLoading(false);
    }
  };

  // Hàm xử lý từ chối hồ sơ
  const handleReject = async () => {
    try {
      setActionLoading(true);
      await rejectDocument(id);
      message.success("Từ chối hồ sơ thành công");
      fetchDocumentDetail(); // Tải lại dữ liệu sau khi từ chối
    } catch (error) {
      console.error("Error rejecting document:", error);
      message.error(error.message || "Không thể từ chối hồ sơ");
    } finally {
      setActionLoading(false);
    }
  };

  // Kiểm tra xem có thể thực hiện hành động không
  const canPerformActions = () => {
    if (!document || !document.status) return false;
    const status = document.status.toLowerCase();
    return (
      status === "under review" ||
      status === "đang xem xét" ||
      status === "pending"
    );
  };

  return (
    <>
      <header className="h-[90px] bg-[#B4925A] flex items-center px-8">
        <h1 className="text-2xl font-semibold text-white">Chi tiết hồ sơ</h1>
      </header>

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/manager/document")}
          >
            Quay lại
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={fetchDocumentDetail}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>

        <Spin spinning={loading}>
          {error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button type="primary" onClick={fetchDocumentDetail}>
                Thử lại
              </Button>
            </div>
          ) : document ? (
            <div className="space-y-8">
              {/* Phần thông tin cơ bản */}
              <Card className="shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#B4925A]">
                    {document.documentName || "Không có tên"}
                  </h2>
                  <div className="flex items-center gap-4">
                    {document.status && (
                      <Tag color={getStatusDisplay(document.status).color}>
                        {getStatusDisplay(document.status).label}
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
                  <Descriptions.Item label="Mã hồ sơ" span={2}>
                    <span className="font-semibold text-[#B4925A]">
                      #{document.documentId || document.fengShuiDocumentId}
                    </span>
                  </Descriptions.Item>

                  <Descriptions.Item label="Mã tài liệu">
                    {document.docNo || "-"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Phiên bản">
                    {document.version || "-"}
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày tạo">
                    {formatDate(document.createdDate || document.createDate)}
                  </Descriptions.Item>

                  <Descriptions.Item label="Ngày cập nhật">
                    {formatDate(document.updatedDate || document.updateDate)}
                  </Descriptions.Item>

                  {document.createdBy && (
                    <Descriptions.Item label="Người tạo">
                      {document.createdBy}
                    </Descriptions.Item>
                  )}

                  {document.updatedBy && (
                    <Descriptions.Item label="Người cập nhật">
                      {document.updatedBy}
                    </Descriptions.Item>
                  )}

                  <Descriptions.Item label="Link hồ sơ" span={2}>
                    {document.documentUrl ? (
                      <a
                        href={document.documentUrl}
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

                  {document.description && (
                    <Descriptions.Item label="Mô tả" span={2}>
                      {document.description}
                    </Descriptions.Item>
                  )}

                  {document.category && (
                    <Descriptions.Item label="Danh mục">
                      {document.category}
                    </Descriptions.Item>
                  )}

                  {document.tags && document.tags.length > 0 && (
                    <Descriptions.Item label="Thẻ" span={2}>
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag, index) => (
                          <Tag key={index} color="blue">
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </Descriptions.Item>
                  )}
                </Descriptions>
              </Card>

              {/* Phần thông tin đặt lịch */}
              {(document.bookingOffline || document.bookingProfile) && (
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
                  {document.bookingOffline ? (
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
                                {document.bookingOffline.bookingOfflineId ||
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
                                {document.bookingOffline.customerName ||
                                  "Chưa có thông tin"}
                              </div>
                            </div>

                            <div>
                              <Text type="secondary">Chuyên gia:</Text>
                              <div className="font-medium mt-1">
                                {document.bookingOffline.masterName ||
                                  "Chưa có thông tin"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : document.bookingProfile ? (
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
                                {document.bookingProfile.bookingProfileId ||
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
                                {document.bookingProfile.customerName ||
                                  "Chưa có thông tin"}
                              </div>
                            </div>

                            <div>
                              <Text type="secondary">Chuyên gia:</Text>
                              <div className="font-medium mt-1">
                                {document.bookingProfile.masterName ||
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

              {/* Phần tệp đính kèm nếu có */}
              {document.attachments && document.attachments.length > 0 && (
                <Card
                  className="shadow-sm"
                  title={
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-medium">Tệp đính kèm</span>
                    </div>
                  }
                >
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                          STT
                        </th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                          Tên tệp
                        </th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                          Kích thước
                        </th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                          Ngày tải lên
                        </th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {document.attachments.map((attachment, index) => (
                        <tr
                          key={attachment.id || index}
                          className="hover:bg-gray-50"
                        >
                          <td className="py-3 px-6">{index + 1}</td>
                          <td className="py-3 px-6 font-medium">
                            {attachment.fileName || "-"}
                          </td>
                          <td className="py-3 px-6">
                            {attachment.fileSize
                              ? `${(attachment.fileSize / 1024).toFixed(2)} KB`
                              : "-"}
                          </td>
                          <td className="py-3 px-6">
                            {formatDate(attachment.uploadDate)}
                          </td>
                          <td className="py-3 px-6">
                            {attachment.fileUrl ? (
                              <a
                                href={attachment.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Tải xuống
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Không tìm thấy thông tin hồ sơ</p>
            </div>
          )}
        </Spin>
      </div>
    </>
  );
};

export default DocumentDetail;
