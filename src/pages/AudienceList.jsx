import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";

const AudienceList = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const workshopId = queryParams.get("workshopId");
  const [currentPage, setCurrentPage] = useState(1);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Checked in":
        return "bg-green-500 text-white px-3 py-1 rounded-sm";
      case "Pending":
        return "bg-yellow-400 text-black px-3 py-1 rounded-sm";
      case "Absent":
        return "bg-red-500 text-white px-3 py-1 rounded-sm";
      default:
        return "bg-gray-500 text-white px-3 py-1 rounded-sm";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">Workshop's audiences</h1>
        <p className="text-white/80 text-sm">Reports and all audiences from checked in the workshop</p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <SearchBar onSearch={handleSearch} />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <span className="font-bold">Error</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gmail</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {audiences.map((audience) => (
                <tr key={audience.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audience.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{audience.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audience.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audience.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{audience.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusClassName(audience.status)}>
                      {audience.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AudienceList;
