import React from 'react';
import { Tag } from 'antd';
import CustomTable from '../Common/CustomTable';
import { Link } from "react-router-dom";
import StatusBadge from "../Common/StatusBadge";

const BookingTable = ({ bookings, loading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'done':
        return 'success';
      case 'cancel':
        return 'error';
      case 'scheduled':
        return 'processing';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      width: '20%',
      render: (text, record) => (
        <Link
          to={`/booking-schedule/${record.id}`}
          className="text-blue-600 hover:text-blue-800 hover:underline"
        >
          {text}
        </Link>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      width: '10%',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      width: '15%',
    },
    {
      title: 'Bậc thầy',
      dataIndex: 'master',
      key: 'master',
      width: '15%',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === 'pending' ? 'Chờ xử lý' :
           status === 'done' ? 'Hoàn thành' :
           status === 'cancel' ? 'Đã hủy' :
           status === 'scheduled' ? 'Đã lên lịch' : status}
        </Tag>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      dataSource={bookings}
      loading={loading}
    />
  );
};

export default BookingTable;
