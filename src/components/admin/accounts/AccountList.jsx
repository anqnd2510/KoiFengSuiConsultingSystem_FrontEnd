import { Table } from "antd";

const AccountList = ({ data, loading, columns }) => {
  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="accountId"
      loading={loading}
      pagination={{
        total: data?.length || 0,
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Tổng số ${total} tài khoản`,
      }}
    />
  );
};

export default AccountList;
