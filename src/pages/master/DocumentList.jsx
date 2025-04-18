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
import { message, Tag } from "antd";
import CustomTable from "../../components/Common/CustomTable";
import { getAllDocumentsByMaster } from "../../services/document.service";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, [currentPage, selectedDate]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        pageSize: 10,
        date: selectedDate.format("YYYY-MM-DD"),
      };

      const response = await getAllDocumentsByMaster(params);

      const formattedData = response.data.map((doc, index) => ({
        key: doc.fengShuiDocumentId || `doc-${index}`,
        id: doc.fengShuiDocumentId,
        docNo: doc.docNo || `FS_${index}`,
        documentName: doc.documentName || "Không có tên",
        status: doc.status || "Đã tạo",
        version: doc.version || "1.0",
        documentUrl: doc.documentUrl || "",
        createdAt: doc.createdAt
          ? dayjs(doc.createdAt).format("DD-MM-YYYY")
          : dayjs().format("DD-MM-YYYY"),
      }));

      setDocuments(formattedData);

      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách hồ sơ:", err);
      setError("Không thể tải danh sách hồ sơ. Vui lòng thử lại sau.");
      message.error("Không thể tải danh sách hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "ConfirmedByManager":
        return "processing";
      case "CancelledByManager":
        return "error";
      case "CancelledByCustomer":
        return "error";
      case "Success":
        return "success";
      default:
        return "default";
    }
  };

  const handleViewDocument = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      message.error("Không tìm thấy đường dẫn tài liệu");
    }
  };

  const handleDownloadDocument = async (url, name) => {
    if (!url) {
      message.error("Không tìm thấy đường dẫn tài liệu");
      return;
    }

    try {
      message.loading({ content: "Đang tải tài liệu...", key: "download" });

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name || "document.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

      message.success({ content: "Tải xuống thành công", key: "download" });
    } catch (error) {
      console.error("Lỗi khi tải xuống tài liệu:", error);
      message.error({
        content: "Không thể tải xuống tài liệu. Vui lòng thử lại sau.",
        key: "download",
      });
    }
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "docNo",
      key: "docNo",
      render: (text) => (
        <span className="font-semibold text-[#B4925A]">{text}</span>
      ),
      width: "15%",
    },
    {
      title: "Tên tài liệu",
      dataIndex: "documentName",
      key: "documentName",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
      width: "30%",
    },
    {
      title: "Phiên bản",
      dataIndex: "version",
      key: "version",
      render: (text) => <span className="text-gray-600">{text}</span>,
      width: "10%",
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
          {status}
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
            onClick={() => handleViewDocument(record.documentUrl)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
            title="Xem tài liệu"
          >
            <FaEye />
          </button>
          <button
            onClick={() =>
              handleDownloadDocument(record.documentUrl, record.documentName)
            }
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
            title="Tải xuống"
          >
            <FaDownload />
          </button>
        </div>
      ),
      width: "15%",
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <Header
        title="Hồ sơ phong thủy"
        description="Quản lý các hồ sơ phong thủy đã tạo"
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
                <div
                  className="px-4 md:px-8 py-3 font-medium text-base relative transition-all duration-200 text-[#B4925A] border-[#B4925A] cursor-pointer"
                  onClick={() => navigate("/master/document")}
                >
                  <span>Hồ sơ</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B4925A]" />
                </div>
                <button
                  onClick={() => navigate("/master/attachments")}
                  className="px-4 md:px-8 py-3 font-medium text-base text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  Biên bản nghiệm thu
                </button>
              </div>
            </div>

            <CustomDatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>

          <div className="p-4 md:p-6">
            {error && <Error message={error} />}

            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <CustomTable
                columns={columns}
                dataSource={documents}
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

export default DocumentList;
