import { Form, Input, Select, Button } from "antd";

const AccountForm = ({ initialData, onSubmit }) => {
  const [form] = Form.useForm();

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
      initialValues={initialData}
      onFinish={onSubmit}
    >
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
          <strong>Họ và tên:</strong> {initialData?.fullName || "Chưa cập nhật"}
        </p>
      </div>

      <Form.Item
        name="role"
        label="Vai trò"
        rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
      >
        <Select options={roleOptions} placeholder="Chọn vai trò" />
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
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AccountForm;
