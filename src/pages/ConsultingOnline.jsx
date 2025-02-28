import React, { useState } from "react";
import { Select } from "antd";
import Pagination from "../components/Common/Pagination";
import CustomDatePicker from "../components/Common/CustomDatePicker";
import dayjs from "dayjs";

const { Option } = Select;

const mockConsultingData = [
  {
    id: "0001",
    date: "2024-03-20",
    customer: "John Smith",
    description: "Tư vấn xây hồ",
    package: "Cơ bản",
    staff: "Nguyen Van A",
    type: "Online",
    status: "Finished",
  },
  {
    id: "0002",
    date: "2024-03-20",
    customer: "John Smith",
    description: "Tư vấn xây hồ",
    package: "Cơ bản",
    staff: "NOT ASSIGNED",
    type: "Online",
    status: "Cancelled",
  },
  // ... other mock data
];

const staffList = ["Nguyen Van A", "Tran Thi B", "Le Van C", "Pham Thi D"];

const ConsultingOnline = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [editingStaff, setEditingStaff] = useState(null);
  const [tempStaff, setTempStaff] = useState(null);
  const tabs = ["All", "Ongoing", "Cancelled", "Finished", "Pending"];
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const handleStaffChange = (value, recordId) => {
    setTempStaff(value);
    setEditingStaff(recordId);
  };

  const handleSaveStaff = () => {
    console.log(`Saving staff change: ${tempStaff} for record ${editingStaff}`);
    setEditingStaff(null);
    setTempStaff(null);
  };

  const handleCancelStaff = () => {
    setEditingStaff(null);
    setTempStaff(null);
  };

  return (
    <div className="flex-1 flex">
      {/* Sidebar here */}
      <div className="flex-1">
        <header className="h-[90px] bg-[#B4925A] flex items-center px-8">
          <h1 className="text-2xl font-semibold text-white">
            Consulting Online
          </h1>
        </header>

        <div className="p-8">
          {/* Rest of the content */}
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex p-1 bg-white rounded-xl mb-6 shadow-sm">
              {/* Tabs */}
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-5 py-2.5 
                    rounded-lg 
                    font-medium 
                    transition-all 
                    duration-200
                    ${
                      activeTab === tab
                        ? "bg-[#B4925A] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    }
                    ${tab === "All" && activeTab === "All" && "bg-[#B4925A]"}
                    ${
                      tab === "Ongoing" &&
                      activeTab === "Ongoing" &&
                      "bg-blue-500"
                    }
                    ${
                      tab === "Cancelled" &&
                      activeTab === "Cancelled" &&
                      "bg-red-500"
                    }
                    ${
                      tab === "Finished" &&
                      activeTab === "Finished" &&
                      "bg-green-500"
                    }
                    ${
                      tab === "Pending" &&
                      activeTab === "Pending" &&
                      "bg-yellow-500"
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
            <CustomDatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>

          {/* Table and Pagination */}
          <table className="w-full mb-6">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-4 text-gray-600">ID</th>
                <th className="pb-4 text-gray-600">Date</th>
                <th className="pb-4 text-gray-600">Customer</th>
                <th className="pb-4 text-gray-600">Description</th>
                <th className="pb-4 text-gray-600">Package</th>
                <th className="pb-4 text-gray-600">Staff</th>
                <th className="pb-4 text-gray-600">Type</th>
                <th className="pb-4 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockConsultingData.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-4 font-medium">#{item.id}</td>
                  <td className="py-4">{item.date}</td>
                  <td className="py-4">{item.customer}</td>
                  <td className="py-4">{item.description}</td>
                  <td className="py-4">{item.package}</td>
                  <td className="py-4 w-[220px] relative">
                    <div className="flex items-center">
                      <Select
                        value={
                          editingStaff === item.id ? tempStaff : item.staff
                        }
                        placeholder="Assign staff"
                        style={{ width: 160 }}
                        className={
                          item.staff === "NOT ASSIGNED" ? "text-red-500" : ""
                        }
                        onChange={(value) => handleStaffChange(value, item.id)}
                      >
                        {staffList.map((staff) => (
                          <Option key={staff} value={staff}>
                            {staff}
                          </Option>
                        ))}
                      </Select>

                      {editingStaff === item.id && (
                        <div className="absolute left-[170px] flex gap-1.5 items-center">
                          <button
                            onClick={handleSaveStaff}
                            className="p-1.5 rounded bg-green-500 hover:bg-green-600 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={handleCancelStaff}
                            className="p-1.5 rounded bg-gray-400 hover:bg-gray-500 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100">
                      {item.type}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        item.status === "Finished"
                          ? "bg-green-100 text-green-600"
                          : item.status === "Cancelled"
                          ? "bg-red-100 text-red-600"
                          : item.status === "Ongoing"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <Pagination
              currentPage={1}
              totalPages={5}
              onPageChange={(page) => {
                console.log("Changed to page:", page);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultingOnline;
