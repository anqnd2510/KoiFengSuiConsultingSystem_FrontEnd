import { getCurrentUser } from "../services/auth.service";
import { useState, useEffect } from "react";
import { message } from "antd";

// Trong component cần thông tin người dùng
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      message.error("Không thể lấy thông tin người dùng");
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, []);
