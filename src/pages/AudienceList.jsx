import { useState } from 'react';
import Audience from '../components/Workshop/Audience';

const AudienceList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('Error');

  // Mock data giống như trong Figma
  const audiences = [
    {
      ticketId: 'T01',
      customerName: 'John Smith',
      phone: '1234567890',
      gmail: 'johnsmith@gmail.com',
      date: '1/1/2021',
      status: 'Checked in'
    },
    {
      ticketId: 'T02',
      customerName: 'John Smith',
      phone: '1234567890',
      gmail: 'johnsmith@gmail.com',
      date: '1/1/2021',
      status: 'Pending'
    },
    {
      ticketId: 'T03',
      customerName: 'John Smith',
      phone: '1234567890',
      gmail: 'johnsmith@gmail.com',
      date: '1/1/2021',
      status: 'Absent'
    },
    {
      ticketId: 'T04',
      customerName: 'John Smith',
      phone: '1234567890',
      gmail: 'johnsmith@gmail.com',
      date: '1/1/2021',
      status: 'Pending'
    }
  ];

  return (
    <div className="p-6">
      <div className="bg-[#B08D57] text-white p-4">
        <h1 className="text-2xl font-semibold">Workshop's audiences</h1>
        <p className="text-sm">Reports and all audiences from checked in the workshop</p>
      </div>

      <div className="bg-white rounded-lg shadow mt-4">
        <div className="flex justify-between p-4">
          <button className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2">
            Add new audience
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search content..."
              className="border border-gray-300 rounded-lg px-4 py-2 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3">Ticket ID</th>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3">Gmail</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {audiences.map((audience) => (
                <Audience key={audience.ticketId} {...audience} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4 gap-2 bg-gray-100 py-4 px-6 rounded-b-lg">
          <button 
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <button className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg`}>
            1
          </button>
          <button className={`px-4 py-2 ${currentPage === 2 ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg`}>
            2
          </button>
          <button className={`px-4 py-2 ${currentPage === 3 ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg`}>
            3
          </button>
          <span className="px-2 py-2">...</span>
          <button className={`px-4 py-2 ${currentPage === 99 ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg`}>
            99
          </button>
          <button 
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={() => setCurrentPage(prev => Math.min(99, prev + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudienceList;
