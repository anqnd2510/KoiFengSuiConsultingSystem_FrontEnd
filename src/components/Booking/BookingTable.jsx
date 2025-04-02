import React, { useState, useEffect } from "react";
import { Tag } from "antd";
import CustomTable from "../Common/CustomTable";
import { Link } from "react-router-dom";
import StatusBadge from "../Common/StatusBadge";
import StaffAssign from "../ConsultingOnline/StaffAssign";
import { getMasterList } from "../../services/master.service";

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Completed":
        return "success";
      case "Cancelled":
        return "error";
      case "Scheduled":
        return "processing";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      width: "15%",
      render: (text, record) => (
        <Link
          to={`/booking-schedule/${record.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: "12%",
      align: "center",
    },
    {
      title: "Loại tư vấn",
      dataIndex: "consultingType",
      key: "consultingType",
      width: "12%",
      align: "center",
      render: (type) => (
        <Tag color={type === "Online" ? "blue" : "orange"}>{type}</Tag>
      ),
    },
    {
      title: "Bậc thầy",
      dataIndex: "master",
      key: "master",
      width: "200px",
      render: (master, record) => {
        // Nếu đã có master được assign, hiển thị tên master
        if (master && master !== "Chưa phân công") {
          return <span className="text-gray-700">{master}</span>;
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
        let color = "default";
        let text = status;

        switch (status) {
          case "Pending":
            color = "gold";
            text = "Chờ xử lý";
            break;
          case "Confirmed":
            color = "green";
            text = "Đã xác nhận";
            break;
          case "Cancelled":
            color = "red";
            text = "Đã hủy";
            break;
          case "Scheduled":
            color = "blue";
            text = "Đã lên lịch";
            break;
          case "Completed":
            color = "green";
            text = "Hoàn thành";
            break;
        }

        return (
          <Tag
            color={color}
            className="px-2 py-1 text-center whitespace-nowrap"
          >
            {text}
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
        className="min-w-[1000px]"
        scroll={{ x: true }}
      />
    </div>
  );
};

export default BookingTable;
