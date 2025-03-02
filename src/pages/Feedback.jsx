import React, { useState } from "react";
import { 
  Space, 
  Table, 
  Button, 
  Typography, 
  Tag, 
  Popconfirm, 
  message, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Rate, 
  Divider, 
  Row, 
  Col 
} from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import { MessageSquare, Trash2 } from "lucide-react";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Mẫu dữ liệu đánh giá
const initialFeedbacks = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    courseOrMaster: "Master Lê Văn Hòa",
    type: "Bậc thầy",
    rating: 5,
    comment: "Bậc thầy có kiến thức phong phú và giải thích rất dễ hiểu",
    status: "Đã duyệt",
    date: "2023-06-15",
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    courseOrMaster: "Khóa học Phong thủy Koi cơ bản",
    type: "Khóa học",
    rating: 4,
    comment: "Khóa học rất bổ ích, nhưng thời gian hơi ngắn",
    status: "Chờ duyệt",
    date: "2023-06-18",
  },
  {
    id: 3,
    customerName: "Lê Văn C",
    courseOrMaster: "Master Trần Minh Đức",
    type: "Bậc thầy",
    rating: 3,
    comment: "Bậc thầy có kiến thức tốt nhưng cần cải thiện kỹ năng giao tiếp",
    status: "Đã duyệt",
    date: "2023-06-20",
  },
  {
    id: 4,
    customerName: "Phạm Thị D",
    courseOrMaster: "Khóa học Phong thủy Koi nâng cao",
    type: "Khóa học",
    rating: 5,
    comment: "Khóa học rất hay, tôi đã học được nhiều kiến thức mới",
    status: "Đã duyệt",
    date: "2023-06-25",
  },
  {
    id: 5,
    customerName: "Hoàng Văn E",
    courseOrMaster: "Master Nguyễn Thị Tâm",
    type: "Bậc thầy",
    rating: 4,
    comment: "Bậc thầy rất tận tâm và có phương pháp giảng dạy hiệu quả",
    status: "Chờ duyệt",
    date: "2023-06-30",
  },
];

const FeedbackDetail = ({ feedback, visible, onClose }) => {
  return (
    <Modal
      title="Chi tiết đánh giá"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={700}
    >
      <div className="space-y-4">
        <div>
          <p className="text-gray-500">Khách hàng</p>
          <p className="font-medium">{feedback?.customerName}</p>
        </div>
        
        <div>
          <p className="text-gray-500">Đối tượng đánh giá</p>
          <p className="font-medium">{feedback?.courseOrMaster}</p>
        </div>
        
        <div>
          <p className="text-gray-500">Loại</p>
          <Tag color={feedback?.type === "Bậc thầy" ? "blue" : "green"}>
            {feedback?.type}
          </Tag>
        </div>
        
        <div>
          <p className="text-gray-500">Đánh giá</p>
          <Rate disabled defaultValue={feedback?.rating} />
        </div>
        
        <div>
          <p className="text-gray-500">Nội dung</p>
          <p>{feedback?.comment}</p>
        </div>
        
        <div>
          <p className="text-gray-500">Ngày đánh giá</p>
          <p>{feedback?.date}</p>
        </div>
        
        <div>
          <p className="text-gray-500">Trạng thái</p>
          <Tag color={feedback?.status === "Đã duyệt" ? "success" : "warning"}>
            {feedback?.status}
          </Tag>
        </div>
      </div>
    </Modal>
  );
};

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(initialFeedbacks.length);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Hàm tìm kiếm
  const handleSearch = (value) => {
    setSearchTerm(value);
    // Trong thực tế, đây sẽ là API call để tìm kiếm
    console.log("Tìm kiếm với từ khóa:", value);
  };
  
  // Hàm xóa đánh giá
  const handleDelete = (id) => {
    setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
    message.success("Đã xóa đánh giá thành công");
  };
  
  // Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Trong thực tế, đây sẽ là API call để lấy dữ liệu trang mới
  };
  
  // Hàm xem chi tiết đánh giá
  const handleViewDetail = (feedback) => {
    setSelectedFeedback(feedback);
    setDetailModalVisible(true);
  };
  
  // Hàm đóng modal chi tiết
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
  };
  
  // Hàm thay đổi trạng thái đánh giá
  const handleChangeStatus = (id, newStatus) => {
    const updatedFeedbacks = feedbacks.map(feedback => {
      if (feedback.id === id) {
        return { ...feedback, status: newStatus };
      }
      return feedback;
    });
    
    setFeedbacks(updatedFeedbacks);
    message.success(`Đã chuyển trạng thái thành ${newStatus}`);
  };
  
  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Đối tượng đánh giá",
      dataIndex: "courseOrMaster",
      key: "courseOrMaster",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "Bậc thầy" ? "blue" : "green"}>{type}</Tag>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Đã duyệt" ? "success" : "warning"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" size="small" onClick={() => handleViewDetail(record)}>
            Xem chi tiết
          </Button>
          
          {record.status === "Chờ duyệt" ? (
            <Button 
              type="default" 
              size="small" 
              onClick={() => handleChangeStatus(record.id, "Đã duyệt")}
            >
              Duyệt
            </Button>
          ) : (
            <Button 
              type="default" 
              size="small" 
              onClick={() => handleChangeStatus(record.id, "Chờ duyệt")}
            >
              Hủy duyệt
            </Button>
          )}
          
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đánh giá này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <h1 className="text-white text-xl font-semibold">
          Quản lý đánh giá
        </h1>
        <p className="text-white/80 text-sm">
          Quản lý đánh giá của khách hàng về bậc thầy và khóa học phong thủy Koi
        </p>
      </div>

      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <SearchBar
              placeholder="Tìm kiếm theo tên khách hàng, khóa học hoặc bậc thầy"
              onSearch={handleSearch}
            />
            
            <div className="flex gap-2">
              <Select 
                defaultValue="all" 
                style={{ width: 150 }}
                onChange={(value) => console.log("Lọc theo loại:", value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value="master">Bậc thầy</Option>
                <Option value="course">Khóa học</Option>
              </Select>
              
              <Select 
                defaultValue="all" 
                style={{ width: 150 }}
                onChange={(value) => console.log("Lọc theo trạng thái:", value)}
              >
                <Option value="all">Tất cả</Option>
                <Option value="approved">Đã duyệt</Option>
                <Option value="pending">Chờ duyệt</Option>
              </Select>
            </div>
          </div>

          <Table
            columns={columns}
            dataSource={feedbacks}
            rowKey="id"
            pagination={false}
            loading={loading}
          />

          <div className="mt-4 flex justify-end">
            <Pagination
              current={currentPage}
              total={totalItems}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
      
      {selectedFeedback && (
        <FeedbackDetail
          feedback={selectedFeedback}
          visible={detailModalVisible}
          onClose={handleCloseDetailModal}
        />
      )}
    </div>
  );
};

export default Feedback; 