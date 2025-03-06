import React from "react";
import { Table } from "antd";

const CustomTable = ({ columns, dataSource, loading = false, onRow }) => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      rowKey="id"
      bordered
      loading={loading}
      className="custom-table"
      onRow={onRow}
    />
  );
};

export default CustomTable; 