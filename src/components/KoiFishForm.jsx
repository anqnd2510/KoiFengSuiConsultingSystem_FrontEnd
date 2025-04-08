import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Upload,
  Divider,
  InputNumber,
  Row,
  Col,
  Select,
  Button,
  message,
} from "antd";
import { UploadCloud, Plus, Trash2 } from "lucide-react";
import { PlusOutlined } from "@ant-design/icons";
import CustomButton from "./Common/CustomButton";
import { Slider } from "antd";
import KoiFishService from "../services/koifish.service";

const { TextArea } = Input;
const { Option } = Select;

// Component form cho cá Koi
const KoiFishForm = ({
  form,
  initialData,
  colorFields,
  setColorFields,
  loading,
  imageUrl,
  onImageChange,
}) => {
  const [colorOptions, setColorOptions] = useState([]);
  const [loadingColors, setLoadingColors] = useState(false);

  // Log ra dữ liệu màu sắc nhận được từ parent component
  useEffect(() => {
    console.log("KoiFishForm - Màu sắc nhận được:", colorFields);
    console.log("KoiFishForm - initialData:", initialData);
  }, [colorFields, initialData]);

  // Lấy danh sách màu từ API khi component được mount
  useEffect(() => {
    const fetchColors = async () => {
      setLoadingColors(true);
      try {
        const response = await KoiFishService.getColors();
        if (response && response.isSuccess && Array.isArray(response.data)) {
          setColorOptions(response.data);
          console.log("Danh sách màu từ API:", response.data);

          // Sau khi lấy được danh sách màu, cập nhật tên và element cho các màu đã chọn
          if (colorFields && colorFields.length > 0) {
            const updatedFields = colorFields.map((field) => {
              // Log thông tin trường màu hiện tại
              console.log(`Trường màu hiện tại:`, field);
              
              if (field.colorId) {
                const matchingColor = response.data.find(
                  (c) => c.colorId === field.colorId
                );
                if (matchingColor) {
                  console.log(`Tìm thấy màu phù hợp:`, matchingColor);
                  return {
                    ...field,
                    colorName: matchingColor.colorName || field.colorName,
                    element: matchingColor.element || field.element,
                  };
                }
              }
              return field;
            });

            // Chỉ cập nhật nếu thông tin màu sắc thay đổi
            if (JSON.stringify(updatedFields) !== JSON.stringify(colorFields)) {
              console.log(
                "Cập nhật thông tin màu sau khi lấy danh sách màu:",
                updatedFields
              );
              setColorFields(updatedFields);
            }
          }
        } else {
          console.error("Định dạng dữ liệu màu không đúng:", response);
          message.error("Không thể tải danh sách màu sắc");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách màu:", error);
        message.error("Không thể tải danh sách màu sắc");
      } finally {
        setLoadingColors(false);
      }
    };

    fetchColors();
  }, []);

  // Hàm thêm trường màu sắc
  const addColorField = () => {
    setColorFields([...colorFields, { colorId: "", value: 0.5 }]);
  };

  // Hàm xóa trường màu sắc
  const removeColorField = (index) => {
    const newFields = [...colorFields];
    newFields.splice(index, 1);
    setColorFields(newFields);
  };

  // Tìm tên màu từ colorId khi component được render
  useEffect(() => {
    if (colorOptions.length > 0 && colorFields.length > 0) {
      console.log("---BEGIN COLOR MAPPING---");
      console.log("Color options available:", colorOptions);
      console.log("Current color fields:", colorFields);

      // Kiểm tra xem có cần cập nhật không
      let needsUpdate = false;
      const updatedFields = colorFields.map((field) => {
        // Chỉ xử lý nếu có colorId nhưng không có tên hoặc mệnh
        if (field.colorId && (!field.colorName || !field.element)) {
          needsUpdate = true;
          const matchingColor = colorOptions.find(
            (c) => c.colorId === field.colorId
          );

          console.log(`Tìm màu cho colorId=${field.colorId}:`, matchingColor);

          if (matchingColor) {
            return {
              ...field,
              colorName: matchingColor.colorName || field.colorName,
              element: matchingColor.element || field.element,
            };
          }
        }
        return field;
      });

      // Chỉ cập nhật state nếu có thay đổi
      if (needsUpdate) {
        console.log("Cập nhật thông tin màu sắc từ options:", updatedFields);
        setColorFields(updatedFields);
      }
      console.log("---END COLOR MAPPING---");
    }
  }, [colorOptions, colorFields, setColorFields]);

  // Log ra dữ liệu màu sắc mỗi khi render
  useEffect(() => {
    console.log("Dữ liệu màu sắc hiện tại:", colorFields);
  }, [colorFields]);

  return (
    <Form form={form} layout="vertical" disabled={loading}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label={<span className="text-red-500">* Tên giống cá Koi</span>}
            name="breed"
            rules={[
              { required: true, message: "Vui lòng nhập tên giống cá Koi" },
            ]}
          >
            <Input placeholder="Nhập tên giống cá" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="imageUrl"
        label={<span className="text-red-500">* Hình ảnh</span>}
        rules={[
          {
            required: !initialData,
            message: "Vui lòng tải lên hình ảnh cá Koi",
          },
        ]}
      >
        <div className="mt-2">
          <Upload
            listType="picture-card"
            onChange={onImageChange}
            maxCount={1}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("Chỉ chấp nhận file hình ảnh!");
                return Upload.LIST_IGNORE;
              }
              return false; // Không tự động upload
            }}
            fileList={
              imageUrl
                ? [
                    {
                      uid: "-1",
                      name: "image.png",
                      status: "done",
                      url: imageUrl,
                    },
                  ]
                : []
            }
          >
            {imageUrl ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            )}
          </Upload>
          {imageUrl ? (
            <div className="mt-2">
              <p className="text-gray-600 text-sm">Hình ảnh đã chọn:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-1 h-20 object-cover rounded"
              />
            </div>
          ) : initialData && initialData.imageUrl ? (
            <div className="mt-2">
              <p className="text-gray-600 text-sm">Hình ảnh hiện tại:</p>
              <img
                src={initialData.imageUrl}
                alt={initialData.varietyName}
                className="mt-1 h-20 object-cover rounded"
              />
            </div>
          ) : null}
        </div>
      </Form.Item>

      <Form.Item
        name="description"
        label={<span className="text-red-500">* Mô tả</span>}
        rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
      >
        <TextArea rows={4} placeholder="Nhập mô tả về giống cá" />
      </Form.Item>

      <Form.Item
        name="introduction"
        label={<span className="text-red-500">* Giới thiệu</span>}
        rules={[{ required: true, message: "Vui lòng nhập giới thiệu" }]}
      >
        <TextArea
          rows={4}
          placeholder="Nhập thông tin giới thiệu về giống cá"
        />
      </Form.Item>

      <Divider orientation="left">Cấu trúc màu sắc</Divider>

      <div className="space-y-4">
        {colorFields.map((field, index) => (
          <div
            key={index}
            className="flex flex-wrap items-end gap-2 p-3 border border-gray-200 rounded-md bg-gray-50"
          >
            <Form.Item
              className="mb-0 flex-1"
              label={
                <div className="flex justify-between">
                  <span>{`Màu sắc ${index + 1}`}</span>
                  {field.colorName && (
                    <span className="text-blue-600 text-xs font-medium">
                      {field.colorName} ({field.element})
                    </span>
                  )}
                </div>
              }
              required={index === 0}
            >
              <Select
                placeholder="Chọn màu sắc"
                loading={loadingColors}
                value={field.colorId || undefined}
                style={{ width: "100%" }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children?.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onChange={(value) => {
                  const newFields = [...colorFields];
                  const selectedColor = colorOptions.find(
                    (c) => c.colorId === value
                  );

                  console.log("Chọn màu mới:", selectedColor);

                  newFields[index] = {
                    ...newFields[index],
                    colorId: value,
                    colorName: selectedColor?.colorName || "",
                    element: selectedColor?.element || "",
                  };
                  setColorFields(newFields);
                }}
              >
                {colorOptions.map((color) => {
                  // Kiểm tra xem màu này có đang được chọn trong field hiện tại không
                  const isSelected = color.colorId === field.colorId;

                  return (
                    <Option
                      key={color.colorId}
                      value={color.colorId}
                      className={isSelected ? "bg-blue-50 font-medium" : ""}
                    >
                      {isSelected ? "✓ " : ""}
                      {color.colorName} ({color.element})
                    </Option>
                  );
                })}
              </Select>

              {/* Hiển thị thông tin màu đã chọn */}
              {field.colorId && (
                <div className="text-xs mt-1 p-1 bg-blue-50 rounded border border-blue-100">
                  <strong>Màu:</strong>{" "}
                  <span className="font-medium text-blue-700">
                    {field.colorName || "Đang tải..."}
                  </span>{" "}
                  <strong>Mệnh:</strong>{" "}
                  <span className="font-medium text-blue-700">
                    {field.element || "Đang tải..."}
                  </span>
                </div>
              )}
            </Form.Item>
            <Form.Item className="mb-0 flex-1" label="Tỷ lệ màu">
              <div className="flex items-center gap-2">
                <Slider
                  className="flex-1"
                  min={0}
                  max={1}
                  step={0.01}
                  value={field.value}
                  marks={{
                    0: "0%",
                    0.25: "25%",
                    0.5: "50%",
                    0.75: "75%",
                    1: "100%",
                  }}
                  tooltip={{
                    formatter: (value) => `${Math.round(value * 100)}%`,
                  }}
                  onChange={(value) => {
                    const newFields = [...colorFields];
                    newFields[index].value = value;
                    setColorFields(newFields);
                  }}
                />
                <div className="min-w-[50px] text-right">
                  <span className="font-medium text-blue-700 text-base">
                    {Math.round(field.value * 100)}%
                  </span>
                </div>
              </div>
            </Form.Item>
            <Button
              danger
              icon={<Trash2 size={16} />}
              onClick={() => {
                if (colorFields.length > 1) {
                  const newFields = [...colorFields];
                  newFields.splice(index, 1);
                  setColorFields(newFields);
                } else {
                  message.info("Phải có ít nhất một màu sắc");
                }
              }}
            />
          </div>
        ))}

        <Button
          type="dashed"
          block
          onClick={addColorField}
          icon={<Plus size={16} />}
          className="mt-2"
        >
          Thêm màu sắc
        </Button>
      </div>
    </Form>
  );
};

export default KoiFishForm;
