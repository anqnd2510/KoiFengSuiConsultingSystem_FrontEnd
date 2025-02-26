import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WorkshopTable from "../components/Workshop/WorkshopTable";
import SearchBar from "../components/Common/SearchBar";
import AddWorkshopButton from "../components/Workshop/AddWorkshopButton";
import CreateWorkshopModal from "../components/Workshop/CreateWorkshopModal";
import ViewWorkshopModal from "../components/Workshop/ViewWorkshopModal";
import Pagination from "../components/Common/Pagination";

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
  const [currentPage, setCurrentPage] = useState(1);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log("Changing to page:", page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">Workshops Management</h1>
        <p className="text-white/80 text-sm">Reports and overview of your workshops</p>
      </div>

      {/* Main Content */}
      <div id="main-content" className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <AddWorkshopButton onClick={handleOpenCreateModal} />
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Error message */}
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="font-bold">Error</span>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <WorkshopTable 
            workshops={workshops} 
            onViewWorkshop={handleViewWorkshop}
          />
        </div>
        
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={5}
            onPageChange={handlePageChange}
          />
        </div>
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