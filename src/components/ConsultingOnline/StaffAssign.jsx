import React, { useState } from "react";
import { Select } from "antd";

const { Option } = Select;

/**
 * Component dùng để phân công nhân viên cho các buổi tư vấn
 */
const StaffAssign = ({ 
  staffId, 
  recordId, 
  staffList, 
  onSave, 
  defaultValue = "Chưa phân công"
}) => {
  const [editingMode, setEditingMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(defaultValue);
  
  const handleStaffChange = (value) => {
    setSelectedStaff(value);
    setEditingMode(true);
  };

  const handleSave = () => {
    onSave(selectedStaff, recordId);
    setEditingMode(false);
  };

  const handleCancel = () => {
    setSelectedStaff(defaultValue);
    setEditingMode(false);
  };

  return (
    <div className="flex items-center">
      <Select
        value={selectedStaff}
        placeholder="Phân công nhân viên"
        style={{ width: 160 }}
        className={selectedStaff === "Chưa phân công" ? "text-red-500" : ""}
        onChange={handleStaffChange}
      >
        <Option key="unassigned" value="Chưa phân công" className="text-red-500">Chưa phân công</Option>
        {staffList.map((staff) => (
          <Option key={staff} value={staff}>{staff}</Option>
        ))}
      </Select>

      {editingMode && (
        <div className="flex gap-[5px] items-center ml-[5px]">
          <button
            onClick={handleSave}
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
            onClick={handleCancel}
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
  );
};

export default StaffAssign; 