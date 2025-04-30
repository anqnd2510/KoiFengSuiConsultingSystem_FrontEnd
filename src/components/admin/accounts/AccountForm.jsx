import { Form, Input, Select, Button } from "antd";
import { useState, useEffect } from "react";

const AccountForm = ({ initialData, onSubmit, disableRoleChange = false }) => {
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Xác định xem đây là form chỉnh sửa hay thêm mới
    setIsEditMode(!!initialData);

    // Reset form khi initialData thay đổi
    form.resetFields();
  }, [initialData, form]);

  const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "Manager", value: "Manager" },
    { label: "Staff", value: "Staff" },
    { label: "Customer", value: "Customer" },
    { label: "Master", value: "Master" },
  ];

  const statusOptions = [
    { label: "Hoạt động", value: true },
    { label: "Vô hiệu", value: false },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData || { isActive: true, role: "Customer" }}
      onFinish={onSubmit}
    >
      {isEditMode ? (
        // Hiển thị thông tin tài khoản hiện tại trong chế độ chỉnh sửa
        <div className="mb-4">
          <p>
            <strong>Tên người dùng:</strong> {initialData?.userName}
          </p>
          <p>
            <strong>Email:</strong> {initialData?.email}
          </p>
          <p>
            <strong>Số điện thoại:</strong>{" "}
            {initialData?.phoneNumber || "Chưa cập nhật"}
          </p>
          <p>
            <strong>Họ và tên:</strong>{" "}
            {initialData?.fullName || "Chưa cập nhật"}
          </p>
          <p>
            <strong>Vai trò hiện tại:</strong> {initialData?.role}
          </p>
        </div>
      ) : (
        // Hiển thị các trường nhập liệu cho tài khoản mới
        <>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
              {
                pattern: /^[0-9]{10,11}$/,
                message: "Số điện thoại phải có 10-11 chữ số",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
                message:
                  "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        </>
      )}

      <Form.Item
        name="role"
        label="Vai trò"
        rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
        tooltip={
          disableRoleChange
            ? "Chỉ có thể thay đổi vai trò cho tài khoản Customer"
            : ""
        }
      >
        <Select
          options={roleOptions}
          placeholder="Chọn vai trò"
          disabled={disableRoleChange}
        />
      </Form.Item>

      <Form.Item
        name="isActive"
        label="Trạng thái"
        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
      >
        <Select options={statusOptions} placeholder="Chọn trạng thái" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {isEditMode ? "Cập nhật" : "Thêm mới"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AccountForm;
