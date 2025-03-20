import React from "react";
import { Pagination as AntPagination } from "antd";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const total = totalPages * 10; // Giả sử mỗi trang có 10 items

  return (
    <div className="mt-4 flex justify-end">
      <AntPagination
        current={currentPage}
        total={total}
        pageSize={10}
        showSizeChanger={true}
        onChange={onPageChange}
      />
    </div>
  );
};

export default Pagination;
