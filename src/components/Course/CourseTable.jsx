import React from 'react';

const CourseTable = ({ courses, onViewCourse, onUpdateCourse, onDeleteCourse }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Course ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Course Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Price
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
          {courses.map((course) => (
            <tr key={course.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">
                {course.id}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {course.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                ${course.price}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {course.date}
              </td>
              <td className="px-6 py-4 text-sm space-x-2">
                <button 
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => onViewCourse(course)}
                >
                  View
                </button>
                <button 
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  onClick={() => onUpdateCourse(course)}
                >
                  Update
                </button>
                <button 
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => onDeleteCourse(course)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {/* Thêm các hàng trống nếu cần */}
          {Array.from({ length: Math.max(0, 3 - courses.length) }).map((_, index) => (
            <tr key={`empty-${index}`} className="h-16">
              <td className="px-6 py-4 text-sm text-gray-900"></td>
              <td className="px-6 py-4 text-sm text-gray-900"></td>
              <td className="px-6 py-4 text-sm text-gray-900"></td>
              <td className="px-6 py-4 text-sm text-gray-900"></td>
              <td className="px-6 py-4 text-sm text-gray-900"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable; 