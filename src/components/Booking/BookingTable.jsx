import React, { useState, useEffect } from "react";
import { Tag, Table, Space, Tooltip, Avatar, Badge } from "antd";
import CustomTable from "../Common/CustomTable";
import { Link } from "react-router-dom";
import StatusBadge from "../Common/StatusBadge";
import StaffAssign from "../ConsultingOnline/StaffAssign";
import { getMasterList } from "../../services/master.service";
import {
  TeamOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  FireOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const BookingTable = ({ bookings, loading, onMasterChange }) => {
  const [masterList, setMasterList] = useState([]);

  useEffect(() => {
    const fetchMasterList = async () => {
      try {
        const response = await getMasterList();
        if (response.isSuccess && response.data) {
          const masters = response.data.map((master) => ({
            value: master.masterId.toString(),
            label: master.masterName,
          }));
          setMasterList([
            { value: "none", label: "Chưa phân công" },
            ...masters,
          ]);
        }
      } catch (error) {
        console.error("Error fetching master list:", error);
        setMasterList([{ value: "none", label: "Chưa phân công" }]);
      }
    };

    fetchMasterList();
  }, []);

  const handleMasterAssigned = (
    selectedValue,
    recordId,
    masterName,
    reload = false
  ) => {
    // Nếu cần reload dữ liệu (khi đã có master trước đó)
    if (reload) {
      onMasterChange(null, null, null, true); // Gọi hàm reload dữ liệu
      return;
    }

    // Gọi onMasterChange với cả masterId và masterName
    onMasterChange(selectedValue, masterName || "Chưa phân công", recordId);
  };

  // Hàm tạo màu từ string
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "#1890ff",
      "#52c41a",
      "#722ed1",
      "#faad14",
      "#13c2c2",
      "#eb2f96",
      "#f5222d",
      "#fa541c",
    ];

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: "15%",
      render: (text, record) => {
        // Kiểm tra xem booking có phải mới tạo trong vòng 12h không
        const isRecentlyCreated = record.isNew;

        return (
          <div className="flex items-center gap-3">
            <Avatar
              style={{
                backgroundColor: stringToColor(text),
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
              size="large"
              icon={<UserOutlined />}
            />
            <div>
              <span className="text-gray-800 font-medium hover:text-blue-600 transition-colors duration-300">
                {text}
              </span>
              {isRecentlyCreated && (
                <Tag
                  color="#52c41a"
                  className="ml-2 new-booking-tag"
                  style={{
                    borderRadius: "12px",
                    padding: "0px 6px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "2px",
                    animation: "pulse 1.5s infinite",
                    boxShadow: "0 2px 5px rgba(82, 196, 26, 0.2)",
                  }}
                >
                  <FireOutlined /> MỚI
                </Tag>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "20%",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <div className="flex items-center truncate max-w-xs text-gray-600 hover:text-gray-800 transition-colors duration-300">
            <FileTextOutlined className="mr-2 text-gray-400" />
            <span>{text}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: "15%",
      className: "date-column",
      sorter: (a, b) => {
        // Kiểm tra nếu date là Invalid Date
        if (a.date?.includes("Invalid") || b.date?.includes("Invalid")) {
          return 0;
        }

        // Sắp xếp theo rawDate nếu có
        if (a.rawDate && b.rawDate) {
          return new Date(a.rawDate) - new Date(b.rawDate);
        }

        return new Date(a.date || 0) - new Date(b.date || 0);
      },
      render: (date, record) => {
        // Kiểm tra xem chuỗi có phải là 'Invalid Date'
        if (!date || date.includes("Invalid")) {
          return (
            <div className="flex items-center p-1 rounded-md bg-red-50">
              <CalendarOutlined className="mr-2 text-red-500" />
              <span className="text-red-500 font-medium">Chưa có ngày</span>
            </div>
          );
        }

        try {
          let dateObj;
          // Nếu có rawDate, sử dụng nó để tạo đối tượng Date
          if (record.rawDate && !record.rawDate.includes("Invalid")) {
            dateObj = new Date(record.rawDate);
          } else {
            // Nếu date là chuỗi đã được format, thử phân tích trực tiếp
            const parts = date.split(" ");
            if (parts.length >= 2) {
              const dateParts = parts[0].split("/");
              const timeParts = parts[1].split(":");

              if (dateParts.length === 3 && timeParts.length >= 2) {
                dateObj = new Date(
                  parseInt(dateParts[2]), // year
                  parseInt(dateParts[1]) - 1, // month (0-11)
                  parseInt(dateParts[0]), // day
                  parseInt(timeParts[0]), // hour
                  parseInt(timeParts[1]) // minute
                );
              } else {
                dateObj = new Date(date);
              }
            } else {
              dateObj = new Date(date);
            }
          }

          if (isNaN(dateObj.getTime())) {
            throw new Error("Invalid date");
          }

          const formattedDate = dateObj.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          const formattedTime = dateObj.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          });

          // Check if date is today
          const today = new Date();
          const isToday =
            dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear();

          return (
            <div
              className={`flex flex-col p-2 rounded-md ${
                isToday ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center mb-1">
                <CalendarOutlined className="mr-2 text-blue-500" />
                <span className="booking-date font-medium">
                  {formattedDate}
                </span>
                {isToday && <Badge color="blue" className="ml-2" />}
              </div>
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-2 text-blue-500" />
                <span className="booking-time text-gray-600">
                  {formattedTime}
                </span>
              </div>
            </div>
          );
        } catch (error) {
          console.error("Error parsing date:", error, date);
          // Hiển thị date gốc nếu không thể parse
          return (
            <div className="flex items-center p-1 rounded-md bg-orange-50">
              <InfoCircleOutlined className="mr-2 text-orange-500" />
              <span className="text-orange-500">{date}</span>
            </div>
          );
        }
      },
    },
    {
      title: "Loại tư vấn",
      dataIndex: "consultingType",
      key: "consultingType",
      width: "12%",
      align: "center",
      render: (text) => {
        const isOnline = text.toLowerCase() === "online";
        return (
          <Tag
            color={isOnline ? "#722ed1" : "#13c2c2"}
            style={{
              borderRadius: "20px",
              padding: "4px 12px",
              fontSize: "13px",
              fontWeight: "500",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.3s ease",
            }}
            className="hover:scale-105"
          >
            {isOnline ? <GlobalOutlined /> : <EnvironmentOutlined />} {text}
          </Tag>
        );
      },
    },
    {
      title: "Bậc thầy",
      dataIndex: "master",
      key: "master",
      width: "200px",
      render: (master, record) => {
        // Nếu đã có master được assign, hiển thị tên master
        if (master && master !== "Chưa phân công") {
          return (
            <div className="flex items-center">
              <Avatar
                style={{
                  backgroundColor: "#1890ff",
                  marginRight: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
                icon={<UserOutlined />}
                size="small"
              />
              <span className="text-gray-700 font-medium">{master}</span>
            </div>
          );
        }

        // Nếu chưa có master, hiển thị dropdown để assign
        return (
          <div className="flex items-center">
            <StaffAssign
              staffId={master}
              recordId={record.id}
              staffList={masterList}
              onSave={handleMasterAssigned}
              defaultValue="Chưa phân công"
              consultingType={record.consultingType}
            />
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "120px",
      align: "center",
      render: (status) => {
        let color = "";
        let text = "";
        let icon = null;
        let bgColor = "";

        switch (status) {
          case "Pending":
          case "pending":
            color = "#faad14";
            bgColor = "#fff7e6";
            text = "Chờ xử lý";
            icon = <ClockCircleOutlined />;
            break;
          case "Completed":
          case "completed":
            color = "#52c41a";
            bgColor = "#f6ffed";
            text = "Hoàn thành";
            icon = <CheckCircleOutlined />;
            break;
          case "Cancelled":
          case "cancelled":
            color = "#f5222d";
            bgColor = "#fff1f0";
            text = "Đã hủy";
            icon = <CloseCircleOutlined />;
            break;
          case "Scheduled":
          case "scheduled":
            color = "#1890ff";
            bgColor = "#e6f7ff";
            text = "Đã xếp lịch";
            icon = <CalendarOutlined />;
            break;
          case "Confirmed":
          case "confirmed":
            color = "#13c2c2";
            bgColor = "#e6fffb";
            text = "Đã xác nhận";
            icon = <CheckOutlined />;
            break;
          default:
            color = "#d9d9d9";
            bgColor = "#fafafa";
            text = status;
            icon = <InfoCircleOutlined />;
        }

        return (
          <Tag
            style={{
              backgroundColor: bgColor,
              color: color,
              borderColor: color,
              borderRadius: "20px",
              padding: "4px 12px",
              fontSize: "13px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
            }}
            className="hover:scale-105"
          >
            {icon} {text}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="overflow-x-auto">
      <CustomTable
        columns={columns}
        dataSource={bookings}
        loading={loading}
        className="min-w-[1000px] booking-table"
        scroll={{ x: true }}
        rowClassName={(record, index) =>
          `booking-row ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} 
           ${record.isNew ? "new-booking-row" : ""} 
           ${record.master === "Chưa phân công" ? "unassigned-row" : ""}`
        }
      />
      <style jsx global>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.4);
          }
          70% {
            box-shadow: 0 0 0 5px rgba(82, 196, 26, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(82, 196, 26, 0);
          }
        }

        .new-booking-tag {
          animation: pulse 1.5s infinite;
        }

        .booking-table .ant-table {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .booking-table .ant-table-thead > tr > th {
          background-color: #f0f5ff;
          color: #1890ff;
          font-weight: 600;
          padding: 16px 8px;
          font-size: 14px;
          border-bottom: 2px solid #e6f7ff;
        }

        .booking-table .ant-table-tbody > tr > td {
          padding: 16px 8px;
          transition: background-color 0.3s ease;
        }

        .booking-table .ant-table-tbody > tr.ant-table-row:hover > td {
          background-color: #e6f7ff;
        }

        .booking-table .ant-table-tbody > tr.new-booking-row > td {
          background-color: #f6ffed;
        }

        .booking-table .ant-table-tbody > tr.unassigned-row > td {
          background-color: #fff7e6;
        }

        .booking-table .ant-table-tbody > tr.ant-table-row {
          transition: background-color 0.3s ease;
        }

        .booking-table .ant-table-tbody > tr.ant-table-row:hover {
          background-color: #e6f7ff;
        }

        /* Định dạng cho cột ngày tháng */
        .ant-table .date-column {
          font-family: "SF Mono", Menlo, Monaco, Consolas, monospace;
          position: relative;
          white-space: nowrap;
        }

        .ant-table .date-column::before {
          content: "📅 ";
          opacity: 0.6;
        }

        .ant-table .booking-date {
          font-weight: 500;
          color: #1890ff;
        }

        .ant-table .booking-time {
          font-size: 0.85em;
          color: #52c41a;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
};

export default BookingTable;
