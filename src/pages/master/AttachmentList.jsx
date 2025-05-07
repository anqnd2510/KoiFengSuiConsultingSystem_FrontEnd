import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Common/Pagination";
import { Link } from "react-router-dom";
import { FaDownload, FaEye } from "react-icons/fa";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import CustomDatePicker from "../../components/Common/CustomDatePicker";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { message, Tag, Select } from "antd";
import CustomTable from "../../components/Common/CustomTable";
import { getAllAttachmentsByMaster } from "../../services/attachment.service";

const AttachmentList = () => {
  const [attachments, setAttachments] = useState([]);
  const [filteredAttachments, setFilteredAttachments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const navigate = useNavigate();

  useEffect(() => {
    fetchAttachments();
  }, [currentPage, selectedDate]);

  useEffect(() => {
    filterAttachments();
  }, [attachments, statusFilter]);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        pageSize: 10,
        date: selectedDate.format("YYYY-MM-DD"),
      };

      const response = await getAllAttachmentsByMaster(params);

      const formattedData = response.data.map((attachment, index) => ({
        key: attachment.attachmentId || `attachment-${index}`,
        id: attachment.attachmentId,
        docNo: attachment.docNo || `DOC_${index}`,
        attachmentName: attachment.attachmentName || "Không có tên",
        status: attachment.status || "Pending",
        attachmentUrl: attachment.attachmentUrl || "",
        createdAt: attachment.createdAt
          ? dayjs(attachment.createdAt).format("DD-MM-YYYY")
          : dayjs().format("DD-MM-YYYY"),
      }));

      setAttachments(formattedData);

      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách biên bản nghiệm thu:", err);
      setError(
        "Không thể tải danh sách biên bản nghiệm thu. Vui lòng thử lại sau."
      );
      message.error("Không thể tải danh sách biên bản nghiệm thu");
    } finally {
      setLoading(false);
    }
  };

  const filterAttachments = () => {
    if (statusFilter === "all") {
      setFilteredAttachments(attachments);
    } else {
      setFilteredAttachments(
        attachments.filter((attachment) => attachment.status === statusFilter)
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Confirmed":
        return "success";
      case "VefifyingOTP":
        return "processing";
      case "Success":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ duyệt";
      case "Confirmed":
        return "Đã duyệt";
      case "VefifyingOTP":
        return "Đang xác thực OTP";
      case "Success":
        return "Hoàn thành";
      case "Cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const handleViewAttachment = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      message.error("Không tìm thấy đường dẫn biên bản");
    }
  };

  const handleDownloadAttachment = async (url, name) => {
    if (!url) {
      message.error("Không tìm thấy đường dẫn biên bản");
      return;
    }

    try {
      message.loading({ content: "Đang tải biên bản...", key: "download" });

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name || "attachment.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

      message.success({ content: "Tải xuống thành công", key: "download" });
    } catch (error) {
      console.error("Lỗi khi tải xuống biên bản:", error);
      message.error({
        content: "Không thể tải xuống biên bản. Vui lòng thử lại sau.",
        key: "download",
      });
    }
  };

  const columns = [
    {
      title: "Mã biên bản",
      dataIndex: "docNo",
      key: "docNo",
      render: (text) => (
        <span className="font-semibold text-[#B4925A]">{text}</span>
      ),
      width: "15%",
    },
    {
      title: "Tên biên bản",
      dataIndex: "attachmentName",
      key: "attachmentName",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
      width: "35%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span className="text-gray-600 text-sm">{text}</span>,
      width: "15%",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          className="px-3 py-1 text-xs font-medium rounded-full"
        >
          {getStatusText(status)}
        </Tag>
      ),
      width: "15%",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewAttachment(record.attachmentUrl)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
            title="Xem biên bản"
          >
            <FaEye />
          </button>
          <button
            onClick={() =>
              handleDownloadAttachment(
                record.attachmentUrl,
                record.attachmentName
              )
            }
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
            title="Tải xuống"
          >
            <FaDownload />
          </button>
        </div>
      ),
      width: "20%",
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <Header
        title="Biên bản nghiệm thu"
        description="Quản lý các biên bản nghiệm thu đã tạo"
      />

      <div className="p-6 md:p-8">
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 border-b border-gray-100">
            <div className="border-b border-gray-200 mb-4 md:mb-0">
              <div className="flex gap-1">
                <button
                  onClick={() => navigate("/master/consulting-offline")}
                  className="px-4 md:px-8 py-3 font-medium text-base text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  Yêu cầu tư vấn
                </button>
                <button
                  onClick={() => navigate("/master/document")}
                  className="px-4 md:px-8 py-3 font-medium text-base text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  Hồ sơ
                </button>
                <div
                  className="px-4 md:px-8 py-3 font-medium text-base relative transition-all duration-200 text-[#B4925A] border-[#B4925A] cursor-pointer"
                  onClick={() => navigate("/master/attachments")}
                >
                  <span>Biên bản nghiệm thu</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B4925A]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 200 }}
                placeholder="Lọc theo trạng thái"
              >
                <Select.Option value="all">Tất cả trạng thái</Select.Option>
                <Select.Option value="Pending">Chờ duyệt</Select.Option>
                <Select.Option value="Confirmed">Đã duyệt</Select.Option>
                <Select.Option value="VefifyingOTP">
                  Đang xác thực OTP
                </Select.Option>
                <Select.Option value="Success">Hoàn thành</Select.Option>
                <Select.Option value="Cancelled">Đã hủy</Select.Option>
              </Select>
              <CustomDatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
              />
            </div>
          </div>

          <div className="p-4 md:p-6">
            {error && <Error message={error} />}

            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <CustomTable
                columns={columns}
                dataSource={filteredAttachments}
                loading={loading}
                className="custom-table"
                rowClassName="hover:bg-gray-50 transition-colors"
              />
            </div>

            <div className="flex justify-end mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentList;
