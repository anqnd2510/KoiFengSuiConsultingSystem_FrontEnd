import React, { useState, useEffect } from "react";
import { Tag } from "antd";
import CustomTable from "../Common/CustomTable";
import { Link } from "react-router-dom";
import StatusBadge from "../Common/StatusBadge";
import ManagerAssign from "../ConsultingOnline/ManagerAssign";
import { getAllStaff } from "../../services/account.service";

const BookingTable = ({ bookings, loading, onStaffChange }) => {
  const [staffList, setStaffList] = useState([
    { value: "none", label: "Chưa phân công" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaffList = async () => {
      setIsLoading(true);
      try {
        const response = await getAllStaff();
        console.log("Staff API response:", response);

        // Xử lý dữ liệu API một cách linh hoạt hơn
        if (response && response.isSuccess) {
          let staffData = [];

          // Kiểm tra nếu data là mảng trực tiếp
          if (Array.isArray(response.data)) {
            staffData = response.data;
          }
          // Kiểm tra nếu data là object có thuộc tính data là mảng
          else if (response.data && Array.isArray(response.data.data)) {
            staffData = response.data.data;
          }
          // Kiểm tra nếu data là object có thuộc tính 0 (mảng dạng object)
          else if (response.data && response.data[0]) {
            staffData = Object.values(response.data);
          }

          console.log("Staff data extracted:", staffData);

          // Xử lý dữ liệu nhân viên
          if (staffData.length > 0) {
            const validStaffs = staffData
              .filter((staff) => staff && typeof staff === "object")
              .map((staff) => {
                // Lấy ID từ bất kỳ trường nào có thể
                const id =
                  staff.accountId || staff.staffId || staff.id || "unknown";
                // Lấy tên từ bất kỳ trường nào có thể
                const name =
                  staff.fullName ||
                  staff.staffName ||
                  staff.name ||
                  "Không có tên";

                console.log(`Mapping staff: ${id} - ${name}`);

                return {
                  value: id.toString(),
                  label: name,
                };
              });

            console.log("Final processed staff list:", validStaffs);

            if (validStaffs.length > 0) {
              setStaffList([
                { value: "none", label: "Chưa phân công" },
                ...validStaffs,
              ]);
            } else {
              setStaffList([{ value: "none", label: "Chưa phân công" }]);
            }
          } else {
            console.warn("Không tìm thấy dữ liệu nhân viên trong response");
            setStaffList([{ value: "none", label: "Chưa phân công" }]);
          }
        } else {
          console.warn("API response không hợp lệ:", response);
          setStaffList([{ value: "none", label: "Chưa phân công" }]);
        }
      } catch (error) {
        console.error("Error fetching staff list:", error);
        setStaffList([{ value: "none", label: "Chưa phân công" }]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffList();
  }, []);

  const handleStaffAssigned = (
    selectedValue,
    recordId,
    staffName,
    reload = false
  ) => {
    // Nếu cần reload dữ liệu (khi đã có staff trước đó)
    if (reload) {
      onStaffChange(null, null, null, true); // Gọi hàm reload dữ liệu
      return;
    }

    // Gọi onStaffChange với cả staffId và staffName
    onStaffChange(selectedValue, staffName || "Chưa phân công", recordId);
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
          to={`/booking-management/${record.id}`}
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
      title: "Nhân viên phụ trách",
      dataIndex: "staff",
      key: "staff",
      width: "200px",
      render: (staff, record) => {
        // Nếu đã có staff được assign, hiển thị tên staff
        if (staff && staff !== "Chưa phân công") {
          return <span className="text-gray-700">{staff}</span>;
        }

        // Nếu chưa có staff, hiển thị dropdown để assign
        return (
          <div className="flex items-center">
            <ManagerAssign
              staffId={record.staffId || "none"}
              recordId={record.id}
              staffList={staffList}
              onSave={handleStaffAssigned}
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
