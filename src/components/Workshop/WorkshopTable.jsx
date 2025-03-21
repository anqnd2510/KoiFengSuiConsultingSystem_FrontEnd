import React from 'react';
import { Tag, Space } from 'antd';
import { Eye } from 'lucide-react';
import CustomTable from '../Common/CustomTable';
import CustomButton from '../Common/CustomButton';

const WorkshopTable = ({ workshops, onViewWorkshop, loading }) => {
  const columns = [
    {
      title: 'Tên Workshop',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.name}</div>
          <div className="text-sm text-gray-500">{record.location}</div>
        </div>
      ),
    },
    {
      title: 'Ngày tổ chức',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
    },
    {
      title: 'Giá vé',
      dataIndex: 'ticketPrice',
      key: 'ticketPrice',
      width: '15%',
    },
    {
      title: 'Số lượng vé',
      dataIndex: 'ticketSlots',
      key: 'ticketSlots',
      width: '15%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status) => {
        let color = 'blue';
        if (status === 'Đang diễn ra') color = 'green';
        if (status === 'Đã kết thúc') color = 'gray';
        if (status === 'Đã hủy') color = 'red';
        if (status === 'Chờ duyệt') color = 'orange';
        if (status === 'Từ chối') color = 'red';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '15%',
      render: (_, record) => (
        <Space size="middle">
          <CustomButton
            type="primary"
            size="small"
            icon={<Eye size={16} />}
            onClick={() => onViewWorkshop(record)}
            className="bg-blue-500"
          >
            Xem chi tiết
          </CustomButton>
        </Space>
      ),
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

export default WorkshopTable;