import { useRoutes } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import { mainRoutes } from "./mainRoutes";
import { adminRoutes } from "./adminRoutes";
import { publicRoutes } from "./publicRoutes";

export const AppRoutes = () => {
  const routes = [
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
