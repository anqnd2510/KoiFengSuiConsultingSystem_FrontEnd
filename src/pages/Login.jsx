import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { login } from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

        navigate("/master/schedule", { replace: true });
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

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image */}
      <div className="hidden lg:block w-1/2 relative bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="h-screen flex items-center justify-center p-12">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-100 rounded-full filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

          {/* Image container with shadow and border */}
          <div className="relative w-[90%] h-[90%] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/koi-fish-typography-dark-background-generative-ai_804788-20152.avif"
              alt="Koi fish"
              className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-700 ease-in-out"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>

        {/* Brand message with enhanced styling */}
        <div className="absolute bottom-12 left-12 z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-12 bg-black rounded-full"></div>
              <h2 className="text-5xl font-bold text-gray-800">BitKoi</h2>
            </div>
            <p className="text-xl text-gray-600 font-light max-w-md leading-relaxed">
              Discover the perfect harmony of traditional Feng Shui wisdom in
              the modern digital age
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 right-8 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 bg-white">
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className="text-center mb-12">
            <img
              src="/logo.png"
              alt="BitKoi Logo"
              className="h-20 mx-auto mb-6 drop-shadow-lg"
            />
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition duration-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black transition duration-200"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-black hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-3 rounded-lg bg-black text-white transition duration-200 transform hover:scale-[1.02] ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-900"
              }`}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google login button */}
            <button
              type="button"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center gap-2 transition duration-200"
              onClick={() => {
                /* Xử lý đăng nhập Google */
              }}
            >
              <img src="/R.png" alt="Google" className="h-5 w-5" />
              <span>Google</span>
            </button>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-600 mt-8">
              Don't have an account?{" "}
              <a href="#" className="text-black font-semibold hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
