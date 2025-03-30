import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, message, Button, Descriptions, Card, Tag, Divider } from "antd";
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { getContractById } from "../../services/contract.service";
import dayjs from "dayjs";

const ContractDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      case "completed":
      case "hoàn thành":
        return { label: "Hoàn thành", color: "blue" };
      case "đang hoạt động":
      case "active":
        return { label: "Đang hoạt động", color: "green" };
      case "chờ xử lý":
      case "pending":
        return { label: "Chờ xử lý", color: "yellow" };
      case "đã lưu trữ":
      case "archived":
        return { label: "Đã lưu trữ", color: "red" };
      default:
        return { label: status, color: "default" };
    }
  };

  return (
    <>
      <header className="h-[90px] bg-[#B4925A] flex items-center px-8">
        <h1 className="text-2xl font-semibold text-white">
          Chi tiết hợp đồng
        </h1>
      </header>

      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <Button 
            type="default" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/manager/contract')}
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
              <Button 
                type="primary" 
                onClick={fetchContractDetail}
              >
                Thử lại
              </Button>
            </div>
          ) : (
            contract ? (
              <Card className="shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#B4925A]">
                    {contract.contractName || "Không có tên"}
                  </h2>
                  {contract.status && (
                    <Tag color={getStatusDisplay(contract.status).color}>
                      {getStatusDisplay(contract.status).label}
                    </Tag>
                  )}
                </div>

                <Divider />

                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Mã hợp đồng" span={2}>
                    <span className="font-semibold text-[#B4925A]">#{contract.contractId}</span>
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

                {contract.contractItems && contract.contractItems.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Danh sách mục hợp đồng</h3>
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">STT</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Tên mục</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Mô tả</th>
                          <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Giá trị</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {contract.contractItems.map((item, index) => (
                          <tr key={item.id || index} className="hover:bg-gray-50">
                            <td className="py-3 px-6">{index + 1}</td>
                            <td className="py-3 px-6 font-medium">{item.name || "-"}</td>
                            <td className="py-3 px-6">{item.description || "-"}</td>
                            <td className="py-3 px-6">
                              {item.value ? item.value.toLocaleString('vi-VN') + ' VNĐ' : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            ) : (
              <div className="text-center py-8">
                <p>Không tìm thấy thông tin hợp đồng</p>
              </div>
            )
          )}
        </Spin>
      </div>
    </>
  );
};

export default ContractDetail;
