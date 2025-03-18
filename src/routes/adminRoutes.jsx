import AccountManagement from "../pages/admin/AccountManagement";
import CategoryManagement from "../pages/admin/CategoryManagement";

export const adminRoutes = [
  {
    path: "accounts",
    element: <AccountManagement />,
  },
  {
    path: "categories",
    element: <CategoryManagement />,
  },
];
