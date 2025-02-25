const WorkshopTableManager = ({ workshops }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 text-left font-medium">Workshop ID</th>
            <th className="px-4 py-2 text-left font-medium">Workshop Name</th>
            <th className="px-4 py-2 text-left font-medium">Location</th>
            <th className="px-4 py-2 text-left font-medium">Date</th>
            <th className="px-4 py-2 text-left font-medium">Action</th>
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
                    View
                  </button>
                  <button 
                    className="px-3 py-1 text-white text-sm rounded-md bg-[#22C55E] hover:bg-[#16A34A]"
                  >
                    Approve
                  </button>
                  <button 
                    className="px-3 py-1 text-white text-sm rounded-md bg-[#EF4444] hover:bg-[#DC2626]"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4 gap-2 bg-gray-100 py-4 px-6 rounded-b-lg">
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Previous</button>
        <button className="px-4 py-2 bg-gray-300 rounded-lg">1</button>
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">2</button>
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">3</button>
        <span className="px-2 py-2">...</span>
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">99</button>
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Next</button>
      </div>
    </div>
  );
};

export default WorkshopTableManager;