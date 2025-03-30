import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, message, Button, Descriptions, Card, Tag, Divider, Empty, Typography } from "antd";
import { ArrowLeftOutlined, ReloadOutlined, FileTextOutlined, UserOutlined, ScheduleOutlined } from '@ant-design/icons';
import { getAttachmentById } from "../../services/attachment.service";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const AttachmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttachmentDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAttachmentById(id);
      console.log("Attachment detail raw:", data);
      
      setAttachment(data);
    } catch (error) {
      console.error("Error in fetchAttachmentDetail:", error);
      setError(error.message || "Không thể tải thông tin biên bản nghiệm thu");
      message.error("Không thể tải thông tin biên bản nghiệm thu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAttachmentDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // In ra dữ liệu để debug mỗi khi attachment thay đổi
  useEffect(() => {
    if (attachment) {
      console.log("Processed attachment for display:", attachment);
      console.log("Date values:", {
        createdDate: attachment.createdDate,
        createDate: attachment.createDate,
        formattedCreatedDate: formatDate(attachment.createdDate || attachment.createDate)
      });
    }
  }, [attachment]);

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  };

  // Hàm chuyển đổi trạng thái từ API sang hiển thị UI
  const getStatusDisplay = (status) => {
    if (!status) return { label: "Không xác định", color: "default" };
    
    switch (status.toLowerCase()) {
      case "active":
      case "đang hoạt động":
        return { label: "Đang hoạt động", color: "green" };
      case "pending":
      case "chờ xử lý":
        return { label: "Chờ xử lý", color: "yellow" };
      case "archived":
      case "đã lưu trữ":
        return { label: "Đã lưu trữ", color: "red" };
      case "completed":
      case "hoàn thành":
        return { label: "Hoàn thành", color: "blue" };
      default:
        return { label: status, color: "default" };
    }
  };

  return (
    <>
      <header className="h-[90px] bg-[#B4925A] flex items-center px-8">
        <h1 className="text-2xl font-semibold text-white">
          Chi tiết biên bản nghiệm thu
        </h1>
      </header>

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            type="default" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/manager/attachment')}
          >
            Quay lại
          </Button>

          <Button 
            icon={<ReloadOutlined />} 
            onClick={fetchAttachmentDetail}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>

        <Spin spinning={loading}>
          {error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">{error}</div>
              <Button 
                type="primary" 
                onClick={fetchAttachmentDetail}
              >
                Thử lại
              </Button>
            </div>
          ) : (
            attachment ? (
              <div className="space-y-8">
                {/* Phần thông tin cơ bản */}
                <Card className="shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-[#B4925A]">
                      {attachment.attachmentName || "Không có tên"}
                    </h2>
                    {attachment.status && (
                      <Tag color={getStatusDisplay(attachment.status).color}>
                        {getStatusDisplay(attachment.status).label}
                      </Tag>
                    )}
                  </div>

                  <Divider />

                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="Mã biên bản" span={2}>
                      <span className="font-semibold text-[#B4925A]">#{attachment.attachmentId}</span>
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Mã tài liệu">
                      {attachment.docNo || "-"}
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Ngày tạo">
                      {formatDate(attachment.createdDate || attachment.createDate)}
                    </Descriptions.Item>
                    
                    <Descriptions.Item label="Ngày cập nhật">
                      {formatDate(attachment.updatedDate || attachment.updateDate)}
                    </Descriptions.Item>
                    
                    {attachment.createdBy && (
                      <Descriptions.Item label="Người tạo">
                        {attachment.createdBy}
                      </Descriptions.Item>
                    )}
                    
                    {attachment.updatedBy && (
                      <Descriptions.Item label="Người cập nhật">
                        {attachment.updatedBy}
                      </Descriptions.Item>
                    )}
                    
                    <Descriptions.Item label="Link tài liệu" span={2}>
                      {attachment.attachmentUrl ? (
                        <a 
                          href={attachment.attachmentUrl} 
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
                    
                    {attachment.description && (
                      <Descriptions.Item label="Mô tả" span={2}>
                        {attachment.description}
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>

                {/* Phần thông tin dự án */}
                {attachment.project && (
                  <Card 
                    className="shadow-sm" 
                    title={
                      <div className="flex items-center space-x-2">
                        <FileTextOutlined className="text-[#B4925A]" />
                        <span className="text-lg font-medium">Thông tin dự án</span>
                      </div>
                    }
                  >
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                          <div className="flex items-center space-x-2 mb-3">
                            <Title level={5} className="m-0">Chi tiết dự án</Title>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <Text type="secondary">Mã dự án:</Text>
                              <div className="font-medium mt-1">
                                {attachment.project?.projectId || "-"}
                              </div>
                            </div>
                            
                            <div>
                              <Text type="secondary">Tên dự án:</Text>
                              <div className="font-medium mt-1">
                                {attachment.project?.projectName || "-"}
                              </div>
                            </div>
                            
                            <div>
                              <Text type="secondary">Trạng thái dự án:</Text>
                              <div className="font-medium mt-1">
                                {attachment.project?.status || "-"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                          <div className="flex items-center space-x-2 mb-3">
                            <Title level={5} className="m-0">Thời gian dự án</Title>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <Text type="secondary">Ngày bắt đầu:</Text>
                              <div className="font-medium mt-1">
                                {formatDate(attachment.project?.startDate) || "-"}
                              </div>
                            </div>
                            
                            <div>
                              <Text type="secondary">Ngày kết thúc:</Text>
                              <div className="font-medium mt-1">
                                {formatDate(attachment.project?.endDate) || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Phần thông tin khách hàng và đối tác */}
                {(attachment.customer || attachment.partner) && (
                  <Card 
                    className="shadow-sm" 
                    title={
                      <div className="flex items-center space-x-2">
                        <UserOutlined className="text-[#B4925A]" />
                        <span className="text-lg font-medium">Thông tin khách hàng & đối tác</span>
                      </div>
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {attachment.customer && (
                        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                          <div className="flex items-center space-x-2 mb-3">
                            <Title level={5} className="m-0">Thông tin khách hàng</Title>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <Text type="secondary">Tên khách hàng:</Text>
                              <div className="font-medium mt-1">
                                {attachment.customer.name || "-"}
                              </div>
                            </div>
                            
                            <div>
                              <Text type="secondary">Email:</Text>
                              <div className="font-medium mt-1">
                                {attachment.customer.email || "-"}
                              </div>
                            </div>
                            
                            <div>
                              <Text type="secondary">Số điện thoại:</Text>
                              <div className="font-medium mt-1">
                                {attachment.customer.phone || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {attachment.partner && (
                        <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                          <div className="flex items-center space-x-2 mb-3">
                            <Title level={5} className="m-0">Thông tin đối tác</Title>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <Text type="secondary">Tên đối tác:</Text>
                              <div className="font-medium mt-1">
                                {attachment.partner.name || "-"}
                              </div>
                            </div>
                            
                            <div>
                              <Text type="secondary">Email:</Text>
                              <div className="font-medium mt-1">
                                {attachment.partner.email || "-"}
                              </div>
                            </div>
                            
                            <div>
                              <Text type="secondary">Số điện thoại:</Text>
                              <div className="font-medium mt-1">
                                {attachment.partner.phone || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Phần tệp đính kèm nếu có */}
                {attachment.files && attachment.files.length > 0 && (
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
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">STT</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Tên tệp</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Kích thước</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Ngày tải lên</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Hành động</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {attachment.files.map((file, index) => (
                          <tr key={file.id || index} className="hover:bg-gray-50">
                            <td className="py-3 px-6">{index + 1}</td>
                            <td className="py-3 px-6 font-medium">{file.fileName || "-"}</td>
                            <td className="py-3 px-6">{file.fileSize ? `${(file.fileSize / 1024).toFixed(2)} KB` : "-"}</td>
                            <td className="py-3 px-6">{formatDate(file.uploadDate)}</td>
                            <td className="py-3 px-6">
                              {file.fileUrl ? (
                                <a 
                                  href={file.fileUrl}
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
                <p>Không tìm thấy thông tin biên bản nghiệm thu</p>
              </div>
            )
          )}
        </Spin>
      </div>
    </>
  );
};

export default AttachmentDetail;
