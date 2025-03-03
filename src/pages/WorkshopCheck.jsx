import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkshopTableManager from "../components/Workshop/WorkshopTableManager";
import SearchBar from "../components/Common/SearchBar";

const WorkshopCheck = () => {
  const navigate = useNavigate();
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
    navigate('/workshop-staff');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">Quản lý hội thảo</h1>
        <p className="text-white/80 text-sm">Báo cáo và tổng quan về các hội thảo</p>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="flex justify-between p-4">
            <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
              Thêm hội thảo mới
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleManageWorkshops}
                className="bg-[#00B14F] text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Quản lý hội thảo
              </button>
              <SearchBar onSearch={(term) => console.log('Đang tìm kiếm:', term)} />
            </div>
          </div>

          <div className="px-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Đã xảy ra lỗi</span>
            </div>
          </div>

          <WorkshopTableManager workshops={workshops} />
        </div>
      </div>
    </div>
  );
};

export default WorkshopCheck; 