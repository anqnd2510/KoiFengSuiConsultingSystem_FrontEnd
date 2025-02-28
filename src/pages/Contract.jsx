import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Common/Pagination";
import Sidebar from "../components/Layout/Sidebar";
import CustomDatePicker from "../components/Common/CustomDatePicker";
import dayjs from "dayjs";

const mockContractData = [
  {
    id: 1,
    customer: "Nguyễn Văn A",
    service: "Tư vấn xây hồ ở nhà ở",
    date: "25-12-2024",
    status: "Đã ký",
  },
  {
    id: 2,
    customer: "Trần Thị B",
    service: "Tư vấn xây hồ ở nhà ở",
    date: "-",
    status: "Chờ ký",
  },
  // ... thêm data mẫu
];

const Contract = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <header className="h-[90px] bg-[#B4925A] flex items-center px-8">
          <h1 className="text-2xl font-semibold text-white">
            Consulting Offline
          </h1>
        </header>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="border-b border-gray-200">
              <div className="flex gap-1">
                <button
                  onClick={() => navigate("/consulting-offline")}
                  className="px-8 py-4 font-medium text-base text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  Yêu cầu tư vấn
                </button>
                <div
                  className={`px-8 py-4 font-medium text-base relative transition-all duration-200 text-[#B4925A] border-[#B4925A] cursor-pointer`}
                >
                  <span>Hợp đồng</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B4925A]" />
                </div>
              </div>
            </div>

            <CustomDatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Khách hàng
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Dịch vụ
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Ngày ký
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockContractData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="py-4 px-6 font-semibold text-[#B4925A]">
                      #{item.id.toString().padStart(4, "0")}
                    </td>
                    <td className="py-4 px-6 font-medium">{item.customer}</td>
                    <td className="py-4 px-6 text-gray-600">{item.service}</td>
                    <td className="py-4 px-6">{item.date}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                          item.status === "Đã ký"
                            ? "bg-green-50 text-green-600 ring-1 ring-green-500/20"
                            : "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => navigate(`/contract/${item.id}`)}
                        className="px-4 py-2 bg-[#B4925A] text-white text-sm rounded-lg hover:bg-[#8B6B3D] transition-all duration-200 shadow-sm cursor-pointer"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6">
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

export default Contract;
