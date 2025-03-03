import React from 'react';
import CustomTable from '../Common/CustomTable';

const WorkshopTableManager = ({ workshops, loading }) => {
  const columns = [
    {
      title: 'Mã hội thảo',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
    },
    {
      title: 'Tên hội thảo',
      dataIndex: 'name',
      key: 'name',
      width: '45%',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      width: '25%',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
    },
  ];

  return (
    <CustomTable
      columns={columns}
      dataSource={workshops}
      loading={loading}
    />
  );
};

export default WorkshopTableManager;