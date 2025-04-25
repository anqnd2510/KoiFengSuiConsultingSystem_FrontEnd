import React, { useState, useEffect } from "react";
import { Form, Input, message, Row, Col, Modal, Upload, Select } from "antd";
import { User, Mail, Phone, Calendar, Pencil, UploadCloud } from "lucide-react";
import Header from "../components/Common/Header";
import CustomButton from "../components/Common/CustomButton";
import Error from "../components/Common/Error";
import { getCurrentUser } from "../services/auth.service";
import { editProfile, changePassword } from "../services/account.service";

const Profile = () => {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);

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
          birthDate: formattedBirthDate,
          gender: response.gender
        };

        console.log("Processed user data:", userData);

        setUserInfo(userData);
        form.setFieldsValue(userData);
        
        editForm.setFieldsValue({
          ...userData,
          gender: userData.gender ? 'Nữ' : 'Nam'
        });
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

  const showEditModal = () => {
    editForm.setFieldsValue({
      fullName: userInfo.fullName,
      phone: userInfo.phone,
      birthDate: userInfo.birthDate,
      gender: userInfo.gender ? 'Nữ' : 'Nam',
      avatar: []
    });
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  const handleUpdateProfile = async () => {
    try {
      const values = await editForm.validateFields();
      setLoading(true);
      
      // Format dữ liệu theo đúng yêu cầu của BE
      const updateData = {
        userName: values.fullName?.trim(),
        email: userInfo.email,
        phoneNumber: values.phone?.trim(),
        fullName: values.fullName?.trim(),
        dob: values.birthDate,
        // Chỉ cập nhật gender nếu có thay đổi
        ...(values.gender !== (userInfo.gender ? 'Nữ' : 'Nam') && {
          gender: values.gender === 'Nữ'
        }),
        // Thêm các trường khác nếu cần
        bankId: values.bankId,
        accountNo: values.accountNo,
        accountName: values.accountName
      };

      // Nếu có file ảnh, thêm vào updateData
      if (values.avatar && values.avatar[0]?.originFileObj) {
        updateData.imageUrl = values.avatar[0].originFileObj;
      }

      // Log để kiểm tra dữ liệu trước khi gửi
      console.log("Update data:", updateData);

      try {
        const response = await editProfile(updateData);
        console.log("Response from BE:", response);

        if (response && response.statusCode === 200) {
          message.success(response.message || "Cập nhật thông tin thành công!");
          setIsEditModalVisible(false);
          await fetchUserInfo();
          editForm.resetFields();
        } else {
          message.error(response?.message || "Có lỗi xảy ra khi cập nhật thông tin");
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        if (apiError.response?.data?.message) {
          message.error(apiError.response.data.message);
        } else {
          message.error("Có lỗi xảy ra khi gọi API cập nhật thông tin");
        }
      }
    } catch (error) {
      console.error("Form validation error:", error);
      message.error("Vui lòng kiểm tra lại thông tin nhập vào");
    } finally {
      setLoading(false);
    }
  };

  const showChangePasswordModal = () => {
    changePasswordForm.resetFields();
    setIsChangePasswordModalVisible(true);
  };

  const handleChangePasswordCancel = () => {
    setIsChangePasswordModalVisible(false);
    changePasswordForm.resetFields();
  };

  const handleChangePassword = async () => {
    try {
      const values = await changePasswordForm.validateFields();
      setLoading(true);

      const passwordData = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      };

      const response = await changePassword(passwordData);
      
      if (response && response.statusCode === 200) {
        message.success(response.message || "Đổi mật khẩu thành công!");
        setIsChangePasswordModalVisible(false);
        changePasswordForm.resetFields();
      } else {
        message.error(response?.message || "Có lỗi xảy ra khi đổi mật khẩu");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Có lỗi xảy ra khi đổi mật khẩu");
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
            <div className="text-center relative">
              <div className="w-24 h-24 bg-[#90B77D] rounded-full flex items-center justify-center mx-auto mb-4 relative">
                {userInfo.avatar ? (
                  <img 
                    src={userInfo.avatar} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
                <button 
                  onClick={showEditModal}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Pencil className="w-4 h-4 text-gray-600" />
                </button>
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
                    <div className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-[#90B77D] bg-opacity-10 flex items-center justify-center">
                        <User className="w-5 h-5 text-[#90B77D]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Giới tính</p>
                        <p className="font-medium text-gray-800">{userInfo.gender ? 'Nữ' : 'Nam'}</p>
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
                        onClick={showChangePasswordModal}
                        className="px-6 py-2 bg-[#42A5F5] hover:bg-[#1976D2] border-none rounded-lg flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        Đổi mật khẩu
                      </CustomButton>
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* Modal Chỉnh sửa thông tin */}
      <Modal
        title={<div className="text-xl font-semibold">Chỉnh sửa thông tin cá nhân</div>}
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        width={500}
      >
        <Form
          form={editForm}
          layout="vertical"
          className="pt-4"
        >
          <Form.Item
            label="Ảnh đại diện"
            name="avatar"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              <div className="flex flex-col items-center">
                <UploadCloud className="w-6 h-6 text-gray-400" />
                <div className="mt-2">Upload</div>
              </div>
            </Upload>
          </Form.Item>

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

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[
              { required: true, message: "Vui lòng chọn giới tính" }
            ]}
          >
            <Select
              placeholder="Chọn giới tính"
              options={[
                { value: 'Nam', label: 'Nam' },
                { value: 'Nữ', label: 'Nữ' },
                { value: 'Khác', label: 'Khác' }
              ]}
              className="w-full"
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
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <CustomButton onClick={handleEditCancel}>
              Hủy
            </CustomButton>
            <CustomButton
              type="primary"
              onClick={handleUpdateProfile}
              loading={loading}
            >
              Cập nhật
            </CustomButton>
          </div>
        </Form>
      </Modal>

      {/* Modal Đổi mật khẩu */}
      <Modal
        title={<div className="text-xl font-semibold">Đổi mật khẩu</div>}
        open={isChangePasswordModalVisible}
        onCancel={handleChangePasswordCancel}
        footer={null}
        width={400}
      >
        <Form
          form={changePasswordForm}
          layout="vertical"
          className="pt-4"
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="oldPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
            ]}
          >
            <Input.Password 
              placeholder="Nhập mật khẩu hiện tại"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              { 
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                message: "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
              }
            ]}
          >
            <Input.Password 
              placeholder="Nhập mật khẩu mới"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="Xác nhận mật khẩu mới"
              className="rounded-lg"
            />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <CustomButton onClick={handleChangePasswordCancel}>
              Hủy
            </CustomButton>
            <CustomButton
              type="primary"
              onClick={handleChangePassword}
              loading={loading}
              className="bg-[#42A5F5] hover:bg-[#1976D2]"
            >
              Xác nhận
            </CustomButton>
          </div>
        </Form>
      </Modal>

      <style jsx global>{`
        .ant-input-affix-wrapper {
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          transition: all 0.3s ease;
        }
        .ant-input-affix-wrapper:hover,
        .ant-input-affix-wrapper-focused {
          border-color: #42A5F5 !important;
          box-shadow: 0 0 0 2px rgba(66, 165, 245, 0.1) !important;
        }
        .ant-form-item-label > label {
          font-weight: 500;
          color: #374151;
        }
        .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Profile;