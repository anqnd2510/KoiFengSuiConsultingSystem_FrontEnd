import React, { useState, useEffect } from "react";
import { Select, message } from "antd";
import { assignStaff } from "../../services/booking.service";

const { Option } = Select;

/**
 * Component dùng để phân công nhân viên cho các buổi tư vấn
 */
const ManagerAssign = ({
  staffId,
  recordId,
  staffList,
  onSave,
  defaultValue = "Chưa phân công",
  consultingType = "Online",
}) => {
  const [editingMode, setEditingMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [assignedStaff, setAssignedStaff] = useState(null);

  useEffect(() => {
    console.log("ManagerAssign props:", {
      staffId,
      recordId,
      defaultValue,
    });

    // Kiểm tra dữ liệu từ localStorage
    if (recordId) {
      const assignmentData = JSON.parse(
        localStorage.getItem("staffAssignments") || "{}"
      );
      const localAssignment = assignmentData[recordId];

      if (localAssignment) {
        console.log("Found local assignment:", localAssignment);
        setSelectedStaff(localAssignment.staffId);
        setAssignedStaff(localAssignment.staffName);
        return;
      }
    }

    // Nếu không có dữ liệu trong localStorage, sử dụng props
    if (staffId && staffId !== "Chưa phân công" && staffId !== "none") {
      setSelectedStaff(staffId);

      // Tìm tên nhân viên từ staffList
      const staffItem = staffList.find((item) => item.value === staffId);
      if (staffItem) {
        setAssignedStaff(staffItem.label);
      }
    } else {
      setSelectedStaff(defaultValue);
    }
  }, [staffId, recordId, defaultValue, staffList]);

  const handleStaffChange = (value) => {
    setSelectedStaff(value);
    setEditingMode(true);
  };

  const handleSave = async () => {
    try {
      if (
        selectedStaff &&
        selectedStaff !== "Chưa phân công" &&
        selectedStaff !== "none"
      ) {
        setLoading(true);

        if (!recordId) {
          message.error("ID của booking không được để trống");
          setLoading(false);
          return;
        }

        console.log("Sending to API:", {
          bookingId: recordId.toString(),
          staffId: selectedStaff.toString(),
          consultingType: consultingType,
        });

        let bookingOnlineId = null;
        let bookingOfflineId = null;

        if (consultingType === "Online") {
          bookingOnlineId = recordId.toString();
        } else if (consultingType === "Offline") {
          bookingOfflineId = recordId.toString();
        } else {
          bookingOnlineId = recordId.toString();
        }

        try {
          // Ngăn chặn event mặc định nếu có
          event && event.preventDefault && event.preventDefault();

          const response = await assignStaff(
            bookingOnlineId,
            bookingOfflineId,
            selectedStaff.toString()
          );

          if (response.isSuccess) {
            const selectedStaffObj = staffList.find(
              (staff) => staff.value === selectedStaff
            );
            const staffName = selectedStaffObj
              ? selectedStaffObj.label
              : selectedStaff;

            setAssignedStaff(staffName);

            // Lưu vào localStorage để tránh mất dữ liệu khi refresh
            const assignmentData = JSON.parse(
              localStorage.getItem("staffAssignments") || "{}"
            );
            assignmentData[recordId] = {
              staffId: selectedStaff,
              staffName: staffName,
            };
            localStorage.setItem(
              "staffAssignments",
              JSON.stringify(assignmentData)
            );

            // Gọi onSave với tham số false ở cuối để không trigger reload
            onSave(selectedStaff, recordId, staffName, false);

            setEditingMode(false);
            message.success("Phân công nhân viên thành công!");
          } else {
            message.error(response.message || "Phân công nhân viên thất bại!");
          }
        } catch (error) {
          console.error("API Error:", error);

          if (
            error.response?.data?.message?.includes(
              "Nullable object must have a value"
            )
          ) {
            message.error("Thiếu thông tin bắt buộc khi phân công nhân viên");
          } else if (
            error.response?.data?.message === "Lịch tư vấn này đã có Staff"
          ) {
            message.info(
              "Lịch tư vấn này đã được phân công nhân viên trước đó"
            );
            onSave(null, recordId, null, true);
          } else {
            message.error(
              error.response?.data?.message ||
                "Có lỗi xảy ra khi phân công nhân viên!"
            );
          }
        }
      } else {
        message.warning("Vui lòng chọn nhân viên để phân công");
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      message.error(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi phân công nhân viên!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedStaff(defaultValue);
    setEditingMode(false);
  };

  if (assignedStaff) {
    return <span className="text-gray-700">{assignedStaff}</span>;
  }

  return (
    <div className="inline-flex items-center gap-2 relative">
      <Select
        value={selectedStaff}
        placeholder="Phân công nhân viên"
        style={{ width: 160 }}
        className={selectedStaff === "Chưa phân công" ? "text-red-500" : ""}
        onChange={handleStaffChange}
        options={staffList}
        dropdownMatchSelectWidth={false}
        disabled={loading}
      />

      {editingMode && (
        <div className="inline-flex items-center gap-1">
          <button
            onClick={handleSave}
            className="p-1 rounded bg-green-500 hover:bg-green-600 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <svg
                className="w-3.5 h-3.5 text-white animate-spin"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5 text-white"
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
            )}
          </button>
          <button
            onClick={handleCancel}
            className="p-1 rounded bg-gray-400 hover:bg-gray-500 transition-colors"
            disabled={loading}
          >
            <svg
              className="w-3.5 h-3.5 text-white"
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
  );
};

export default ManagerAssign;
