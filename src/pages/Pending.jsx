import { useLocation, useNavigate } from 'react-router-dom';

const Pending = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy message từ state nếu có, nếu không thì dùng message mặc định
  const message = location.state?.message || "Tài khoản đang trong quá trình xác nhận, vui lòng đăng nhập lại sau";

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

      {/* Container chính */}
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl relative z-10 p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Logo */}
          <img 
            src="https://media.discordapp.net/attachments/1310277686760833046/1352292725193445517/BitKoi.png?ex=67f1eb7e&is=67f099fe&hm=610b389036636220ab97bc3230a94a741e45b83dc02f6dbf6ac47267c1fb14d9&=&format=webp&quality=lossless&width=536&height=230"
            alt="BitKoi Logo"
            className="h-16 w-auto mb-4"
          />
          
          {/* Icon */}
          <div className="bg-[#90B77D]/20 p-5 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#90B77D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-[#416D19]">Tài khoản đang xác nhận</h1>
          
          {/* Divider */}
          <div className="w-16 h-1 bg-[#90B77D] rounded"></div>
          
          {/* Message */}
          <p className="text-lg text-gray-700">{message}</p>
          
          {/* Thông báo bổ sung */}
          <p className="text-base text-gray-600 italic">
            Chúng tôi sẽ xác nhận tài khoản của bạn trong vòng 24 giờ
          </p>
          
          {/* Button */}
          <button 
            onClick={() => navigate('/login', { replace: true })}
            className="mt-6 px-8 py-3 border border-[#90B77D] rounded-full text-[#90B77D] font-medium hover:bg-[#90B77D] hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Quay lại đăng nhập
          </button>
          
          {/* Footer */}
          <div className="mt-8 text-sm text-gray-500">
            © 2024 Koi Feng Shui Consulting System
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pending;