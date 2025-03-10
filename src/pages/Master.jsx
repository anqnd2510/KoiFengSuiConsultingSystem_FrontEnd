import React, { useState, useEffect } from "react";
import dayjs from 'dayjs';
import { 
  Space, 
  Table, 
  Typography, 
  Tag, 
  Popconfirm, 
  message, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  TimePicker, 
  Divider, 
  Row, 
  Col,
  Upload,
  InputNumber,
  Rate
} from "antd";
import SearchBar from "../components/Common/SearchBar";
import Pagination from "../components/Common/Pagination";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import { User, Trash2, Award, Calendar, Clock, UploadCloud, Star } from "lucide-react";
import CustomTable from "../components/Common/CustomTable";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = TimePicker;

// Component form cho Master Phong Thủy
const MasterForm = ({ form, initialData, loading }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
      initialValues={initialData || {}}
    >
      <Row gutter={16}>
        <Col span={24} md={12}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input placeholder="Nhập họ và tên bậc thầy" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} md={12}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Cấp bậc"
            name="level"
            rules={[{ required: true, message: "Vui lòng chọn cấp bậc" }]}
          >
            <Select placeholder="Chọn cấp bậc">
              <Option value="Cao cấp">Cao cấp</Option>
              <Option value="Trung cấp">Trung cấp</Option>
              <Option value="Sơ cấp">Sơ cấp</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} md={12}>
          <Form.Item
            label="Kinh nghiệm (năm)"
            name="experience"
            rules={[{ required: true, message: "Vui lòng nhập số năm kinh nghiệm" }]}
          >
            <InputNumber min={0} placeholder="Nhập số năm kinh nghiệm" style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item
            label="Đánh giá"
            name="rating"
            rules={[{ required: true, message: "Vui lòng chọn đánh giá" }]}
          >
            <Rate />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Chuyên môn"
        name="expertise"
        rules={[{ required: true, message: "Vui lòng nhập chuyên môn" }]}
      >
        <Select mode="multiple" placeholder="Chọn chuyên môn">
          <Option value="Phong thủy hồ Koi">Phong thủy hồ Koi</Option>
          <Option value="Tư vấn thiết kế hồ">Tư vấn thiết kế hồ</Option>
          <Option value="Cách bài trí cá Koi">Cách bài trí cá Koi</Option>
          <Option value="Phong thủy nhà ở">Phong thủy nhà ở</Option>
          <Option value="Phong thủy văn phòng">Phong thủy văn phòng</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Thời gian làm việc"
        name="workingHours"
        rules={[{ required: true, message: "Vui lòng chọn thời gian làm việc" }]}
      >
        <RangePicker format="HH:mm" />
      </Form.Item>

      <Form.Item
        label="Ngày làm việc"
        name="workingDays"
        rules={[{ required: true, message: "Vui lòng chọn ngày làm việc" }]}
      >
        <Select mode="multiple" placeholder="Chọn ngày làm việc">
          <Option value="Thứ 2">Thứ 2</Option>
          <Option value="Thứ 3">Thứ 3</Option>
          <Option value="Thứ 4">Thứ 4</Option>
          <Option value="Thứ 5">Thứ 5</Option>
          <Option value="Thứ 6">Thứ 6</Option>
          <Option value="Thứ 7">Thứ 7</Option>
          <Option value="Chủ nhật">Chủ nhật</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Ảnh đại diện"
        name="avatar"
      >
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false} // Ngăn tự động upload
        >
          <div className="flex flex-col items-center">
            <UploadCloud className="w-6 h-6 text-gray-400" />
            <div className="mt-2">Upload</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Giới thiệu"
        name="bio"
        rules={[{ required: true, message: "Vui lòng nhập thông tin giới thiệu" }]}
      >
        <TextArea
          placeholder="Nhập thông tin giới thiệu về bậc thầy"
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
      </Form.Item>
    </Form>
  );
};

const Master = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [error, setError] = useState(null);
  
  // States cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  // States cho modal xem chi tiết
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewMaster, setViewMaster] = useState(null);

  // Mock data cho danh sách bậc thầy
  const initialData = [
    {
      id: 1,
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      level: "Cao cấp",
      experience: 15,
      rating: 5,
      expertise: ["Phong thủy hồ Koi", "Tư vấn thiết kế hồ"],
      workingHours: ["08:00", "17:00"],
      workingDays: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
      bio: "Chuyên gia phong thủy với hơn 15 năm kinh nghiệm trong lĩnh vực thiết kế và bố trí hồ cá Koi.",
      avatar: "https://example.com/avatar1.jpg"
    },
    {
      id: 2,
      fullName: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0912345678",
      level: "Trung cấp",
      experience: 8,
      rating: 4,
      expertise: ["Cách bài trí cá Koi", "Phong thủy nhà ở"],
      workingHours: ["09:00", "18:00"],
      workingDays: ["Thứ 2", "Thứ 4", "Thứ 6", "Thứ 7"],
      bio: "Chuyên gia tư vấn phong thủy nhà ở với sở trường về bài trí cá Koi trong không gian sống.",
      avatar: "https://example.com/avatar2.jpg"
    },
    {
      id: 3,
      fullName: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0923456789",
      level: "Cao cấp",
      experience: 20,
      rating: 5,
      expertise: ["Phong thủy văn phòng", "Phong thủy hồ Koi"],
      workingHours: ["10:00", "19:00"],
      workingDays: ["Thứ 3", "Thứ 5", "Thứ 7", "Chủ nhật"],
      bio: "Bậc thầy phong thủy với chuyên môn về không gian làm việc và kết hợp yếu tố nước trong văn phòng.",
      avatar: "https://example.com/avatar3.jpg"
    },
    {
      id: 4,
      fullName: "Phạm Thị D",
      email: "phamthid@example.com",
      phone: "0934567890",
      level: "Sơ cấp",
      experience: 3,
      rating: 3,
      expertise: ["Tư vấn thiết kế hồ"],
      workingHours: ["08:30", "17:30"],
      workingDays: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"],
      bio: "Chuyên viên tư vấn thiết kế hồ mới vào nghề, có kiến thức tốt về các loại hồ cá Koi phù hợp với từng không gian.",
      avatar: "https://example.com/avatar4.jpg"
    },
  ];

  const [data, setData] = useState(initialData);

  // Hàm xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  // Hàm xóa Master
  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
    message.success("Đã xóa bậc thầy thành công");
  };

  // Hàm chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm mở modal để tạo mới
  const handleOpenCreateModal = () => {
    setSelectedMaster(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Hàm mở modal để chỉnh sửa
  const handleOpenEditModal = (master) => {
    try {
      // Đảm bảo reset form trước khi thiết lập giá trị mới
      form.resetFields();
      
      // Lưu thông tin master được chọn
      setSelectedMaster({...master});
      
      // Thiết lập giá trị cho form
      const formValues = {
        fullName: master.fullName,
        email: master.email,
        phone: master.phone,
        level: master.level,
        experience: master.experience,
        rating: master.rating,
        expertise: master.expertise,
        workingDays: master.workingDays,
        bio: master.bio,
      };
      
      // Xử lý workingHours nếu có
      if (master.workingHours && Array.isArray(master.workingHours) && master.workingHours.length === 2) {
        // Nếu workingHours là mảng chuỗi, chuyển đổi sang định dạng phù hợp cho TimePicker
        formValues.workingHours = [
          master.workingHours[0] ? dayjs(master.workingHours[0], 'HH:mm') : null,
          master.workingHours[1] ? dayjs(master.workingHours[1], 'HH:mm') : null,
        ];
      }
      
      // Thiết lập giá trị cho form
      form.setFieldsValue(formValues);
      
      // Mở modal sau khi đã thiết lập giá trị
      setIsModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi mở modal chỉnh sửa:", error);
      message.error("Có lỗi xảy ra khi mở form chỉnh sửa. Vui lòng thử lại.");
    }
  };

  // Đóng modal
  const handleCloseModal = () => {
    // Đóng modal trước
    setIsModalOpen(false);
    
    // Sau đó xóa dữ liệu sau khi animation đóng hoàn tất
    setTimeout(() => {
      setSelectedMaster(null);
      form.resetFields();
    }, 300);
  };

  // Hàm lưu dữ liệu
  const handleSave = () => {
    form.validateFields().then((values) => {
      try {
        setLoading(true);
        
        // Xử lý dữ liệu trước khi lưu
        const processedValues = {...values};
        
        // Chuyển đổi workingHours từ dayjs object sang string
        if (processedValues.workingHours && Array.isArray(processedValues.workingHours) && processedValues.workingHours.length === 2) {
          processedValues.workingHours = [
            processedValues.workingHours[0] ? processedValues.workingHours[0].format('HH:mm') : '',
            processedValues.workingHours[1] ? processedValues.workingHours[1].format('HH:mm') : ''
          ];
        }
        
        setTimeout(() => {
          if (selectedMaster) {
            // Cập nhật
            const newData = data.map(item => {
              if (item.id === selectedMaster.id) {
                return {
                  ...item,
                  ...processedValues
                };
              }
              return item;
            });
            setData(newData);
            message.success("Đã cập nhật thông tin bậc thầy thành công");
          } else {
            // Tạo mới
            const newId = Math.max(...data.map(item => item.id), 0) + 1;
            const newMaster = {
              id: newId,
              ...processedValues
            };
            setData([...data, newMaster]);
            message.success("Đã tạo mới bậc thầy thành công");
          }
          
          setLoading(false);
          handleCloseModal();
        }, 1000);
      } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
        message.error("Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.");
        setLoading(false);
      }
    }).catch(error => {
      console.error("Lỗi khi xác thực form:", error);
    });
  };

  // Hàm mở modal để xem chi tiết
  const handleOpenViewModal = (master) => {
    setViewMaster(master);
    setIsViewModalOpen(true);
  };

  // Đóng modal xem chi tiết
  const handleCloseViewModal = () => {
    // Đóng modal trước
    setIsViewModalOpen(false);
    
    // Sau đó xóa dữ liệu sau khi animation đóng hoàn tất
    setTimeout(() => {
      setViewMaster(null);
    }, 300);
  };

  // Cấu hình các cột cho bảng
  const columns = [
    {
      title: "Bậc thầy",
      dataIndex: "fullName",
      key: "fullName",
      width: "15%",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <img
              src={record.avatar}
              alt={record.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/40?text=Master";
              }}
            />
          </div>
          <div>
            <div className="font-medium">{record.fullName}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Cấp bậc",
      dataIndex: "level",
      key: "level",
      width: "10%",
      render: (level) => {
        let color = "blue";
        if (level === "Cao cấp") color = "gold";
        if (level === "Trung cấp") color = "green";
        if (level === "Sơ cấp") color = "blue";
        return <Tag color={color}>{level}</Tag>;
      },
    },
    {
      title: "Kinh nghiệm & Đánh giá",
      key: "experience",
      width: "15%",
      render: (_, record) => (
        <div>
          <div>
            <Award className="inline-block mr-1 w-4 h-4" /> 
            {record.experience} năm kinh nghiệm
          </div>
          <div className="mt-1">
            <Rate disabled defaultValue={record.rating} />
          </div>
        </div>
      ),
    },
    {
      title: "Chuyên môn",
      key: "expertise",
      dataIndex: "expertise",
      width: "15%",
      render: (expertise) => (
        <>
          {expertise.map(tag => (
            <Tag color="blue" key={tag} className="mb-1 mr-1">
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Thời gian làm việc",
      key: "workingTime",
      width: "20%",
      render: (_, record) => (
        <div>
          <div>
            <Clock className="inline-block mr-1 w-4 h-4" /> 
            {record.workingHours && Array.isArray(record.workingHours) && record.workingHours.length === 2 ? 
              `${record.workingHours[0]} - ${record.workingHours[1]}` : 'Chưa có thông tin'}
          </div>
          <div className="mt-1">
            <Calendar className="inline-block mr-1 w-4 h-4" /> 
            {record.workingDays.join(", ")}
          </div>
        </div>
      ),
    },
    {
      title: "Giới thiệu",
      dataIndex: "bio",
      key: "bio",
      width: "10%",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <CustomButton 
            type="default" 
            size="small"
            onClick={() => handleOpenViewModal(record)}
            className="!bg-blue-500 hover:!bg-blue-600 !text-white"
          >
            Xem chi tiết
          </CustomButton>
          <CustomButton 
            type="default" 
            size="small"
            onClick={() => handleOpenEditModal(record)}
            className="!bg-transparent hover:!bg-blue-50 !text-blue-500 !border !border-blue-500"
          >
            Chỉnh sửa
          </CustomButton>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bậc thầy này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <CustomButton type="text" danger size="small" icon={<Trash2 size={16} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Lọc dữ liệu theo tìm kiếm
  const filteredData = data.filter((item) =>
    item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase()) ||
    item.level.toLowerCase().includes(searchText.toLowerCase())
  );

  // Phân trang dữ liệu
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý bậc thầy phong thủy Koi"
        description="Quản lý thông tin và danh sách các bậc thầy phong thủy Koi"
      />

      {/* Main Content */}
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <div className="flex gap-2 mb-4">
            <CustomButton type="primary" onClick={handleOpenCreateModal}>Thêm bậc thầy mới</CustomButton>
          </div>
          <SearchBar
            placeholder="Tìm kiếm theo tên, email, cấp bậc..."
            onSearch={handleSearch}
            className="w-64"
          />
        </div>

        {error && <Error message={error} />}

        <CustomTable
          columns={columns}
          dataSource={paginatedData}
          loading={loading}
        />

        <div className="mt-4 flex justify-end">
          <Pagination
            current={currentPage}
            total={filteredData.length}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal for Create/Edit */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            {selectedMaster ? "Chỉnh sửa thông tin bậc thầy" : "Thêm bậc thầy mới"}
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={700}
        className="master-modal"
        maskClosable={true}
        destroyOnClose={true}
        closable={true}
        mask={true}
      >
        <div className="p-4">
          <MasterForm
            form={form}
            initialData={selectedMaster}
            loading={loading}
          />
          
          <div className="flex justify-end gap-3 mt-6">
            <CustomButton onClick={handleCloseModal}>
              Hủy bỏ
            </CustomButton>
            <CustomButton type="primary" className="bg-blue-500" onClick={handleSave} loading={loading}>
              {selectedMaster ? "Cập nhật" : "Tạo mới"}
            </CustomButton>
          </div>
        </div>
      </Modal>

      {/* Modal xem chi tiết */}
      <Modal
        title={
          <div className="text-xl font-semibold">
            Chi tiết thông tin bậc thầy
          </div>
        }
        open={isViewModalOpen}
        onCancel={handleCloseViewModal}
        footer={null}
        width={700}
        className="master-view-modal"
        maskClosable={true}
        destroyOnClose={true}
        closable={true}
        mask={true}
      >
        {viewMaster && (
          <div className="p-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 overflow-hidden rounded-full">
                <img
                  src={viewMaster.avatar}
                  alt={viewMaster.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80?text=Master";
                  }}
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">{viewMaster.fullName}</h2>
                <Tag color={
                  viewMaster.level === "Cao cấp" ? "gold" : 
                  viewMaster.level === "Trung cấp" ? "green" : "blue"
                } className="mt-1">
                  {viewMaster.level}
                </Tag>
              </div>
            </div>
            
            <Divider />
            
            <Row gutter={[16, 16]}>
              <Col span={24} md={12}>
                <div className="mb-4">
                  <p className="text-gray-500 mb-1">Email</p>
                  <p className="font-medium">{viewMaster.email}</p>
                </div>
              </Col>
              
              <Col span={24} md={12}>
                <div className="mb-4">
                  <p className="text-gray-500 mb-1">Số điện thoại</p>
                  <p className="font-medium">{viewMaster.phone}</p>
                </div>
              </Col>
              
              <Col span={24} md={12}>
                <div className="mb-4">
                  <p className="text-gray-500 mb-1">Kinh nghiệm</p>
                  <p className="font-medium">{viewMaster.experience} năm</p>
                </div>
              </Col>
              
              <Col span={24} md={12}>
                <div className="mb-4">
                  <p className="text-gray-500 mb-1">Đánh giá</p>
                  <Rate disabled value={viewMaster.rating} />
                </div>
              </Col>
              
              <Col span={24}>
                <div className="mb-4">
                  <p className="text-gray-500 mb-1">Chuyên môn</p>
                  <div>
                    {viewMaster.expertise.map(tag => (
                      <Tag color="blue" key={tag} className="mb-1 mr-1">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
              
              <Col span={24} md={12}>
                <div className="mb-4">
                  <p className="text-gray-500 mb-1">Thời gian làm việc</p>
                  <p className="font-medium">
                    {viewMaster.workingHours && Array.isArray(viewMaster.workingHours) && viewMaster.workingHours.length === 2 ? 
                      `${viewMaster.workingHours[0]} - ${viewMaster.workingHours[1]}` : 'Chưa có thông tin'}
                  </p>
                </div>
              </Col>
              
              <Col span={24} md={12}>
                <div className="mb-4">
                  <p className="text-gray-500 mb-1">Ngày làm việc</p>
                  <p className="font-medium">{viewMaster.workingDays.join(", ")}</p>
                </div>
              </Col>
              
              <Col span={24}>
                <div className="mb-4">
                  <p className="text-gray-500 mb-1">Giới thiệu</p>
                  <p>{viewMaster.bio}</p>
                </div>
              </Col>
            </Row>
            
            <div className="flex justify-end mt-6">
              <CustomButton onClick={handleCloseViewModal}>
                Đóng
              </CustomButton>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .master-modal .ant-modal-content,
        .master-view-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .master-modal .ant-modal-header,
        .master-view-modal .ant-modal-header {
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 24px;
        }
        .master-modal .ant-modal-body,
        .master-view-modal .ant-modal-body {
          padding: 12px;
        }
        .master-modal .ant-modal-footer,
        .master-view-modal .ant-modal-footer {
          border-top: 1px solid #f0f0f0;
        }
        .master-modal .ant-modal-close,
        .master-view-modal .ant-modal-close {
          color: rgba(0, 0, 0, 0.45);
        }
        .master-modal .ant-modal-close:hover,
        .master-view-modal .ant-modal-close:hover {
          color: rgba(0, 0, 0, 0.75);
        }
        .master-modal .ant-modal-mask,
        .master-view-modal .ant-modal-mask {
          background-color: rgba(0, 0, 0, 0.45);
        }
      `}</style>
    </div>
  );
};

export default Master;