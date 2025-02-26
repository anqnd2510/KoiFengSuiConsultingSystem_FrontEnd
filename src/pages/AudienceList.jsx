import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/Common/SearchBar";
import Audience from '../components/Workshop/Audience';

const AudienceList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const workshopId = queryParams.get("workshopId");

  const [audiences, setAudiences] = useState([
    {
      id: "T01",
      name: "John Smith",
      phone: "1234567890",
      email: "Johnsmith@gmail.com",
      date: "1/1/2021",
      status: "Checked in"
    },
    {
      id: "T02",
      name: "John Smith",
      phone: "1234567890",
      email: "Johnsmith@gmail.com",
      date: "1/1/2021",
      status: "Pending"
    },
    {
      id: "T03",
      name: "John Smith",
      phone: "1234567890",
      email: "Johnsmith@gmail.com",
      date: "1/1/2021",
      status: "Absent"
    },
    {
      id: "T04",
      name: "John Smith",
      phone: "1234567890",
      email: "Johnsmith@gmail.com",
      date: "1/1/2021",
      status: "Pending"
    }
  ]);

  const [error, setError] = useState(true);

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Checked in":
        return "bg-green-500 text-white px-2 py-1 rounded";
      case "Pending":
        return "bg-blue-500 text-white px-2 py-1 rounded";
      case "Absent":
        return "bg-red-500 text-white px-2 py-1 rounded";
      default:
        return "";
    }
  };

  return (
    <div className="p-6">
      <div className="bg-[#B08D57] text-white p-4 mb-4">
        <h1 className="text-xl">Workshop's audiences</h1>
        <p className="text-sm">Reports and all audiences from checked in the workshop</p>
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
              <th className="py-2 px-4 border">Ticket ID</th>
              <th className="py-2 px-4 border">Customer Name</th>
              <th className="py-2 px-4 border">Phone</th>
              <th className="py-2 px-4 border">Gmail</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {audiences.map((audience) => (
              <tr key={audience.id}>
                <td className="py-2 px-4 border text-center">{audience.id}</td>
                <td className="py-2 px-4 border">{audience.name}</td>
                <td className="py-2 px-4 border">{audience.phone}</td>
                <td className="py-2 px-4 border">{audience.email}</td>
                <td className="py-2 px-4 border text-center">{audience.date}</td>
                <td className="py-2 px-4 border text-center">
                  <span className={getStatusClassName(audience.status)}>
                    {audience.status}
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

export default AudienceList;
