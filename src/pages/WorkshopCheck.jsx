import { useState } from "react";
import WorkshopTable from "../components/Workshop/WorkshopTable";

const WorkshopCheck = () => {
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      name: "Đại Đạo Chi Giản - Phòng Thủy Cơ Học",
      location: "Đại học FPT",
      date: "1/5/2021"
    },
    // ... other workshops
  ]);

  return (
    <div className="p-6">
      <div className="bg-[#B08D57] text-white p-4 mb-4">
        <h1 className="text-xl">Check Workshops</h1>
        <p className="text-sm">View and check workshop details</p>
      </div>
      <WorkshopTable workshops={workshops} />
    </div>
  );
};

export default WorkshopCheck; 