import { useRoutes, Navigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import { mainRoutes } from "./mainRoutes";
import { adminRoutes } from "./adminRoutes";
import { publicRoutes } from "./publicRoutes";
import Login from "../pages/Login";

export const AppRoutes = () => {
  const hasToken = localStorage.getItem("accessToken");

  const routes = [
    {
      path: "/",
      element: hasToken ? <MainLayout /> : <Navigate to="/login" replace />,
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        ...mainRoutes,
        {
          path: "admin",
          children: adminRoutes,
        },
      ],
    },
    ...publicRoutes,
  ];

  return useRoutes(routes);
};
