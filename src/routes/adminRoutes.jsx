import AccountManagement from "../pages/admin/AccountManagement";
import CategoryManagement from "../pages/admin/CategoryManagement";

export const adminRoutes = [
  {
    path: "accounts",
    element: <AccountManagement />,
    roles: ["admin"],
  },
  {
    path: "categories",
    element: <CategoryManagement />,
    roles: ["admin"],
  },
];
