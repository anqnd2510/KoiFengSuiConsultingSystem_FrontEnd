const WorkshopTableManager = ({ workshops }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left font-medium">Mã hội thảo</th>
            <th className="px-4 py-2 text-left font-medium">Tên hội thảo</th>
            <th className="px-4 py-2 text-left font-medium">Địa điểm</th>
            <th className="px-4 py-2 text-left font-medium">Ngày</th>
            <th className="px-4 py-2 text-left font-medium">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {workshops.map((workshop) => (
            <tr key={workshop.id}>
              <td className="px-4 py-3 whitespace-nowrap">{workshop.id}</td>
              <td className="px-4 py-3 whitespace-nowrap">{workshop.name}</td>
              <td className="px-4 py-3 whitespace-nowrap">{workshop.location}</td>
              <td className="px-4 py-3 whitespace-nowrap">{workshop.date}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex gap-2">
                  <button 
                    className="px-3 py-1 text-white text-sm rounded-md bg-[#F59E0B] hover:bg-[#D97706]"
                  >
                    Xem
                  </button>
                  <button 
                    className="px-3 py-1 text-white text-sm rounded-md bg-[#22C55E] hover:bg-[#16A34A]"
                  >
                    Duyệt
                  </button>
                  <button 
                    className="px-3 py-1 text-white text-sm rounded-md bg-[#EF4444] hover:bg-[#DC2626]"
                  >
                    Từ chối
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 gap-2 bg-gray-100 py-4 px-6 rounded-b-lg">
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Trước</button>
        <button className="px-4 py-2 bg-gray-300 rounded-lg">1</button>
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">2</button>
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">3</button>
        <span className="px-2 py-2">...</span>
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">99</button>
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Sau</button>
      </div>
    </div>
  );
};

export default WorkshopTableManager;