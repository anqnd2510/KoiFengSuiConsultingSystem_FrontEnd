import React, { useState, useEffect } from "react";
import Header from "../../components/Common/Header";
import Error from "../../components/Common/Error";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { UserOutlined, BookOutlined, StarOutlined } from "@ant-design/icons";
import { getDashboardInfo } from "../../services/account.service";

const COLORS = ["#FF4D4F", "#1890FF"];
const SERVICE_COLORS = ["#FF4D4F", "#52C41A", "#1890FF"];

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardInfo();
        if (response && response.isSuccess && response.data) {
          setDashboardData(response.data);
        } else {
          setError("Không thể lấy dữ liệu Dashboard");
        }
      } catch (err) {
        setError("Đã xảy ra lỗi khi lấy dữ liệu Dashboard");
        console.error("Dashboard data error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chuẩn bị dữ liệu cho biểu đồ
  const prepareMonthlyData = () => {
    if (!dashboardData || !dashboardData.monthlyComparison) return [];

    const data = dashboardData.monthlyComparison.map((item) => ({
      month: item.monthYear,
      bookingOnline: item.bookingOnline,
      bookingOffline: item.bookingOffline,
      courses: item.courses,
      workshops: item.workshops,
    }));

    return data.length > 0 ? data : [];
  };

  const prepareGenderData = () => {
    if (!dashboardData || !dashboardData.genderStats) return [];

    const data = [
      { name: "Nam", value: dashboardData.genderStats.male },
      { name: "Nữ", value: dashboardData.genderStats.female },
    ];

    return data.some((item) => item.value > 0) ? data : [];
  };

  const prepareServiceData = () => {
    if (!dashboardData) return [];

    const data = [
      {
        name: "Tư vấn trực tuyến",
        value: dashboardData.todayRecord?.bookingOnline || 0,
      },
      {
        name: "Tư vấn trực tiếp",
        value: dashboardData.todayRecord?.bookingOffline || 0,
      },
      { name: "Khóa học", value: dashboardData.todayRecord?.courses || 0 },
    ];

    return data.some((item) => item.value > 0) ? data : [];
  };

  const prepareTimeData = () => {
    if (!dashboardData || !dashboardData.timeAdmittedToday) return [];

    const data = dashboardData.timeAdmittedToday.map((item) => ({
      time: `${item.time}:00`,
      value: item.count,
    }));

    return data.some((item) => item.value > 0) ? data : [];
  };

  return (
    <div className="flex-1 bg-[#F8F9FC]">
      <Header
        title="Trang chủ"
        description="Chào mừng đến với trang quản trị"
      />

      <main className="p-4 md:p-8 max-w-[2000px] mx-auto">
        {error && <Error message={error} />}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-8">
          <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 group">
            <div className="flex items-center">
              <div className="bg-blue-50 p-3 md:p-5 rounded-2xl mr-4 md:mr-6 group-hover:scale-110 transition-transform duration-300">
                <BookOutlined className="text-blue-500 text-2xl md:text-3xl" />
              </div>
              <div>
                <p className="text-gray-500 text-xs md:text-sm font-medium mb-1 md:mb-2 uppercase tracking-wider">
                  Doanh thu
                </p>
                <h3 className="text-xl md:text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {dashboardData?.revenue?.toLocaleString() || "0"} VNĐ
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 group">
            <div className="flex items-center">
              <div className="bg-amber-50 p-3 md:p-5 rounded-2xl mr-4 md:mr-6 group-hover:scale-110 transition-transform duration-300">
                <StarOutlined className="text-amber-500 text-2xl md:text-3xl" />
              </div>
              <div>
                <p className="text-gray-500 text-xs md:text-sm font-medium mb-1 md:mb-2 uppercase tracking-wider">
                  Tư vấn trực tuyến/trực tiếp
                </p>
                <h3 className="text-xl md:text-3xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors">
                  {(dashboardData?.todayRecord?.bookingOnline || 0) +
                    (dashboardData?.todayRecord?.bookingOffline || 0)}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 group">
            <div className="flex items-center">
              <div className="bg-green-50 p-3 md:p-5 rounded-2xl mr-4 md:mr-6 group-hover:scale-110 transition-transform duration-300">
                <UserOutlined className="text-green-500 text-2xl md:text-3xl" />
              </div>
              <div>
                <p className="text-gray-500 text-xs md:text-sm font-medium mb-1 md:mb-2 uppercase tracking-wider">
                  Tổng số khách hàng
                </p>
                <h3 className="text-xl md:text-3xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                  {dashboardData?.totalCustomers?.toLocaleString() || "0"}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
          <div className="lg:col-span-12 xl:col-span-7">
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Thống kê tổng quan
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Tư vấn - Khóa học - Hội thảo
                  </p>
                </div>
              </div>
              <div className="h-[300px] md:h-[380px] flex items-center justify-center">
                {prepareMonthlyData().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareMonthlyData()} barGap={8}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        fontSize={13}
                      />
                      <YAxis axisLine={false} tickLine={false} fontSize={13} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.98)",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          padding: "12px 16px",
                        }}
                      />
                      <Bar
                        dataKey="bookingOnline"
                        name="Tư vấn trực tuyến"
                        fill="#FF4D4F"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={50}
                      />
                      <Bar
                        dataKey="bookingOffline"
                        name="Tư vấn trực tiếp"
                        fill="#52C41A"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={50}
                      />
                      <Bar
                        dataKey="courses"
                        name="Khóa học"
                        fill="#1890FF"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={50}
                      />
                      <Bar
                        dataKey="workshops"
                        name="Hội thảo"
                        fill="#FAAD14"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={50}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500">
                    <p className="text-lg">Chưa có dữ liệu thống kê</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-12 xl:col-span-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                      Phân bố giới tính
                    </h2>
                    <p className="text-gray-500 text-sm mb-4 md:mb-8">
                      Tài khoản theo giới tính
                    </p>
                  </div>
                </div>
                <div className="h-[200px] md:h-[350px] mt-4 flex items-center justify-center">
                  {prepareGenderData().length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareGenderData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {prepareGenderData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index]}
                              strokeWidth={0}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.98)",
                            border: "none",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            padding: "12px 16px",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          iconSize={10}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-gray-500">
                      <p className="text-lg">
                        Chưa có dữ liệu phân bố giới tính
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50">
                <div className="flex flex-col space-y-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                      Phân bố dịch vụ
                    </h2>
                    <p className="text-gray-500 text-sm mb-4 md:mb-8">
                      Phân bố theo loại dịch vụ
                    </p>
                  </div>
                </div>
                <div className="h-[200px] md:h-[350px] mt-4 flex items-center justify-center">
                  {prepareServiceData().length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareServiceData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          {prepareServiceData().map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={SERVICE_COLORS[index]}
                              strokeWidth={0}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.98)",
                            border: "none",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            padding: "12px 16px",
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          iconSize={10}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center text-gray-500">
                      <p className="text-lg">Chưa có dữ liệu phân bố dịch vụ</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Distribution & Daily Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 mt-4 md:mt-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Phân bố thời gian
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Thời gian đăng ký trong ngày
                  </p>
                </div>
              </div>
              <div className="h-[250px] md:h-[280px] flex items-center justify-center">
                {prepareTimeData().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={prepareTimeData()}
                      margin={{ left: 25, right: 25, top: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorValue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#FF4D4F"
                            stopOpacity={0.18}
                          />
                          <stop
                            offset="95%"
                            stopColor="#FF4D4F"
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        fontSize={13}
                        padding={{ left: 30, right: 30 }}
                        interval={0}
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        fontSize={13}
                        width={40}
                        tickFormatter={(value) => `${value}`}
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      />
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.98)",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          padding: "12px 16px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#FF4D4F"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500">
                    <p className="text-lg">Chưa có dữ liệu phân bố thời gian</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100/50">
              <div className="flex flex-col space-y-4 mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    Thống kê hệ thống
                  </h2>
                  <p className="text-gray-500 text-sm">Số liệu hệ thống</p>
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                <div className="bg-blue-50/50 rounded-2xl p-6 hover:bg-blue-50 transition-colors duration-300 group cursor-pointer">
                  <div className="flex items-center">
                    <div className="bg-white p-4 rounded-xl mr-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <BookOutlined className="text-blue-500 text-2xl" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">
                        Tổng số khóa học đã bán
                      </p>
                      <p className="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {dashboardData?.todayRecord?.courses || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50/50 rounded-2xl p-6 hover:bg-gray-100 transition-colors duration-300 group cursor-pointer">
                  <div className="flex items-center">
                    <div className="bg-white p-4 rounded-xl mr-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <UserOutlined className="text-gray-500 text-2xl" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">
                        Tổng số vé hội thảo đã bán
                      </p>
                      <p className="text-3xl font-bold text-gray-800 group-hover:text-gray-600 transition-colors">
                        {dashboardData?.todayRecord?.checkInWorkshops || 0}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50/50 rounded-2xl p-6 hover:bg-red-50 transition-colors duration-300 group cursor-pointer">
                  <div className="flex items-center">
                    <div className="bg-white p-4 rounded-xl mr-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <StarOutlined className="text-red-500 text-2xl" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium mb-1">
                        Tổng số buổi tư vấn thành công
                      </p>
                      <p className="text-3xl font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                        {(dashboardData?.todayRecord?.bookingOnline || 0) +
                          (dashboardData?.todayRecord?.bookingOffline || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
