import { Form, Input, Select, Button } from "antd";

// Dữ liệu mẫu cho danh mục cha
const parentOptions = [
  { label: "Không có", value: null },
  { label: "Phong thủy nhà ở", value: "1" },
  { label: "Phong thủy văn phòng", value: "2" },
  { label: "Vật phẩm phong thủy", value: "3" },
];

const CategoryForm = ({ initialData, onSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={onSubmit}
    >
      <Form.Item
        name="title"
        label="Tên danh mục"
        rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="parentId" label="Danh mục cha">
        <Select
          options={parentOptions}
          placeholder="Chọn danh mục cha"
          allowClear
        />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {initialData ? "Cập nhật" : "Tạo mới"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
