import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Common/Pagination";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendar,
  FaComments,
  FaUsers,
  FaBell,
  FaBook,
  FaClock,
  FaBlog,
  FaTools,
  FaGraduationCap,
  FaHeadset,
} from "react-icons/fa";
import Sidebar from "../components/Layout/Sidebar";
import CustomDatePicker from "../components/Common/CustomDatePicker";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Modal, Select } from "antd";

const mockData = [
  {
    id: 1,
    customer: "Nguyễn Văn A",
    service: "Tư vấn xây hồ ở nhà",
    date: "25-12-2024",
    status: "Mới",
  },
  {
    id: 2,
    customer: "Trần Thị B",
    service: "Tư vấn xây hồ ở nhà",
    date: "25-12-2024",
    status: "Đang xử lý",
  },
  {
    id: 3,
    customer: "Lê Văn C",
    service: "Tư vấn xây hồ ở nhà",
    date: "25-12-2024",
    status: "Hoàn thành",
  },
  // ... thêm data mẫu
];

const ConsultingOffline = () => {
  const [activeTab, setActiveTab] = useState("request");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const formatDate = (date) => {
    return date.locale("vi").format("dddd, DD [tháng] MM, YYYY");
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <header className="h-[90px] bg-gradient-to-r from-[#B4925A] to-[#8B6B3D] flex items-center px-8 shadow-md">
          <h1 className="text-2xl font-semibold text-white">
            Consulting Offline
          </h1>
        </header>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="border-b border-gray-200">
              <div className="flex gap-1">
                <div
                  className={`px-8 py-4 font-medium text-base relative transition-all duration-200 text-[#B4925A] border-[#B4925A] cursor-pointer`}
                >
                  <span>Yêu cầu tư vấn</span>
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#B4925A]" />
                </div>
                <button
                  onClick={() => navigate("/contract")}
                  className="px-8 py-4 font-medium text-base text-gray-500 hover:text-gray-800 cursor-pointer"
                >
                  Hợp đồng
                </button>
              </div>
            </div>

            <CustomDatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>

          {/* Table */}
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
                    Ngày tạo
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
                {mockData.map((item) => (
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
                          item.status === "Mới"
                            ? "bg-blue-50 text-blue-600 ring-1 ring-blue-500/20"
                            : item.status === "Đang xử lý"
                            ? "bg-yellow-50 text-yellow-600 ring-1 ring-yellow-500/20"
                            : "bg-green-50 text-green-600 ring-1 ring-green-500/20"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleOpenModal(item)}
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

          {/* Pagination */}
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

        <Modal
          title={
            <div className="text-xl font-semibold">Chi tiết yêu cầu tư vấn</div>
          }
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          width={600}
          className="consulting-detail-modal"
        >
          {selectedItem && (
            <div className="p-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    value={selectedItem.customer}
                    readOnly
                    className="w-full px-4 py-2 rounded-full border border-gray-200 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Dịch vụ
                  </label>
                  <input
                    type="text"
                    value={selectedItem.service}
                    readOnly
                    className="w-full px-4 py-2 rounded-full border border-gray-200 bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Trạng thái
                  </label>
                  <Select
                    defaultValue={selectedItem.status}
                    className="w-full"
                    options={[
                      { value: "Mới", label: "Mới" },
                      { value: "Đang xử lý", label: "Đang xử lý" },
                      { value: "Hoàn thành", label: "Hoàn thành" },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    placeholder="Nhập ghi chú..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition-colors">
                  Save
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

const styles = `
  .consulting-detail-modal .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
  }
  .consulting-detail-modal .ant-modal-header {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }
  .consulting-detail-modal .ant-modal-body {
    padding: 0;
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default ConsultingOffline;
