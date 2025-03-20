import React from "react";
import { Form, Input, Upload, Divider, InputNumber, Row, Col, Select } from "antd";
import { UploadCloud, Plus, Trash2 } from "lucide-react";
import CustomButton from "./Common/CustomButton";

const { TextArea } = Input;
const { Option } = Select;

// Component form cho cá Koi
const KoiFishForm = ({ form, initialData, colorFields, setColorFields, loading }) => {
  // Hàm thêm trường màu sắc
  const addColorField = () => {
    setColorFields([...colorFields, { name: "", value: 0.5, colorCode: "#000000" }]);
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
    <Form
      form={form}
      layout="vertical"
      disabled={loading}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Tên giống cá Koi"
            name="breed"
            rules={[{ required: true, message: "Vui lòng nhập tên giống cá Koi" }]}
          >
            <Input placeholder="Nhập tên giống cá Koi" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Hình ảnh"
        name="image"
      >
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={() => false} // Ngăn tự động upload
        >
          <div className="flex flex-col items-center">
            <UploadCloud className="w-6 h-6 text-gray-400" />
            <div className="mt-2">Upload </div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Thông tin giới thiệu"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập thông tin giới thiệu" }]}
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
              onChange={(e) => updateColorField(index, "name", e.target.value)}
              style={{ width: "40%" }}
            />
            <Input
              type="color"
              value={field.colorCode || "#000000"}
              onChange={(e) => updateColorField(index, "colorCode", e.target.value)}
              style={{ width: "10%" }}
            />
            <InputNumber
              placeholder="Tỷ lệ (%)"
              min={0}
              max={1}
              step={0.01}
              value={field.value}
              onChange={(value) => updateColorField(index, "value", value)}
              style={{ width: "30%" }}
              formatter={(value) => `${Math.round(value * 100)}%`}
              parser={(value) => value.replace('%', '') / 100}
            />
            <CustomButton
              type="text"
              danger
              icon={<Trash2 size={16} />}
              onClick={() => removeColorField(index)}
              disabled={colorFields.length <= 1}
            />
          </div>
        ))}
        
        <CustomButton 
          type="dashed" 
          onClick={addColorField}
          block
          icon={<Plus size={16} />}
        >
          Thêm màu sắc
        </CustomButton>
      </div>
    </Form>
  );
};

export default KoiFishForm; 