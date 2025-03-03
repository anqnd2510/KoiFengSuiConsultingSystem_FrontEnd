import { Link } from "react-router-dom";

const WorkshopTable = ({ workshops, onViewWorkshop }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Mã hội thảo
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Tên hội thảo
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Địa điểm
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Ngày
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Trạng thái
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {workshops.map((workshop) => (
            <tr key={workshop.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">
                {workshop.id}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {workshop.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {workshop.location}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {workshop.date}
              </td>
              <td className="px-6 py-4 text-sm space-x-2">
                <button 
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => onViewWorkshop(workshop)}
                >
                  View
                </button>
                <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                  Update
                </button>
                <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkshopTable;