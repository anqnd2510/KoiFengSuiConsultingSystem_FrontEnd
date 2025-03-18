import { Form, Input, Select, Space } from "antd";

const AccountFilters = ({ filters, onFiltersChange }) => {
  const roleOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Admin", value: "Admin" },
    { label: "Manager", value: "Manager" },
    { label: "Staff", value: "Staff" },
    { label: "Customer", value: "Customer" },
    { label: "Master", value: "Master" },
  ];

  const statusOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Hoạt động", value: true },
    { label: "Vô hiệu", value: false },
  ];

  const handleSearch = (value) => {
    onFiltersChange({ ...filters, searchText: value });
  };

  const handleRoleChange = (value) => {
    onFiltersChange({ ...filters, role: value });
  };

  const handleStatusChange = (value) => {
    onFiltersChange({ ...filters, status: value });
  };

  return (
    <div className="bg-white p-4 mb-4 rounded-lg shadow">
      <Space wrap>
        <Input.Search
          placeholder="Tìm kiếm theo tên, email, số điện thoại"
          value={filters.searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />

        <Select
          placeholder="Lọc theo vai trò"
          value={filters.role}
          onChange={handleRoleChange}
          options={roleOptions}
          style={{ width: 150 }}
        />

        <Select
          placeholder="Lọc theo trạng thái"
          value={filters.status}
          onChange={handleStatusChange}
          options={statusOptions}
          style={{ width: 150 }}
        />
      </Space>
    </div>
  );
};

export default AccountFilters;
