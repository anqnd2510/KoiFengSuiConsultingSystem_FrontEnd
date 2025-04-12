import React from 'react';
import { Tag, Space } from 'antd';
import { Eye, MapPin, Calendar } from 'lucide-react';
import CustomTable from '../Common/CustomTable';
import CustomButton from '../Common/CustomButton';

const WorkshopTable = ({ workshops, onViewWorkshop, loading }) => {
  const columns = [
    {
      title: 'Tên hội thảo',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (text) => (
        <div className="font-medium">{text}</div>
      ),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
      width: '20%',
      render: (location) => (
        <div className="flex items-center">
          <MapPin size={16} className="mr-2 text-gray-500" />
          {location}
        </div>
      ),
    },
    {
      title: 'Ngày tổ chức',
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      render: (date) => (
        <div className="flex items-center">
          <Calendar size={16} className="mr-2 text-gray-500" />
          {date}
        </div>
      ),
    },
    {
      title: 'Giá vé',
      dataIndex: 'ticketPrice',
      key: 'ticketPrice',
      width: '12%',
      render: (price) => (
        <div>{price?.toLocaleString('vi-VN')} VND</div>
      ),
    },
    {
      title: 'Số lượng vé',
      dataIndex: 'ticketSlots',
      key: 'ticketSlots',
      width: '10%',
      render: (slots) => (
        <div className="text-center">{slots}</div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
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
      width: '8%',
      render: (_, record) => (
        <Space size="middle">
          <CustomButton
            type="primary"
            size="small"
            icon={<Eye size={16} />}
            onClick={() => onViewWorkshop(record)}
            className="bg-blue-500"
          >
            Xem
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