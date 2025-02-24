import { useState } from "react";
import { Link } from "react-router-dom";
import WorkshopTable from "../components/Workshop/WorkshopTable";
import SearchBar from "../components/Common/SearchBar";

const Workshop = () => {
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học",
      location: "Đại học FPT",
      date: "1/5/2021"
    },
    {
      id: 2,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học I",
      location: "Đại học FPT",
      date: "1/5/2021"
    },
    {
      id: 3,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học II",
      location: "Đại học FPT",
      date: "1/5/2021"
    },
    {
      id: 4,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học III",
      location: "Đại học FPT",
      date: "1/5/2021"
    }
  ]);

  const handleSearch = (searchTerm) => {
    // Xử lý tìm kiếm ở đây
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="p-6">
      <div className="bg-[#B08D57] text-white p-4 mb-4">
        <h1 className="text-xl">Workshops Management </h1>
        <p className="text-sm">Reports and overview of your workshops</p>
      </div>

      <div className="flex justify-end mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Error message */}
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <span className="font-bold">Error</span>
      </div>

      <WorkshopTable workshops={workshops} />
    </div>
  );
};

export default Workshop; 