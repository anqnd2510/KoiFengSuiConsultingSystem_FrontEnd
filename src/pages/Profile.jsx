import React, { useState, useEffect } from "react";
import { Form, Input, message, Row, Col } from "antd";
import { User, Mail, Phone, Calendar } from "lucide-react";
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
      console.log("Dob value:", response?.dob);

      if (response) {
        let formattedBirthDate = "";
        if (response.dob) {
          console.log("Original dob:", response.dob);
          try {
            const date = new Date(response.dob);
            console.log("Date object:", date);
            
            if (!isNaN(date.getTime())) {
              formattedBirthDate = date.toISOString().split('T')[0];
            } else {
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
          birthDate: formattedBirthDate
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
      
      console.log("Updating profile with data:", values);
      
      message.success("Cập nhật thông tin thành công!");
      await fetchUserInfo();
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
    <div className="min-h-screen bg-[#f4f7fe]">
      <Header 
        title="Thông tin cá nhân"
        description="Xem và cập nhật thông tin cá nhân của bạn"
      />

      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <Error 
            message={error}
            className="mb-6" 
          />
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#90B77D] rounded-full flex items-center justify-center mx-auto mb-4">
                
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{userInfo.fullName}</h3>
              <p className="text-gray-500 mt-1">{userInfo.email}</p>
            </div>
          </div>

          <div className="p-8">
            <Row gutter={[32, 32]}>
              <Col xs={24} lg={12}>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Thông tin hiện tại</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-[#90B77D] bg-opacity-10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-[#90B77D]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">{userInfo.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-[#90B77D] bg-opacity-10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-[#90B77D]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium text-gray-800">{userInfo.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-[#90B77D] bg-opacity-10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#90B77D]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày sinh</p>
                        <p className="font-medium text-gray-800">{userInfo.birthDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Cập nhật thông tin</h4>
                  <Form
                    form={form}
                    layout="vertical"
                    disabled={loading}
                  >
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
                        className="rounded-lg py-2" 
                      />
                    </Form.Item>
                    
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
                        className="rounded-lg py-2"
                      />
                    </Form.Item>
                    
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
                        className="rounded-lg py-2" 
                      />
                    </Form.Item>
                    
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
                        className="rounded-lg py-2"
                      />
                    </Form.Item>

                    <div className="flex justify-end">
                      <CustomButton
                        type="primary"
                        onClick={handleUpdateProfile}
                        loading={loading}
                        className="px-6 py-2 bg-[#90B77D] hover:bg-[#829e72] border-none rounded-lg"
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
        .ant-input-affix-wrapper {
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }
        .ant-input-affix-wrapper:hover,
        .ant-input-affix-wrapper-focused {
          border-color: #90B77D !important;
          box-shadow: 0 0 0 2px rgba(144, 183, 125, 0.1) !important;
        }
        .ant-form-item-label > label {
          font-weight: 500;
          color: #374151;
        }
        .ant-input[type="date"] {
          padding: 6px 12px;
        }
      `}</style>
    </div>
  );
};

export default Profile;
