import React, { useState, useEffect } from "react";
import { Form, Input, Upload, message, Row, Col, Divider } from "antd";
import { UploadCloud, User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import Header from "../components/Common/Header";
import CustomButton from "../components/Common/CustomButton";
import Error from "../components/Common/Error";
import { getCurrentUser } from "../services/auth.service";

const Profile = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await getCurrentUser();
      
      console.log("Response from getCurrentUser:", response);
      console.log("Dob value:", response?.dob); // Log giá trị dob

      if (response) {
        // Xử lý ngày sinh từ trường dob
        let formattedBirthDate = "";
        if (response.dob) {
          console.log("Original dob:", response.dob);
          try {
            // Thử nhiều cách format khác nhau
            const date = new Date(response.dob);
            console.log("Date object:", date);
            
            if (!isNaN(date.getTime())) {
              // Nếu là date hợp lệ
              formattedBirthDate = date.toISOString().split('T')[0];
            } else {
              // Nếu là string format khác, thử parse trực tiếp
              formattedBirthDate = response.dob.split('T')[0];
            }
            console.log("Formatted birth date:", formattedBirthDate);
          } catch (error) {
            console.error("Error formatting date:", error);
          }
        }

        const userData = {
          fullName: response.fullName || response.userName || "",
          email: response.email || "",
          phone: response.phone || response.phoneNumber || "",
          address: response.address || "",
          birthDate: formattedBirthDate,
          avatar: response.avatar || response.imageUrl || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop"
        };

        console.log("Processed user data:", userData);

        setUserInfo(userData);
        form.setFieldsValue(userData);
      } else {
        setError("Không thể tải thông tin người dùng");
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError("Có lỗi xảy ra khi tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // TODO: Call API to update profile
      console.log("Updating profile with data:", values);
      
      message.success("Cập nhật thông tin thành công!");
      await fetchUserInfo(); // Refresh user info after update
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.errorFields) {
        message.error("Vui lòng điền đầy đủ thông tin");
      } else {
        message.error("Có lỗi xảy ra khi cập nhật thông tin");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (info) => {
    if (info.file.status === 'done') {
      message.success('Tải ảnh lên thành công');
      // TODO: Update avatar URL
    } else if (info.file.status === 'error') {
      message.error('Tải ảnh lên thất bại');
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Đang tải thông tin...</div>
          {error && <Error message={error} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Thông tin cá nhân"
        description="Xem và cập nhật thông tin cá nhân của bạn"
      />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {error && (
              <Error 
                message={error}
                className="mb-6" 
              />
            )}

            <Row gutter={[24, 0]}>
              <Col xs={24} md={8}>
                <div className="text-center mb-6">
                  <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    onChange={handleAvatarChange}
                    beforeUpload={() => false}
                  >
                    {userInfo.avatar ? (
                      <img 
                        src={userInfo.avatar} 
                        alt="avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <UploadCloud className="w-6 h-6 text-gray-400" />
                        <div className="mt-2">Tải ảnh lên</div>
                      </div>
                    )}
                  </Upload>
                  <h3 className="text-lg font-semibold mt-4">{userInfo.fullName}</h3>
                  <p className="text-gray-500">{userInfo.email}</p>
                </div>

                <Divider />

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-5 h-5" />
                    <span>{userInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <span>{userInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{userInfo.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>{userInfo.birthDate}</span>
                  </div>
                </div>
              </Col>

              <Col xs={24} md={16}>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-6">Chỉnh sửa thông tin</h3>
                  
                  <Form
                    form={form}
                    layout="vertical"
                    disabled={loading}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Họ và tên"
                          name="fullName"
                          rules={[
                            { required: true, message: "Vui lòng nhập họ và tên" },
                            { whitespace: true, message: "Họ và tên không được chỉ chứa khoảng trắng" }
                          ]}
                        >
                          <Input 
                            prefix={<User className="w-4 h-4 text-gray-400" />}
                            placeholder="Nhập họ và tên" 
                          />
                        </Form.Item>
                      </Col>
                      
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Email"
                          name="email"
                          rules={[
                            { required: true, message: "Vui lòng nhập email" },
                            { type: "email", message: "Email không hợp lệ" }
                          ]}
                        >
                          <Input 
                            prefix={<Mail className="w-4 h-4 text-gray-400" />}
                            placeholder="Nhập email" 
                            disabled
                          />
                        </Form.Item>
                      </Col>
                      
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Số điện thoại"
                          name="phone"
                          rules={[
                            { required: true, message: "Vui lòng nhập số điện thoại" },
                            { pattern: /^[0-9]+$/, message: "Số điện thoại chỉ được chứa số" }
                          ]}
                        >
                          <Input 
                            prefix={<Phone className="w-4 h-4 text-gray-400" />}
                            placeholder="Nhập số điện thoại" 
                          />
                        </Form.Item>
                      </Col>
                      
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Ngày sinh"
                          name="birthDate"
                          rules={[
                            { required: true, message: "Vui lòng nhập ngày sinh" }
                          ]}
                        >
                          <Input 
                            prefix={<Calendar className="w-4 h-4 text-gray-400" />}
                            type="date"
                          />
                        </Form.Item>
                      </Col>
                      
                      <Col span={24}>
                        <Form.Item
                          label="Địa chỉ"
                          name="address"
                          rules={[
                            { required: true, message: "Vui lòng nhập địa chỉ" }
                          ]}
                        >
                          <Input 
                            prefix={<MapPin className="w-4 h-4 text-gray-400" />}
                            placeholder="Nhập địa chỉ" 
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <div className="flex justify-end mt-6">
                      <CustomButton
                        type="primary"
                        onClick={handleUpdateProfile}
                        loading={loading}
                      >
                        Cập nhật thông tin
                      </CustomButton>
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .avatar-uploader .ant-upload {
          width: 128px !important;
          height: 128px !important;
        }
        .avatar-uploader .ant-upload img {
          width: 128px;
          height: 128px;
          border-radius: 50%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};

export default Profile;
