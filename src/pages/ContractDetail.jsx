import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Progress } from "antd";
import Sidebar from "../components/Layout/Sidebar";
import BackButton from "../components/Common/BackButton";

const ContractDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Chi tiết hợp đồng");

  const renderContent = () => {
    switch (activeTab) {
      case "Tiến độ":
        return (
          <div className="bg-white rounded-b-xl border border-gray-200 p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-700 mb-4">Tiến độ thực hiện</h3>
                <Progress
                  percent={100}
                  strokeColor="#B4925A"
                  trailColor="#E5E7EB"
                  strokeWidth={12}
                  className="w-full"
                />
              </div>
              <div>
                <h3 className="text-gray-700 mb-2">Tiến độ hiện tại: 0%</h3>
                <Progress
                  percent={70}
                  strokeColor="#B4925A"
                  trailColor="#E5E7EB"
                  strokeWidth={12}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        );
      case "Chi tiết hợp đồng":
        return (
          <div className="bg-white rounded-b-xl border border-gray-200 p-8">
            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-600 mb-2">Khách hàng</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Ngày tạo</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">
                    Giá trị hợp đồng
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">
                    Trạng thái thanh toán
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">
                    Nội dung hợp đồng
                  </label>
                  <textarea className="w-full px-4 py-2.5 rounded-lg border border-gray-200 h-28" />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-600 mb-2">Email</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Dịch vụ</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">Ngày ký</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">
                    Tiền đặt cọc
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">
                    Thầy phong thủy
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2">
                    Hình ảnh/video
                  </label>
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <button className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors w-full">
                      <svg
                        className="w-6 h-6 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Tải lên
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="mt-8 border-t pt-8">
              <div className="flex justify-between items-start">
                <div className="w-1/2">
                  <img
                    src="/contract-preview.png"
                    alt="Contract Preview"
                    className="w-full border rounded-lg"
                  />
                  <div className="flex justify-center mt-4">
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full cursor-pointer transition-colors ${
                            index === 0
                              ? "bg-[#B4925A]"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors">
                    Hủy
                  </button>
                  <button className="px-6 py-2.5 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer transition-colors">
                    Draft
                  </button>
                  <button className="px-6 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 cursor-pointer transition-colors">
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "Hồ sơ tư vấn":
        return (
          <div className="bg-white rounded-b-xl border border-gray-200 p-8">
            <div className="space-y-6">
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 bg-gray-50">
                <div className="flex flex-col items-center justify-center text-center">
                  <svg
                    className="w-12 h-12 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-gray-600 mb-2">Kéo file vào đây</p>
                  <p className="text-gray-400 text-sm mb-4">hoặc</p>
                  <button className="px-6 py-2.5 bg-[#B4925A] text-white rounded-full hover:bg-[#A38250] transition-colors cursor-pointer">
                    Chọn file
                  </button>
                </div>
              </div>

              {/* File List */}
              <div className="space-y-4">
                {/* File Item */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#B4925A]/10 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-[#B4925A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Hồ sơ tư vấn.pdf
                      </h4>
                      <p className="text-sm text-gray-500">2.5 MB • PDF</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-[#B4925A] transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Repeat for more files */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#B4925A]/10 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-[#B4925A]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Ảnh tư vấn.jpg
                      </h4>
                      <p className="text-sm text-gray-500">1.8 MB • JPG</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="text-gray-400 hover:text-[#B4925A] transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "Ghi chú":
        return (
          <div className="bg-white rounded-b-xl border border-gray-200 p-8">
            <div className="space-y-6">
              {/* Notes List */}
              <div className="space-y-4">
                {/* Note Item */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Khách hàng yêu cầu tư vấn về hướng cửa chính
                  </p>
                </div>

                {/* Note Item */}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Cần xem xét kỹ về vị trí đặt hồ
                  </p>
                </div>
              </div>

              {/* Add New Note */}
              <div className="space-y-4">
                <textarea
                  placeholder="Thêm ghi chú mới..."
                  className="w-full p-4 border border-gray-200 rounded-lg min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#B4925A] focus:border-transparent"
                />
                <button className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Thêm ghi chú mới
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-b-xl border border-gray-200 p-8">
            <p className="text-gray-500">Nội dung đang được phát triển...</p>
          </div>
        );
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        {/* Brown Header */}
        <div className="h-[90px] bg-[#B4925A] flex items-center px-8">
          <h1 className="text-white text-2xl font-medium">Consulting</h1>
        </div>

        {/* Main Content */}
        <div className="p-8 bg-gray-50">
          <div className="max-w-[1200px] mx-auto">
            {/* Contract Header with Back Button */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-6">
                <BackButton to="/contract" />
                <h1 className="text-2xl font-semibold">Hợp Đồng #{id}</h1>
                <span className="px-6 py-2 rounded-full border border-gray-200 bg-white">
                  Chờ ký
                </span>
              </div>
              <div className="text-gray-500">28/2/2025</div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-t-xl border border-b-0 border-gray-200">
              <div className="flex">
                {[
                  "Chi tiết hợp đồng",
                  "Tiến độ",
                  "Hồ sơ tư vấn",
                  "Ghi chú",
                ].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-6 relative cursor-pointer transition-colors ${
                      activeTab === tab
                        ? "text-[#B4925A] font-medium border-b-2 border-[#B4925A]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Content based on active tab */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
