import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { login } from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login response:", response);

      if (response.accessToken) {
        console.log("Login successful, preparing to navigate...");
        message.success("Đăng nhập thành công!");

        if (formData.rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        console.log("Tokens saved, navigating to schedule...");

        navigate("/schedule", { replace: true });
      } else {
        message.error(
          "Đăng nhập thất bại: " + (response.message || "Vui lòng thử lại")
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Đã xảy ra lỗi khi đăng nhập";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true,
      }));
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background image */}
      <div className="fixed inset-0">
        <img
          src="https://i.pinimg.com/736x/5c/ef/2f/5cef2f066dbb4f1b9b5f0a54c3e67710.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#90B77D]/80 backdrop-blur-xl"></div>
      </div>

      {/* Main container with curved design */}
      <div className="w-full max-w-6xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden flex shadow-2xl relative z-10">
        {/* Left side with illustration */}
        <div className="relative w-2/3 p-8 bg-gradient-to-br from-white/95 to-[#90B77D]/20">
          {/* Logo */}
          <div className="absolute top-8 left-8">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-full border-2 border-[#B69D74] flex items-center justify-center bg-white">
                <span className="text-[#B69D74] text-xl font-bold">KF</span>
              </div>
              <div className="text-[#B69D74] font-semibold">
                Koi Feng Shui
              </div>
            </div>
          </div>

          {/* Main illustration container */}
          <div className="h-full flex items-center justify-center relative">
            <div className="relative w-full max-w-xl">
              {/* Background circles */}
              <div className="absolute inset-0 bg-[#90B77D]/10 rounded-full filter blur-3xl transform scale-150"></div>
              
              {/* Main image */}
              <div className="relative z-10">
                <img
                  src="https://i.pinimg.com/736x/5c/ef/2f/5cef2f066dbb4f1b9b5f0a54c3e67710.jpg"
                  alt="Koi Fish"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#B69D74]/20 rounded-full"></div>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#90B77D]/30 rounded-full"></div>
            </div>
          </div>

          {/* Copyright */}
          <div className="absolute bottom-8 left-8 text-sm text-[#90B77D]">
            © 2024 Koi Feng Shui Consulting System
          </div>
        </div>

        {/* Right side with login form */}
        <div className="w-1/3 bg-gradient-to-br from-[#90B77D]/95 to-[#90B77D] backdrop-blur-md p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <h2 className="text-4xl font-bold text-white mb-12">Đăng nhập</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B69D74] focus:border-transparent text-white placeholder-white/50"
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B69D74] focus:border-transparent text-white placeholder-white/50"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-white/70 hover:text-white"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                        <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#B69D74] focus:ring-[#B69D74] border-2 border-white/30 rounded bg-white/10"
                  />
                  <label htmlFor="rememberMe" className="ml-3 block text-sm text-white">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-white hover:text-[#B69D74]">
                    Quên mật khẩu?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-[#90B77D] bg-white hover:bg-[#B69D74] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B69D74] transition-colors duration-200"
              >
                {loading ? "Đang xử lý..." : "Đăng nhập"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-white">
                Chưa có tài khoản?{" "}
                <a href="#" className="font-medium text-white hover:text-[#B69D74]">
                  Đăng ký ngay
                </a>
              </p>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="text-xs text-white/70 hover:text-white">
                Điều khoản dịch vụ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
