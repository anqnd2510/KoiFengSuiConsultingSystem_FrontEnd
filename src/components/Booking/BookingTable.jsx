import { Link } from "react-router-dom";
import StatusBadge from "../Common/StatusBadge";

const BookingTable = ({ bookings }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Customer Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Description
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Time
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Master
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Online/Offline
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="px-6 py-4 text-sm text-gray-900">
                <Link
                  to={`/booking-schedule/${booking.id}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {booking.customerName}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {booking.description}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {booking.date}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {booking.time}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {booking.master}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <StatusBadge isOnline={booking.isOnline} />
              </td>
              <td className="px-6 py-4 text-sm">
                <StatusBadge status={booking.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
