import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/Common/SearchBar";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import CustomTable from "../components/Common/CustomTable";
import Pagination from "../components/Common/Pagination";
import { Modal } from "antd";
import { Plus } from "lucide-react";

const WorkshopCheck = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học",
      location: "Đại học FPT",
      date: "1/5/2021"
    },
    {
      id: 2,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học I",
      location: "Đại học FPT",
      date: "1/5/2021"
    },
    {
      id: 3,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học II",
      location: "Đại học FPT",
      date: "1/5/2021"
    },
    {
      id: 4,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học III",
      location: "Đại học FPT",
      date: "1/5/2021"
    }
  ]);

  const handleManageWorkshops = () => {
    try {
      navigate('/workshop-staff');
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
          <CustomButton className="!bg-transparent hover:!bg-green-50 !text-green-500 !border !border-green-500">
            Chấp thuận 
          </CustomButton>
          <CustomButton className="!bg-transparent hover:!bg-red-50 !text-red-500 !border !border-red-500">
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
              <SearchBar 
                onSearch={(term) => console.log('Đang tìm kiếm:', term)} 
              />
            </div>
          </div>

          {error && <Error message={error} />}

          <div className="p-4">
            <CustomTable 
              columns={columns}
              dataSource={workshops}
            />
          </div>

          <div className="p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>

      {/* Modal xem chi tiết hội thảo */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Chi tiết hội thảo
          </div>
        }
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
            </div>
            
            <div className="flex justify-end mt-6">
              <CustomButton onClick={handleCloseViewModal}>
                Đóng
              </CustomButton>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .workshop-detail-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
        .workshop-detail-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .workshop-detail-modal .ant-modal-body {
          padding: 12px;
        }
        .workshop-detail-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default WorkshopCheck;