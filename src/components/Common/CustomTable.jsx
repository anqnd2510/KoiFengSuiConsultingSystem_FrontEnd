import React from "react";
import { Table } from "antd";

const CustomTable = ({ columns, dataSource, loading = false }) => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey="id"
      bordered
      loading={loading}
      className="custom-table"
    />
  );
};

export default CustomTable; 