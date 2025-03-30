import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, message, Input } from "antd";
import SearchBar from "../components/Common/SearchBar";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import CustomTable from "../components/Common/CustomTable";
import Pagination from "../components/Common/Pagination";
import {
  getPendingWorkshops,
  approveWorkshop,
  formatPendingWorkshopsData,
} from "../services/approve.service";
import { rejectWorkshop } from "../services/reject.service";
import { isAuthenticated } from "../services/auth.service";

const { TextArea } = Input;

const WorkshopCheck = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    if (!isAuthenticated()) {
      message.error("Bạn cần đăng nhập để sử dụng chức năng này");
      navigate("/login");
      return;
    }
    fetchPendingWorkshops();
  }, [navigate]);

  // Hàm fetch workshops chờ phê duyệt từ API
  const fetchPendingWorkshops = async () => {
    try {
      setLoading(true);
      const data = await getPendingWorkshops();
      const formattedData = formatPendingWorkshopsData(data);
      setWorkshops(formattedData);
      setTotalPages(Math.ceil(formattedData.length / 10)); // Giả sử hiển thị 10 items mỗi trang
      setError("");
    } catch (err) {
      console.error("Lỗi khi lấy danh sách workshop chờ phê duyệt:", err);

      // Xử lý lỗi 401
      if (err.message.includes("đăng nhập")) {
        message.error(err.message);
        navigate("/login");
        return;
      }

      setError(
        "Không thể tải danh sách hội thảo chờ phê duyệt. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleManageWorkshops = () => {
    try {
      navigate("/workshop-staff");
    } catch (err) {
      setError("Không thể chuyển đến trang quản lý hội thảo");
    }
  };

  const handleViewWorkshop = (workshop) => {
    setSelectedWorkshop(workshop);
    setViewModalVisible(true);
  };

  const handleCloseViewModal = () => {
    setViewModalVisible(false);
  };

  const handleApproveWorkshop = async (workshopId) => {
    try {
      setLoading(true);
      const result = await approveWorkshop(workshopId);

      if (result) {
        message.success(
          "Đã phê duyệt hội thảo thành công. Trạng thái đã chuyển thành 'Sắp diễn ra'"
        );
        fetchPendingWorkshops(); // Refresh danh sách workshop chờ duyệt
        setViewModalVisible(false);
      } else {
        message.error("Không thể phê duyệt hội thảo. Vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error("Lỗi khi phê duyệt hội thảo:", err);

      // Xử lý lỗi 401
      if (err.message.includes("đăng nhập")) {
        message.error(err.message);
        navigate("/login");
        return;
      }

      message.error(
        "Không thể phê duyệt hội thảo: " + (err.message || "Lỗi không xác định")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRejectModal = (workshop) => {
    setSelectedWorkshop(workshop);
    setRejectModalVisible(true);
  };

  const handleCloseRejectModal = () => {
    setRejectModalVisible(false);
    setRejectReason("");
  };

  const handleRejectWorkshop = async () => {
    if (!selectedWorkshop) return;

    try {
      setLoading(true);
      // Gọi API từ chối workshop, lưu ý API mới không sử dụng lý do từ chối
      const result = await rejectWorkshop(selectedWorkshop.id, rejectReason);

      if (result.success) {
        message.success(result.message || "Đã từ chối hội thảo thành công");
        // Lưu lý do từ chối vào localStorage để hiển thị sau này nếu cần
        try {
          const rejectionHistory = JSON.parse(
            localStorage.getItem("rejectionHistory") || "{}"
          );
          rejectionHistory[selectedWorkshop.id] = {
            reason: rejectReason,
            timestamp: new Date().toISOString(),
            workshopName: selectedWorkshop.name,
          };
          localStorage.setItem(
            "rejectionHistory",
            JSON.stringify(rejectionHistory)
          );
        } catch (e) {
          console.error("Không thể lưu lý do từ chối vào localStorage:", e);
        }

        fetchPendingWorkshops(); // Refresh danh sách
        setRejectModalVisible(false);
        setRejectReason("");
      } else {
        message.error(
          result.message || "Không thể từ chối hội thảo. Vui lòng thử lại sau."
        );
      }
    } catch (err) {
      console.error("Lỗi khi từ chối hội thảo:", err);

      // Xử lý lỗi 401
      if (err.message && err.message.includes("đăng nhập")) {
        message.error(err.message);
        navigate("/login");
        return;
      }

      message.error(
        err.message || "Không thể từ chối hội thảo. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    // Xử lý tìm kiếm ở đây
    console.log("Đang tìm kiếm:", searchTerm);
  };

  const columns = [
    {
      title: "Mã hội thảo",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên hội thảo",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, workshop) => (
        <div className="flex gap-2">
          <CustomButton
            className="!bg-blue-500 hover:!bg-blue-600 text-white"
            onClick={() => handleViewWorkshop(workshop)}
          >
            Xem
          </CustomButton>
          <CustomButton
            className="!bg-transparent hover:!bg-green-50 !text-green-500 !border !border-green-500"
            onClick={() => handleApproveWorkshop(workshop.id)}
            loading={loading}
          >
            Chấp thuận
          </CustomButton>
          <CustomButton
            className="!bg-transparent hover:!bg-red-50 !text-red-500 !border !border-red-500"
            onClick={() => handleOpenRejectModal(workshop)}
          >
            Từ chối
          </CustomButton>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý hội thảo"
        description="Báo cáo và tổng quan về hội thảo của bạn"
      />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="flex justify-end p-4">
            <div className="flex items-center gap-4">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {error && <Error message={error} />}

          <div className="p-4">
            <CustomTable
              columns={columns}
              dataSource={workshops}
              loading={loading}
            />
          </div>

          <div className="p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {/* Modal xem chi tiết hội thảo */}
      <Modal
        title={<div className="text-xl font-semibold">Chi tiết hội thảo</div>}
        open={viewModalVisible}
        onCancel={handleCloseViewModal}
        footer={null}
        width={600}
        className="workshop-detail-modal"
      >
        {selectedWorkshop && (
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 mb-1">Mã hội thảo</p>
                <p className="font-medium">{selectedWorkshop.id}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Tên hội thảo</p>
                <p className="font-medium">{selectedWorkshop.name}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Địa điểm</p>
                <p className="font-medium">{selectedWorkshop.location}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Ngày tổ chức</p>
                <p className="font-medium">{selectedWorkshop.date}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Giá vé</p>
                <p className="font-medium">{selectedWorkshop.ticketPrice}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Số lượng vé</p>
                <p className="font-medium">{selectedWorkshop.ticketSlots}</p>
              </div>

              {selectedWorkshop.description && (
                <div>
                  <p className="text-gray-500 mb-1">Mô tả</p>
                  <p className="font-medium">{selectedWorkshop.description}</p>
                </div>
              )}

              {selectedWorkshop.masterName && (
                <div>
                  <p className="text-gray-500 mb-1">Master phụ trách</p>
                  <p className="font-medium">{selectedWorkshop.masterName}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <CustomButton
                className="!bg-transparent hover:!bg-red-50 !text-red-500 !border !border-red-500"
                onClick={() => {
                  handleCloseViewModal();
                  handleOpenRejectModal(selectedWorkshop);
                }}
              >
                Từ chối
              </CustomButton>
              <CustomButton
                className="!bg-green-500 hover:!bg-green-600 text-white"
                onClick={() => handleApproveWorkshop(selectedWorkshop.id)}
                loading={loading}
              >
                Chấp thuận
              </CustomButton>
              <CustomButton onClick={handleCloseViewModal}>Đóng</CustomButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal từ chối hội thảo */}
      <Modal
        title={<div className="text-xl font-semibold">Từ chối hội thảo</div>}
        open={rejectModalVisible}
        onCancel={handleCloseRejectModal}
        footer={null}
        width={500}
        className="workshop-reject-modal"
      >
        <div className="p-4">
          <p className="mb-4">
            Vui lòng nhập lý do từ chối hội thảo "{selectedWorkshop?.name}"
          </p>

          <TextArea
            rows={4}
            placeholder="Nhập lý do từ chối..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />

          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseRejectModal}>Hủy bỏ</CustomButton>
            <CustomButton
              className="!bg-red-500 hover:!bg-red-600 text-white"
              onClick={handleRejectWorkshop}
              loading={loading}
              disabled={!rejectReason.trim()}
            >
              Xác nhận từ chối
            </CustomButton>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .workshop-detail-modal .ant-modal-content,
        .workshop-reject-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .workshop-detail-modal .ant-modal-header,
        .workshop-reject-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .workshop-detail-modal .ant-modal-body,
        .workshop-reject-modal .ant-modal-body {
          padding: 12px;
        }
        .workshop-detail-modal .ant-modal-footer,
        .workshop-reject-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default WorkshopCheck;
