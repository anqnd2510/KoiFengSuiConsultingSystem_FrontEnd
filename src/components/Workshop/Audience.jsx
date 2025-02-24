const Audience = ({ ticketId, customerName, phone, gmail, date, status }) => {
  const getStatusStyle = (status) => {
    const styles = {
      'checked in': 'bg-green-500',
      'pending': 'bg-blue-500', 
      'absent': 'bg-red-500'
    };
    return `${styles[status.toLowerCase()]} text-white px-3 py-1 rounded-full text-sm`;
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-6 py-4">{ticketId}</td>
      <td className="px-6 py-4">{customerName}</td>
      <td className="px-6 py-4">{phone}</td>
      <td className="px-6 py-4">{gmail}</td>
      <td className="px-6 py-4">{date}</td>
      <td className="px-6 py-4">
        <span className={getStatusStyle(status)}>
          {status}
        </span>
      </td>
    </tr>
  );
};

export default Audience;
