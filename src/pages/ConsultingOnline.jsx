import React, { useState, useEffect } from "react";
import { Select, Tag } from "antd";
import Pagination from "../components/Common/Pagination";
import CustomDatePicker from "../components/Common/CustomDatePicker";
import dayjs from "dayjs";
import CustomTable from "../components/Common/CustomTable";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import { getOnlineConsultingBookings } from "../services/booking.service";

const { Option } = Select;

const ConsultingOnline = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [consultingData, setConsultingData] = useState([]);
  const [loading, setLoading] = useState(false);
  //mai mốt cần thêm thì thêm ở dây
  const tabs = ["Tất cả", "Chờ xử lý", "Đã xác nhận", "Hoàn thành"];
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [error, setError] = useState(null);

  const fetchConsultingData = async (date) => {
    setLoading(true);
    try {
      // Truyền ngày được chọn vào API call nếu cần
      const response = await getOnlineConsultingBookings(
        date?.format("YYYY-MM-DD")
      );
      setConsultingData(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching consulting data:", err);
      setError(
        "Không thể tải dữ liệu tư vấn trực tuyến. Vui lòng thử lại sau."
      );
      setConsultingData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchConsultingData(selectedDate);
    };
    fetchData();
  }, [selectedDate]);

  // Ánh xạ trạng thái từ tiếng Anh sang tiếng Việt
  const mapStatus = (status) => {
    const statusMap = {
      Confirmed: "Đã xác nhận",
      Pending: "Chờ xử lý",
      Completed: "Hoàn thành",
    };
    return statusMap[status] || status;
  };

  // Filter data based on active tab
  const filteredData = consultingData.filter((item) => {
    const vietnameseStatus = mapStatus(item.status);
    if (activeTab === "Tất cả") return true;
    return vietnameseStatus === activeTab;
  });

  const getStatusColor = (status) => {
    const vietnameseStatus = mapStatus(status);
    switch (vietnameseStatus) {
      case "Hoàn thành":
        return "success";
      case "Chờ xử lý":
        return "warning";
      case "Đã xác nhận":
        return "blue";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "bookingOnlineId",
      key: "bookingOnlineId",
      width: "10%",
      render: (id) => <span>#{id.substring(0, 6)}</span>,
    },
    {
      title: "Ngày",
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: "10%",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: "15%",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "20%",
    },
    {
      title: "Thời gian",
      key: "time",
      width: "15%",
      render: (_, record) => (
        <span>
          {record.startTime} - {record.endTime}
        </span>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: "10%",
      render: (type) => <Tag color="default">{type}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{mapStatus(status)}</Tag>
      ),
    },
  ];

  // Hàm xử lý khi thay đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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
              {tabs.map((tab, index) => (
                <button
                  key={`tab-${index}`}
                  onClick={() => handleTabChange(tab)}
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
            dataSource={filteredData.map((item) => ({
              ...item,
              key: item.bookingOnlineId,
            }))}
            loading={loading}
          />

          <div className="flex justify-end mt-6">
            <Pagination
              currentPage={1}
              totalPages={Math.ceil(filteredData.length / 10)}
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
