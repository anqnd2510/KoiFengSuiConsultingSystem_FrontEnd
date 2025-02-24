import { Link } from "react-router-dom";

const WorkshopTable = ({ workshops }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Workshop ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Workshop Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Location
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Action
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
                <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
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
      <div className="flex justify-end py-4 px-6 bg-gray-100">
        <div className="flex items-center space-x-1">
          <button className="px-3 py-1 bg-gray-300 rounded">Previous</button>
          <button className="px-3 py-1 bg-gray-300 rounded">1</button>
          <button className="px-3 py-1 bg-gray-300 rounded">2</button>
          <button className="px-3 py-1 bg-gray-300 rounded">3</button>
          <span className="px-2 py-1">...</span>
          <button className="px-3 py-1 bg-gray-300 rounded">99</button>
          <button className="px-3 py-1 bg-gray-300 rounded">Next</button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopTable;