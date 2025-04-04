import React from "react";
import { Table } from "antd";

const CustomTable = ({
  columns,
  dataSource,
  loading = false,
  onRow,
  onRowClick,
}) => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey="id"
      bordered
      loading={loading}
      className="custom-table"
      onRow={
        onRowClick
          ? (record) => ({
              onClick: () => onRowClick(record),
              style: { cursor: "pointer" },
            })
          : null
      }
    />
  );
};

export default CustomTable;
