import React from "react";
import { Select } from "antd";
import { Filter } from "lucide-react";

const { Option } = Select;

/**
 * Component FilterBar đơn giản để lọc theo trạng thái
 * @param {Object} props - Properties của component
 * @param {Array} props.statusOptions - Mảng các tùy chọn trạng thái [{ value, label }]
 * @param {Function} props.onStatusChange - Hàm xử lý khi thay đổi trạng thái
 * @param {string} props.defaultValue - Giá trị mặc định, thường là "all"
 * @param {string} props.placeholder - Text placeholder cho select
 * @param {string} props.width - Độ rộng của select
 * @param {string} props.className - Class CSS bổ sung
 * @returns {JSX.Element}
 */
const FilterBar = ({ 
  statusOptions = [], 
  onStatusChange,
  defaultValue = "all",
  placeholder = "Trạng thái",
  width = "150px",
  className = ""
}) => {
  return (
    <Select 
      defaultValue={defaultValue} 
      style={{ width: width }}
      onChange={onStatusChange}
      placeholder={placeholder}
      suffixIcon={<Filter size={16} />}
      className={className}
    >
      <Option value="all">Tất cả {placeholder.toLowerCase()}</Option>
      {statusOptions.map(option => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

export default FilterBar; 