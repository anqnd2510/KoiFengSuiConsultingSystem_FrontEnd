import { useState } from "react";
import { Link } from "react-router-dom";
import WorkshopTable from "../components/Workshop/WorkshopTable";

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

  return (
    <div className="p-6">
      <div className="bg-[#B08D57] text-white p-4 mb-4">
        <h1 className="text-xl">Workshops Management </h1>
        <p className="text-sm">Reports and overview of your workshops</p>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search content..."
          className="w-full px-4 py-2 border rounded mb-4"
        />
        <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
          🔍
        </button>
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