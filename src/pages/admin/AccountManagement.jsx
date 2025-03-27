import { useState, useEffect } from "react";
import { Button, Space, Modal, message, Popconfirm } from "antd";
import AccountList from "../../components/admin/accounts/AccountList";
import AccountForm from "../../components/admin/accounts/AccountForm";
import AccountFilters from "../../components/admin/accounts/AccountFilters";
import {
  getAllAccounts,
  deleteAccount,
  updateAccountRole,
  toggleAccountStatus,
} from "../../services/account.service";

const AccountManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    searchText: "",
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await getAllAccounts();
      if (response?.data) {
        setAccounts(response.data);
      }
    } catch (error) {
      message.error("Không thể tải danh sách tài khoản");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "accountId",
      key: "accountId",
      width: "15%",
    },
    {
      title: "Tên người dùng",
      dataIndex: "userName",
      key: "userName",
      width: "15%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "15%",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: "15%",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: "10%",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: "10%",
      render: (isActive) => (
        <span className={`status-${isActive ? "active" : "inactive"}`}>
          {isActive ? "Hoạt động" : "Vô hiệu"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Xóa tài khoản"
            description="Bạn có chắc chắn muốn xóa tài khoản này không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => handleDelete(record.accountId)}
            okButtonProps={{ danger: true }}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setIsModalVisible(true);
  };

  const handleDelete = async (accountId) => {
    try {
      const response = await deleteAccount(accountId);
      if (response.isSuccess) {
        setAccounts((prevAccounts) =>
          prevAccounts.filter((account) => account.accountId !== accountId)
        );
        message.success("Xóa tài khoản thành công");
      } else {
        message.error(response.message || "Xóa tài khoản thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa tài khoản");
      console.error("Error deleting account:", error);
    }
  };

  // Hàm xử lý filter data
  const getFilteredAccounts = () => {
    if (!accounts) return [];

    return accounts.filter((account) => {
      // Kiểm tra role
      if (filters.role !== "all" && account.role !== filters.role) {
        return false;
      }

      // Kiểm tra status (isActive)
      if (filters.status !== "all" && account.isActive !== filters.status) {
        return false;
      }

      // Kiểm tra searchText (tìm trong userName, email, fullName, phoneNumber)
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        return (
          account.userName?.toLowerCase().includes(searchLower) ||
          account.email?.toLowerCase().includes(searchLower) ||
          account.fullName?.toLowerCase().includes(searchLower) ||
          account.phoneNumber?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  };

  // Xử lý khi filter thay đổi
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSubmit = async (values) => {
    try {
      const { role, isActive } = values;
      const accountId = selectedAccount.accountId;
      let updatedAccount = { ...selectedAccount };
      let hasChanges = false;

      // Kiểm tra nếu role thay đổi
      if (role !== selectedAccount.role) {
        const roleResponse = await updateAccountRole(accountId, role);
        if (!roleResponse.isSuccess) {
          throw new Error(roleResponse.message || "Cập nhật vai trò thất bại");
        }
        updatedAccount.role = role;
        hasChanges = true;
      }

      // Kiểm tra nếu trạng thái thay đổi
      if (isActive !== selectedAccount.isActive) {
        const statusResponse = await toggleAccountStatus(accountId, isActive);
        if (!statusResponse.isSuccess) {
          throw new Error(
            statusResponse.message || "Cập nhật trạng thái thất bại"
          );
        }
        updatedAccount.isActive = isActive;
        hasChanges = true;
      }

      if (hasChanges) {
        setAccounts((prevAccounts) =>
          prevAccounts.map((account) =>
            account.accountId === accountId ? updatedAccount : account
          )
        );
        message.success("Cập nhật tài khoản thành công");
      }

      setIsModalVisible(false);
      setSelectedAccount(null);
    } catch (error) {
      message.error(error.message || "Có lỗi xảy ra khi cập nhật tài khoản");
      console.error("Error updating account:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tài khoản</h1>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Thêm tài khoản mới
        </Button>
      </div>

      <AccountFilters filters={filters} onFiltersChange={handleFiltersChange} />

      <AccountList
        data={getFilteredAccounts()} // Truyền data đã được filter
        loading={loading}
        columns={columns}
      />

      <Modal
        title="Sửa tài khoản"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedAccount(null);
        }}
        footer={null}
      >
        <AccountForm initialData={selectedAccount} onSubmit={handleSubmit} />
      </Modal>
    </div>
  );
};

export default AccountManagement;
