import React, { useState } from "react";
import { Select, message } from "antd";
import { assignMaster } from "../../services/booking.service";

const { Option } = Select;

/**
 * Component dùng để phân công nhân viên cho các buổi tư vấn
 */
const StaffAssign = ({
  staffId,
  recordId,
  staffList,
  onSave,
  defaultValue = "Chưa phân công",
}) => {
  const [editingMode, setEditingMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(defaultValue);

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
        console.log("Sending to API:", {
          bookingId: recordId.toString(),
          masterId: selectedStaff.toString(),
        });

        const response = await assignMaster(
          recordId.toString(),
          selectedStaff.toString()
        );

        if (response.isSuccess) {
          onSave(selectedStaff, recordId);
          setEditingMode(false);
          message.success("Phân công bậc thầy thành công!");
        } else {
          message.error(response.message || "Phân công bậc thầy thất bại!");
        }
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi phân công bậc thầy!"
      );
    }
  };

  const handleCancel = () => {
    setSelectedStaff(defaultValue);
    setEditingMode(false);
  };

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
      />

      {editingMode && (
        <div className="inline-flex items-center gap-1">
          <button
            onClick={handleSave}
            className="p-1 rounded bg-green-500 hover:bg-green-600 transition-colors"
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            onClick={handleCancel}
            className="p-1 rounded bg-gray-400 hover:bg-gray-500 transition-colors"
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

export default StaffAssign;
