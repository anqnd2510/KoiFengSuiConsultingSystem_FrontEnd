import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { login, register } from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: true, // Mặc định là Nam
    dob: "1990-01-01",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === "gender") {
      // Gender cần là giá trị boolean thật, không phải chuỗi "true"/"false"
      setRegisterData((prev) => ({
        ...prev,
        [name]: value === "true" // Chuyển string thành boolean
      }));
    } else if (name === "dob") {
      // Đảm bảo ngày sinh luôn được định dạng đúng
      setRegisterData((prev) => ({
        ...prev,
        [name]: value // Giữ nguyên giá trị ngày không cần thêm T (việc này sẽ xử lý ở auth.service)
      }));
    } else {
      setRegisterData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu và xác nhận mật khẩu
    if (!registerData.password) {
      message.error("Vui lòng nhập mật khẩu!");
      return;
    }
    
    if (!registerData.confirmPassword) {
      message.error("Vui lòng xác nhận mật khẩu!");
      return;
    }
    
    // Kiểm tra độ mạnh của mật khẩu
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(registerData.password)) {
      message.error("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!");
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    setLoading(true);
    
    try {
      // Chuẩn bị dữ liệu gửi lên API
      const userData = {
        fullName: registerData.fullName,
        email: registerData.email,
        phoneNumber: registerData.phoneNumber,
        gender: registerData.gender,
        dob: registerData.dob,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword
      };
      
      console.log("Dữ liệu đăng ký:", userData);
      
      const response = await register(userData);
      console.log("Kết quả đăng ký:", response);
      
      if (response) {
        message.success("Đăng ký tài khoản thành công!");
        
        // Chuyển hướng đến trang Pending thay vì tự động đăng nhập
        setTimeout(() => {
          navigate("/pending", {
            replace: true,
            state: {
              message: "Tài khoản đã được tạo thành công và đang trong quá trình xác nhận. Vui lòng đăng nhập lại sau."
            }
          });
        }, 1000);
      } else {
        // Xử lý lỗi đăng ký
        message.error("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      
      // Phân tích lỗi từ API
      if (error.response?.status === 400) {
        if (error.response?.data?.errors) {
          // Hiển thị lỗi validation từ API
          const validationErrors = error.response.data.errors;
          let hasDisplayedError = false;
          
          Object.entries(validationErrors).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach(err => {
                message.error(err);
                hasDisplayedError = true;
              });
            } else if (typeof value === 'string') {
              message.error(value);
              hasDisplayedError = true;
            }
          });
          
          if (!hasDisplayedError) {
            message.error("Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.");
          }
        } else if (error.response?.data?.message) {
          message.error(error.response.data.message);
        } else if (error.response?.data?.title) {
          message.error(error.response.data.title);
        } else {
          message.error("Thông tin đăng ký không hợp lệ. Vui lòng kiểm tra lại.");
        }
      } else if (error.response?.status === 409) {
        message.error("Email đã được sử dụng. Vui lòng chọn email khác.");
      } else {
        // Hiển thị lỗi tổng quát
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.title || 
                            error.message || 
                            "Đã xảy ra lỗi khi đăng ký tài khoản";
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
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

        // Xác định role dựa trên email hoặc thông tin khác
        let role = "";

        // Nếu API không trả về role, xác định dựa trên email
        if (response.email && response.email.includes("manager")) {
          role = "manager";
        } else if (response.email && response.email.includes("master")) {
          role = "master";
        } else if (response.email && response.email.includes("staff")) {
          role = "staff";
        } else if (response.email && response.email.includes("admin")) {
          role = "admin";
        } else if (formData.email.includes("manager")) {
          role = "manager";
        } else if (formData.email.includes("master")) {
          role = "master";
        } else if (formData.email.includes("staff")) {
          role = "staff";
        } else if (formData.email.includes("admin")) {
          role = "admin";
        }

        console.log("Determined role:", role);

        localStorage.setItem("role", role);
        localStorage.setItem("userRole", role);

        console.log("Tokens saved, navigating based on role:", role);

        setTimeout(() => {
          if (role === "manager") {
            console.log("Navigating to manager dashboard...");
            navigate("/manager/dashboard", { replace: true });
          } else if (role === "master") {
            console.log("Navigating to master schedule...");
            navigate("/master/schedule", { replace: true });
          } else if (role === "staff") {
            console.log("Navigating to staff booking schedule...");
            navigate("/staff/notifications", { replace: true });
          } else if (role === "admin") {
            console.log("Navigating to admin accounts page...");
            navigate("/admin/accounts", { replace: true });
          } else {
            console.log("No matching role, navigating to pending page");
            // Chuyển đến trang Pending khi không xác định được role
            navigate("/pending", { 
              replace: true, 
              state: { 
                message: "Tài khoản của bạn đang chờ xác nhận hoặc chưa được phân quyền. Vui lòng liên hệ quản trị viên để biết thêm chi tiết." 
              } 
            });
          }
        }, 500);
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

  const toggleRegisterPasswordVisibility = () => {
    setShowRegisterPassword(!showRegisterPassword);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background image */}
      <div className="fixed inset-0">
        <img
          src="/KoiBase.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#90B77D]/80 backdrop-blur-xl"></div>
      </div>

      {/* Container chính */}
      <div className={`w-full max-w-6xl h-[600px] bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 ${isSignUpMode ? 'sign-up-mode' : ''}`}>
        {/* Container forms */}
        <div className="absolute w-full h-full">
          {/* Sign In */}
          <div className="form-container sign-in-container">
            <div className="bg-gradient-to-br from-[#90B77D]/95 to-[#90B77D] w-full h-full flex items-center justify-center p-10">
              <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
                <h2 className="text-4xl font-bold text-white mb-10">Đăng nhập</h2>
                
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white mb-2"
                >
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white mb-2"
                >
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z"
                          clipRule="evenodd"
                        />
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
                  <label
                    htmlFor="rememberMe"
                    className="ml-3 block text-sm text-white"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-white hover:text-[#B69D74]"
                  >
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

                <div className="mt-4 text-center">
                  <a href="#" className="text-xs text-white/70 hover:text-white">
                    Điều khoản dịch vụ
                  </a>
                </div>
            </form>
            </div>
          </div>

          {/* Sign Up */}
          <div className="form-container sign-up-container">
            <div className="bg-gradient-to-br from-[#90B77D]/95 to-[#90B77D] w-full h-full flex items-center justify-center p-6 overflow-y-auto">
              <form onSubmit={handleRegisterSubmit} className="w-full max-w-md space-y-1.5 py-2">
                <h2 className="text-3xl font-bold text-white mb-2">Đăng ký</h2>
                
                <div className="mb-0.5">
                  <label htmlFor="fullName" className="block text-sm font-medium text-white">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={registerData.fullName}
                    onChange={handleRegisterChange}
                    className="w-full px-3 py-1.5 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B69D74] focus:border-transparent text-white placeholder-white/50"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>

                <div className="mb-0.5">
                  <label htmlFor="registerEmail" className="block text-sm font-medium text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    id="registerEmail"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="w-full px-3 py-1.5 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B69D74] focus:border-transparent text-white placeholder-white/50"
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>

                <div className="mb-0.5">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-white">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={registerData.phoneNumber}
                    onChange={handleRegisterChange}
                    className="w-full px-3 py-1.5 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B69D74] focus:border-transparent text-white placeholder-white/50"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <div className="mb-0.5 flex-1">
                    <label htmlFor="dob" className="block text-sm font-medium text-white">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={registerData.dob}
                      onChange={handleRegisterChange}
                      className="w-full px-3 py-1.5 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B69D74] focus:border-transparent text-white placeholder-white/50"
                      required
                    />
                  </div>

                  <div className="mb-0.5 flex-1">
                    <label className="block text-sm font-medium text-white">
                      Giới tính
                    </label>
                    <div className="flex space-x-4 mt-1.5">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="true"
                          checked={registerData.gender === true}
                          onChange={handleRegisterChange}
                          className="h-4 w-4 text-[#B69D74] focus:ring-[#B69D74] border-2 border-white/30 bg-white/10 mr-2"
                        />
                        <span className="text-sm text-white">Nam</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="false"
                          checked={registerData.gender === false}
                          onChange={handleRegisterChange}
                          className="h-4 w-4 text-[#B69D74] focus:ring-[#B69D74] border-2 border-white/30 bg-white/10 mr-2"
                        />
                        <span className="text-sm text-white">Nữ</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mb-0.5">
                  <label htmlFor="registerPassword" className="block text-sm font-medium text-white">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      id="registerPassword"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="w-full px-3 py-1.5 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B69D74] focus:border-transparent text-white placeholder-white/50"
                      placeholder="Nhập mật khẩu"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleRegisterPasswordVisibility}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-white/70 hover:text-white"
                    >
                      {showRegisterPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69l1.092 1.092a2.5 2.5 0 013.374 3.373l1.091 1.092a4 4 0 00-5.557-5.557z" clipRule="evenodd" />
                          <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 01-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 010-1.186A10.007 10.007 0 012.839 6.02L6.07 9.252a4 4 0 004.678 4.678z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-0.5">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className="w-full px-3 py-1.5 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B69D74] focus:border-transparent text-white placeholder-white/50"
                    placeholder="Nhập lại mật khẩu"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-[#90B77D] bg-white hover:bg-[#B69D74] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B69D74] transition-colors duration-200 mt-2"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>

                <div className="text-center">
                  <a href="#" className="text-xs text-white/70 hover:text-white">
                    Điều khoản dịch vụ
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Overlay Container */}
        <div className="overlay-container">
          <div className="overlay">
            {/* Overlay Left - Hiển thị khi ở trang đăng ký */}
            <div className="overlay-panel overlay-left">
              <div className="p-6 px-10 h-full flex flex-col">
                <div className="flex justify-start">
                  <img 
                    src="/BitKoi.png"
                    alt="BitKoi Logo"
                    className="h-12 w-auto"
                  />
                </div>

                <div className="flex-grow flex flex-col items-center justify-center">
                  <h1 className="text-4xl font-bold text-[#90B77D] mb-4">Chào mừng đến BitKoi!</h1>
                  <p className="text-gray-700 mb-6 text-center">
                    Để tiếp tục kết nối với chúng tôi, vui lòng đăng kí với thông tin cá nhân của bạn
                  </p>
                  <button 
                    className="px-8 py-3 border border-[#90B77D] rounded-full text-[#90B77D] font-medium hover:bg-[#90B77D] hover:text-white transition-colors duration-300" 
                    onClick={() => setIsSignUpMode(false)}
                  >
                    Đăng nhập
                  </button>
                </div>

                <div className="text-right mt-auto">
                  <p className="text-sm text-[#90B77D]">© 2024 Koi Feng Shui Consulting System</p>
                </div>
              </div>
            </div>

            {/* Overlay Right - Hiển thị khi ở trang đăng nhập */}
            <div className="overlay-panel overlay-right">
              <div className="p-6 px-10 h-full flex flex-col">
                <div className="flex justify-end">
                  <img 
                    src="/BitKoi.png"
                    alt="BitKoi Logo"
                    className="h-12 w-auto"
                  />
                </div>

                <div className="flex-grow flex flex-col items-center justify-center">
                  <div className="relative max-w-sm">
                    <div className="absolute inset-0 bg-[#90B77D]/10 rounded-full filter blur-3xl transform scale-150"></div>
                    <div className="relative z-10">
                      <img
                        src="/KoiBase.png"
                        alt="Koi Fish"
                        className="w-full h-auto rounded-2xl shadow-lg"
                      />
                    </div>
                  </div>

                  <h1 className="text-4xl font-bold text-[#90B77D] mt-6 mb-4">Xin chào!</h1>
                  <p className="text-gray-700 mb-6 text-center">
                    Nhập thông tin cá nhân của bạn và bắt đầu hành trình với chúng tôi
                  </p>
                  <button 
                    className="px-8 py-3 border border-[#90B77D] rounded-full text-[#90B77D] font-medium hover:bg-[#90B77D] hover:text-white transition-colors duration-300" 
                    onClick={() => setIsSignUpMode(true)}
                  >
                    Đăng ký ngay
                  </button>
                </div>

                <div className="text-right mt-auto">
                  <p className="text-sm text-[#90B77D]">© 2024 Koi Feng Shui Consulting System</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS cho animation */}
      <style jsx global>{`
        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.7s ease-in-out;
          background-color: #90B77D;
        }

        .sign-in-container {
          left: 0;
          width: 50%;
          z-index: 2;
          visibility: visible;
        }

        .sign-up-mode .sign-in-container {
          transform: translateX(250%);
          opacity: 0;
          visibility: hidden;
          z-index: -1;
          transition: all 0.9s ease-in-out, z-index 0.1s linear 0.8s;
        }

        .sign-up-container {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
          visibility: hidden;
          transform: translateX(-100%);
        }

        .sign-up-mode .sign-up-container {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          visibility: visible;
          transition: all 0.9s ease-in-out;
        }

        .overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: transform 0.9s ease-in-out;
          z-index: 100;
        }

        .sign-up-mode .overlay-container {
          transform: translateX(-100%);
        }

        .overlay {
          background-color: #f8f9fa;
          background-repeat: no-repeat;
          background-position: 0 0;
          color: #333;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: transform 0.9s ease-in-out;
        }

        .sign-up-mode .overlay {
          transform: translateX(50%);
        }

        .overlay-panel {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          text-align: center;
          top: 0;
          height: 100%;
          width: 50%;
          transform: translateX(0);
          transition: transform 0.9s ease-in-out;
        }

        .overlay-left {
          transform: translateX(-20%);
        }

        .sign-up-mode .overlay-left {
          transform: translateX(0);
        }

        .overlay-right {
          right: 0;
          transform: translateX(0);
        }

        .sign-up-mode .overlay-right {
          transform: translateX(20%);
        }

        /* Fix cho khoảng trắng */
        .sign-up-mode .sign-in-container,
        .sign-up-mode .sign-up-container,
        .sign-up-mode .overlay-container,
        .sign-up-mode .overlay {
          transition-timing-function: cubic-bezier(0.52, 0.01, 0.16, 1);
        }

        /* Đảm bảo màu nền trùng khớp để không thấy khoảng trắng */
        .form-container > div {
          background-size: 100% 100%;
        }
        
        .bg-gradient-to-br {
          background-size: 100% 100%;
        }
      `}</style>
    </div>
  );
};

export default Login;
