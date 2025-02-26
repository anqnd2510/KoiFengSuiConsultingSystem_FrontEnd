import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/Common/SearchBar";

const WorkshopStaff = () => {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Checked in"
    },
    {
      id: 2,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học I",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Checking"
    },
    {
      id: 3,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học II",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Reject"
    },
    {
      id: 4,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học III",
      master: "John Smith",
      location: "FPT University",
      date: "1/1/2021",
      status: "Cancel"
    }
  ]);

  const [error, setError] = useState(true);

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const handleRowClick = (workshop) => {
    if (workshop.status === "Checked in") {
      navigate(`/audience?workshopId=${workshop.id}`);
    }
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Checked in":
        return "bg-green-500 text-white px-2 py-1 rounded";
      case "Checking":
        return "bg-yellow-500 text-white px-2 py-1 rounded";
      case "Reject":
        return "bg-gray-500 text-white px-2 py-1 rounded";
      case "Cancel":
        return "bg-red-500 text-white px-2 py-1 rounded";
      default:
        return "";
    }
  };

  const getRowClassName = (status) => {
    return status === "Checked in" ? "cursor-pointer hover:bg-gray-100" : "";
  };

  return (
    <div className="p-6">
      <div className="bg-[#B08D57] text-white p-4 mb-4">
        <h1 className="text-xl">Workshops Management</h1>
        <p className="text-sm">Reports and overview of your workshops</p>
      </div>

      <div className="flex justify-end mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="font-bold">Error</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border">Workshop ID</th>
              <th className="py-2 px-4 border">Workshop Name</th>
              <th className="py-2 px-4 border">Master Name</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {workshops.map((workshop) => (
              <tr 
                key={workshop.id} 
                className={getRowClassName(workshop.status)} 
                onClick={() => handleRowClick(workshop)}
              >
                <td className="py-2 px-4 border text-center">{workshop.id}</td>
                <td className="py-2 px-4 border">{workshop.name}</td>
                <td className="py-2 px-4 border">{workshop.master}</td>
                <td className="py-2 px-4 border">{workshop.location}</td>
                <td className="py-2 px-4 border text-center">{workshop.date}</td>
                <td className="py-2 px-4 border text-center">
                  <span className={getStatusClassName(workshop.status)}>
                    {workshop.status}
                  </span>
                </td>
              </tr>
            ))}
            {/* Thêm các hàng trống để giữ layout giống như trong hình */}
            {[...Array(5)].map((_, index) => (
              <tr key={`empty-${index}`}>
                <td className="py-2 px-4 border"></td>
                <td className="py-2 px-4 border"></td>
                <td className="py-2 px-4 border"></td>
                <td className="py-2 px-4 border"></td>
                <td className="py-2 px-4 border"></td>
                <td className="py-2 px-4 border"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <button className="bg-gray-300 px-4 py-2 rounded">Previous</button>
        <button className="bg-gray-200 px-4 py-2 rounded">1</button>
        <button className="bg-gray-200 px-4 py-2 rounded">2</button>
        <button className="bg-gray-200 px-4 py-2 rounded">3</button>
        <span className="px-2 py-2">...</span>
        <button className="bg-gray-200 px-4 py-2 rounded">99</button>
        <button className="bg-gray-300 px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
};

export default WorkshopStaff; 