import { Tree, Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// Dữ liệu mẫu
const mockCategories = [
  {
    key: "1",
    title: "Phong thủy nhà ở",
    children: [
      {
        key: "1-1",
        title: "Phong thủy phòng khách",
      },
      {
        key: "1-2",
        title: "Phong thủy phòng ngủ",
      },
    ],
  },
  {
    key: "2",
    title: "Phong thủy văn phòng",
    children: [
      {
        key: "2-1",
        title: "Bố trí văn phòng",
      },
    ],
  },
  {
    key: "3",
    title: "Vật phẩm phong thủy",
  },
];

const CategoryTree = ({ onEdit, onDelete }) => {
  const titleRender = (nodeData) => {
    return (
      <div className="flex items-center justify-between w-full pr-4">
        <span>{nodeData.title}</span>
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(nodeData)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa danh mục này?"
            onConfirm={() => onDelete(nodeData.key)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      </div>
    );
  };

  return (
    <Tree
      showLine
      defaultExpandAll
      treeData={mockCategories}
      titleRender={titleRender}
      draggable
    />
  );
};

export default CategoryTree;
