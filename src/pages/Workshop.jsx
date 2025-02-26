import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WorkshopTable from "../components/Workshop/WorkshopTable";
import SearchBar from "../components/Common/SearchBar";
import AddWorkshopButton from "../components/Workshop/AddWorkshopButton";
import CreateWorkshopModal from "../components/Workshop/CreateWorkshopModal";
import ViewWorkshopModal from "../components/Workshop/ViewWorkshopModal";

const Workshop = () => {
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học",
      location: "Đại học FPT",
      date: "1/5/2021",
      image: "workshop1.jpg",
      ticketPrice: "300.000 VND",
      ticketSlots: "50",
      status: "Đang diễn ra"
    },
    {
      id: 2,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học I",
      location: "Đại học FPT",
      date: "1/5/2021",
      image: "workshop2.jpg",
      ticketPrice: "350.000 VND",
      ticketSlots: "45",
      status: "Sắp diễn ra"
    },
    {
      id: 3,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học II",
      location: "Đại học FPT",
      date: "1/5/2021",
      image: "workshop3.jpg",
      ticketPrice: "400.000 VND",
      ticketSlots: "40",
      status: "Đã kết thúc"
    },
    {
      id: 4,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học III",
      location: "Đại học FPT",
      date: "1/5/2021",
      image: "workshop4.jpg",
      ticketPrice: "450.000 VND",
      ticketSlots: "35",
      status: "Sắp diễn ra"
    }
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  // Thêm hiệu ứng để làm mờ nội dung chính khi modal mở
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      if (isCreateModalOpen || isViewModalOpen) {
        mainContent.style.filter = 'blur(2px)';
      } else {
        mainContent.style.filter = 'none';
      }
    }
  }, [isCreateModalOpen, isViewModalOpen]);

  const handleSearch = (searchTerm) => {
    // Xử lý tìm kiếm ở đây
    console.log('Searching for:', searchTerm);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleViewWorkshop = (workshop) => {
    setSelectedWorkshop(workshop);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedWorkshop(null);
  };

  const handleSaveWorkshop = (workshopData) => {
    // Xử lý lưu workshop mới
    console.log('Saving workshop:', workshopData);
    setIsCreateModalOpen(false);
  };

  const handleRequestWorkshop = () => {
    // Xử lý yêu cầu workshop mới
    console.log('Requesting new workshop');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-6">
      <div id="main-content">
        <div className="bg-[#B08D57] text-white p-4 mb-4">
          <h1 className="text-xl">Workshops Management </h1>
          <p className="text-sm">Reports and overview of your workshops</p>
        </div>

        <div className="flex justify-between mb-8">
          <AddWorkshopButton onClick={handleOpenCreateModal} />
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Error message */}
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="font-bold">Error</span>
        </div>

        <WorkshopTable 
          workshops={workshops} 
          onViewWorkshop={handleViewWorkshop}
        />
      </div>

      <CreateWorkshopModal 
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onSave={handleSaveWorkshop}
        onRequest={handleRequestWorkshop}
      />

      <ViewWorkshopModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        workshop={selectedWorkshop}
      />
    </div>
  );
};

export default Workshop; 