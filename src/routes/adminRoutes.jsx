import AccountManagement from "../pages/admin/AccountManagement";

export const adminRoutes = [
  {
    path: "accounts",
    element: <AccountManagement />,
    roles: ["admin"],
  },
];
