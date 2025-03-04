import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/Common/SearchBar";
import Header from "../components/Common/Header";
import Error from "../components/Common/Error";
import CustomButton from "../components/Common/CustomButton";
import CustomTable from "../components/Common/CustomTable";
import Pagination from "../components/Common/Pagination";
import { Plus } from "lucide-react";

const WorkshopCheck = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học",
      location: "Đại học FPT",
      date: "1/5/2021"
    },
    {
      id: 2,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học I",
      location: "Đại học FPT",
      date: "1/5/2021"
    },
    {
      id: 3,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học II",
      location: "Đại học FPT",
      date: "1/5/2021"
    },
    {
      id: 4,
      name: "Đại Đạo Chi Giản - Phong Thủy Cơ Học III",
      location: "Đại học FPT",
      date: "1/5/2021"
    }
  ]);

  const columns = [
    {
      title: "Mã hội thảo",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên hội thảo",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Thao tác",
      key: "action",
      render: () => (
        <div className="flex gap-2">
          <CustomButton className="!bg-yellow-500 hover:!bg-yellow-600 text-white">
            Xem
          </CustomButton>
          <CustomButton className="!bg-green-500 hover:!bg-green-600 text-white">
            Chấp thuận 
          </CustomButton>
          <CustomButton className="!bg-red-500 hover:!bg-red-600 text-white">
            Từ chối 
          </CustomButton>
        </div>
      ),
    },
  ];

  const handleManageWorkshops = () => {
    try {
      navigate('/workshop-staff');
    } catch (err) {
      setError("Không thể chuyển đến trang quản lý hội thảo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Quản lý hội thảo"
        description="Báo cáo và tổng quan về hội thảo của bạn"
      />

      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="flex justify-end p-4">
            <div className="flex items-center gap-4">
              <SearchBar 
                onSearch={(term) => console.log('Đang tìm kiếm:', term)} 
              />
            </div>
          </div>

          {error && <Error message={error} />}

          <div className="p-4">
            <CustomTable 
              columns={columns}
              dataSource={workshops}
            />
          </div>

          <div className="p-4">
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopCheck;