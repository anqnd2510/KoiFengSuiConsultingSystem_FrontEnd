import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Space,
  Divider,
  Card,
  message,
  InputNumber,
  Row,
  Col,
} from "antd";
import { ArrowLeft, UploadCloud, Plus, Trash2 } from "lucide-react";
import BackButton from "../../components/Common/BackButton";

const { Option } = Select;
const { TextArea } = Input;

const KoiFishDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [colorFields, setColorFields] = useState([{ name: "", value: "" }]);
  const isEditMode = id !== "new";

  // Mock data cho cá Koi
  const koiFishData = {
    id: 1,
    breed: "Asagi",
    image: "https://example.com/asagi.jpg",
    element: "Thủy",
    description:
      "Asagi chính là giống sản sinh ra Nishikigoi, chúng bắt nguồn từ loài cá chép Magoi cổ đại.",
    colors: [
      { name: "Đen", value: "0.50" },
      { name: "Đỏ", value: "0.10" },
      { name: "Trắng", value: "0.40" },
    ],
  };

  useEffect(() => {
    if (isEditMode) {
      // Giả lập việc tải dữ liệu từ API
      setLoading(true);
      setTimeout(() => {
        form.setFieldsValue({
          breed: koiFishData.breed,
          element: koiFishData.element,
          description: koiFishData.description,
        });

        // Cập nhật state colorFields
        setColorFields(koiFishData.colors);
        setLoading(false);
      }, 1000);
    }
  }, [form, isEditMode]);

  const onFinish = (values) => {
    setLoading(true);

    // Kết hợp giá trị từ form với danh sách màu sắc
    const formData = {
      ...values,
      colors: colorFields,
    };

    console.log("Form data:", formData);

    // Giả lập việc gửi API
    setTimeout(() => {
      setLoading(false);
      message.success(
        `Đã ${isEditMode ? "cập nhật" : "tạo mới"} thông tin cá Koi thành công`
      );
      navigate("/staff/koi-fish-management");
    }, 1500);
  };

  // Hàm thêm trường màu sắc
  const addColorField = () => {
    setColorFields([...colorFields, { name: "", value: "" }]);
  };

  // Hàm xóa trường màu sắc
  const removeColorField = (index) => {
    const newFields = [...colorFields];
    newFields.splice(index, 1);
    setColorFields(newFields);
  };

  // Hàm cập nhật trường màu sắc
  const updateColorField = (index, field, value) => {
    const newFields = [...colorFields];
    newFields[index][field] = value;
    setColorFields(newFields);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#B89D71] p-4">
        <div className="flex items-center gap-2">
          <BackButton onClick={() => navigate("/staff/koi-fish-management")} />
          <h1 className="text-white text-xl font-semibold">
            {isEditMode ? "Chỉnh sửa thông tin cá Koi" : "Tạo mới loài cá Koi"}
          </h1>
        </div>
        <p className="text-white/80 text-sm ml-8">
          {isEditMode
            ? "Cập nhật thông tin và đặc điểm của loài cá"
            : "Thêm thông tin chi tiết cho loài cá Koi mới"}
        </p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Card className="max-w-3xl mx-auto shadow-sm">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={loading}
          >
            <Row gutter={16}>
              <Col span={24} md={12}>
                <Form.Item
                  label="Tên giống cá Koi"
                  name="breed"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên giống cá Koi",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên giống cá Koi" />
                </Form.Item>
              </Col>

              <Col span={24} md={12}>
                <Form.Item
                  label="Mệnh của cá"
                  name="element"
                  rules={[
                    { required: true, message: "Vui lòng chọn mệnh của cá" },
                  ]}
                >
                  <Select placeholder="Chọn mệnh của cá">
                    <Option value="Thủy">Thủy</Option>
                    <Option value="Hỏa">Hỏa</Option>
                    <Option value="Thổ">Thổ</Option>
                    <Option value="Kim">Kim</Option>
                    <Option value="Mộc">Mộc</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Hình ảnh" name="image">
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false} // Ngăn tự động upload
              >
                <div className="flex flex-col items-center">
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                  <div className="mt-2">Tải lên</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Thông tin giới thiệu"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thông tin giới thiệu",
                },
              ]}
            >
              <TextArea
                placeholder="Nhập thông tin giới thiệu về loài cá Koi"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>

            <Divider orientation="left">Màu sắc</Divider>

            <div className="mb-4">
              {colorFields.map((field, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    placeholder="Tên màu"
                    value={field.name}
                    onChange={(e) =>
                      updateColorField(index, "name", e.target.value)
                    }
                    style={{ width: "50%" }}
                  />
                  <InputNumber
                    placeholder="Tỷ lệ (0.0-1.0)"
                    min={0}
                    max={1}
                    step={0.01}
                    value={field.value}
                    onChange={(value) =>
                      updateColorField(index, "value", value)
                    }
                    style={{ width: "30%" }}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 size={16} />}
                    onClick={() => removeColorField(index)}
                    disabled={colorFields.length <= 1}
                  />
                </div>
              ))}

              <Button
                type="dashed"
                onClick={addColorField}
                block
                icon={<Plus size={16} />}
              >
                Thêm màu sắc
              </Button>
            </div>

            <Form.Item className="mt-6">
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {isEditMode ? "Cập nhật" : "Tạo mới"}
                </Button>
                <Button onClick={() => navigate("/staff/koi-fish-management")}>
                  Hủy bỏ
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default KoiFishDetail;
