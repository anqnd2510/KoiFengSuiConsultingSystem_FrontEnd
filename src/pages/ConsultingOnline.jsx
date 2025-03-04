import React, { useState } from "react";
import { Select } from "antd";
import Pagination from "../components/Common/Pagination";
import CustomDatePicker from "../components/Common/CustomDatePicker";
import dayjs from "dayjs";
import CustomTable from "../components/Common/CustomTable";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import { Tag } from "antd";

const { Option } = Select;

const mockConsultingData = [
  {
    id: "0001",
    date: "2024-03-20",
    customer: "Nguyễn Văn A",
    description: "Tư vấn xây hồ",
    package: "Cơ bản",
    staff: "Nguyễn Văn B",
    type: "Trực tuyến",
    status: "Hoàn thành",
  },
  {
    id: "0002",
    date: "2024-03-20",
    customer: "Trần Thị C",
    description: "Tư vấn xây hồ",
    package: "Cơ bản",
    staff: "Chưa phân công",
    type: "Trực tuyến",
    status: "Đã hủy",
  },
  // ... other mock data
];

const staffList = ["Nguyễn Văn B", "Trần Thị C", "Lê Văn D", "Phạm Thị E"];

const ConsultingOnline = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [editingStaff, setEditingStaff] = useState(null);
  const [tempStaff, setTempStaff] = useState(null);
  const tabs = ["Tất cả", "Đang diễn ra", "Đã hủy", "Hoàn thành", "Chờ xử lý"];
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [error, setError] = useState(null);

  const handleStaffChange = (value, recordId) => {
    setTempStaff(value);
    setEditingStaff(recordId);
  };

  const handleSaveStaff = () => {
    console.log(`Lưu thay đổi nhân viên: ${tempStaff} cho bản ghi ${editingStaff}`);
    setEditingStaff(null);
    setTempStaff(null);
  };

  const handleCancelStaff = () => {
    setEditingStaff(null);
    setTempStaff(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hoàn thành":
        return "success";
      case "Đã hủy":
        return "error";
      case "Đang diễn ra":
        return "processing";
      case "Chờ xử lý":
        return "warning";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "id",
      key: "id",
      width: "10%",
      render: (id) => <span>#{id}</span>,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: "10%",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      width: "15%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "15%",
    },
    {
      title: "Gói dịch vụ",
      dataIndex: "package",
      key: "package",
      width: "10%",
    },
    {
      title: "Nhân viên",
      dataIndex: "staff",
      key: "staff",
      width: "20%",
      render: (staff, record) => (
        <div className="flex items-center">
          <Select
            value={editingStaff === record.id ? tempStaff : staff}
            placeholder="Phân công nhân viên"
            style={{ width: 160 }}
            className={staff === "Chưa phân công" ? "text-red-500" : ""}
            onChange={(value) => handleStaffChange(value, record.id)}
          >
            {staffList.map((staff) => (
              <Option key={staff} value={staff}>
                {staff}
              </Option>
            ))}
          </Select>

          {editingStaff === record.id && (
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
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: "10%",
      render: (type) => (
        <Tag color="default">{type}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
  ];

  return (
    <div className="flex-1 flex">
      {/* Sidebar here */}
      <div className="flex-1">
        <Header 
          title="Tư vấn trực tuyến"
          description="Quản lý và theo dõi các buổi tư vấn trực tuyến"
        />

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex p-1 bg-white rounded-xl mb-6 shadow-sm">
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

          {error && <Error message={error} />}

          <CustomTable
            columns={columns}
            dataSource={mockConsultingData}
            loading={false}
          />

          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={1}
              totalPages={5}
              onPageChange={(page) => {
                console.log("Chuyển đến trang:", page);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultingOnline;
