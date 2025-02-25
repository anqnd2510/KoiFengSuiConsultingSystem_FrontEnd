import { useState } from "react";
import WorkshopTableManager from "../components/Workshop/WorkshopTableManager";
import SearchBar from "../components/Common/SearchBar";

const WorkshopCheck = () => {
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

  return (
    <div className="p-6">
      <div className="bg-[#B08D57] text-white p-4">
        <h1 className="text-2xl font-semibold">Workshops Management</h1>
        <p className="text-sm">Reports and overview of your workshops</p>
      </div>

      <div className="bg-white rounded-lg shadow mt-4">
        <div className="flex justify-between p-4">
          <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
            Add new workshops
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search content..."
              className="border border-gray-300 rounded-lg px-4 py-2 pr-10"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Error</span>
          </div>
        </div>

        <WorkshopTableManager workshops={workshops} />
      </div>
    </div>
  );
};

export default WorkshopCheck; 