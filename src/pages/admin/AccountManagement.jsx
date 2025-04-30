import { useState, useEffect } from "react";
import { Button, Space, Modal, message, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import AccountList from "../../components/admin/accounts/AccountList";
import AccountForm from "../../components/admin/accounts/AccountForm";
import AccountFilters from "../../components/admin/accounts/AccountFilters";
import Header from "../../components/Common/Header";
import {
  getAllAccounts,
  deleteAccount,
  updateAccountRole,
  toggleAccountStatus,
} from "../../services/account.service";

const AccountManagement = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    searchText: "",
  });

  const checkAuth = () => {
    // Kiểm tra nếu có token và userRole phù hợp
    const token = localStorage.getItem("accessToken");
    const userRole =
      localStorage.getItem("userRole") || localStorage.getItem("role");

    if (!token) {
      message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      // Chuyển hướng về trang đăng nhập
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
      return false;
    }

    console.log("Current role:", userRole);
    // Kiểm tra role không phân biệt chữ hoa/thường
    if (!(userRole?.toLowerCase() === "admin")) {
      message.error("Bạn không có quyền truy cập chức năng này");
      // Chuyển hướng về trang chính tương ứng với role
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
      return false;
    }

    return true;
  };

  const fetchAccounts = async (isInitialLoad = false) => {
    try {
      setLoading(true);
      if (!isInitialLoad) {
        setError(null);
      }

      if (!checkAuth()) {
        setLoading(false);
        return false;
      }

      console.log("Bắt đầu tải danh sách tài khoản...");
      const response = await getAllAccounts();

      console.log("Kết quả API:", response);

      if (response?.data) {
        setAccounts(response.data);
        setError(null);
        return true;
      } else if (response) {
        // Nếu không có data nhưng có response
        setAccounts([]);
        setError(null);
        return true;
      } else {
        // Nếu không có response, chỉ set error không hiển thị message
        if (!isInitialLoad) {
          setError("Không thể tải danh sách tài khoản");
        }
        return false;
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      if (!isInitialLoad) {
        setError("Không thể tải danh sách tài khoản");
      }

      // Không hiển thị message lỗi chi tiết để tránh làm phiền người dùng khi API bị lỗi
      // Chỉ log ra để debug
      if (error.originalError?.response?.status === 401) {
        console.error("Lỗi xác thực:", error);
        // Chuyển hướng về trang đăng nhập khi token hết hạn
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1000);
      } else if (error.originalError?.response?.status === 403) {
        console.error("Lỗi phân quyền:", error);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Thử gọi API khi component mount với cơ chế retry
    const initialLoad = async () => {
      // Thử lần đầu tiên
      const success = await fetchAccounts(true);
      if (success) return;

      // Nếu lần đầu thất bại, thử lại sau 1 giây
      setTimeout(async () => {
        const retry1 = await fetchAccounts(true);
        if (retry1) return;

        // Nếu vẫn thất bại, thử lại lần thứ 2 sau 2 giây
        setTimeout(async () => {
          const retry2 = await fetchAccounts(true);
          if (retry2) return;

          // Nếu vẫn thất bại sau lần thứ 2, hiển thị lỗi
          setError(
            "Không thể tải danh sách tài khoản. Vui lòng bấm Tải lại dữ liệu."
          );
        }, 2000);
      }, 1000);
    };

    initialLoad();
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
        <Button type="primary" onClick={() => handleEdit(record)}>
          Sửa
        </Button>
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
    if (!accounts || accounts.length === 0) return [];

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
        // Kiểm tra quy tắc thay đổi vai trò:
        // Chỉ cho phép nâng cấp từ Customer lên Staff, Master, Manager, Admin
        // Không cho phép chuyển đổi giữa các vai trò Staff, Master, Manager, Admin
        if (selectedAccount.role !== "Customer") {
          message.error("Chỉ có thể thay đổi vai trò cho tài khoản Customer");
          return;
        }

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
      console.error("Error updating account:", error);

      // Xử lý lỗi từ API
      if (error.originalError?.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1000);
      } else if (error.originalError?.response?.status === 403) {
        message.error("Bạn không có quyền thực hiện thao tác này");
      } else {
        message.error(error.message || "Có lỗi xảy ra khi cập nhật tài khoản");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Quản lý tài khoản"
        description="Quản lý thông tin tài khoản người dùng trong hệ thống"
      />
      <div className="p-6">
        <div className="flex justify-end items-center mb-6">
          <Button
            type="default"
            onClick={() => fetchAccounts(false)}
            loading={loading}
          >
            Tải lại dữ liệu
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        <AccountFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        <AccountList
          data={getFilteredAccounts()}
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
          <AccountForm
            initialData={selectedAccount}
            onSubmit={handleSubmit}
            disableRoleChange={selectedAccount?.role !== "Customer"}
          />
        </Modal>
      </div>
    </div>
  );
};

export default AccountManagement;
