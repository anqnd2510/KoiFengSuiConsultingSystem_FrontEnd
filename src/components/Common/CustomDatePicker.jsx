import React from "react";
import { DatePicker } from "antd";
import "dayjs/locale/vi";

const CustomDatePicker = ({ value, onChange }) => {
  return (
    <DatePicker
      value={value}
      onChange={onChange}
      format="dddd, DD [tháng] MM, YYYY"
      className="border-0 bg-gray-50 py-2 px-4 rounded-lg text-gray-600 font-medium hover:border-[#B4925A] focus:border-[#B4925A] cursor-pointer"
      placeholder="Chọn ngày"
      allowClear={false}
      locale={{
        lang: {
          locale: "vi",
          placeholder: "Chọn ngày",
          rangePlaceholder: ["Ngày bắt đầu", "Ngày kết thúc"],
          today: "Hôm nay",
          now: "Bây giờ",
          backToToday: "Trở về hôm nay",
          ok: "Đồng ý",
          clear: "Xóa",
          month: "Tháng",
          year: "Năm",
          previousMonth: "Tháng trước",
          nextMonth: "Tháng sau",
          monthSelect: "Chọn tháng",
          yearSelect: "Chọn năm",
          decadeSelect: "Chọn thập kỷ",
          yearFormat: "YYYY",
          dateFormat: "DD/MM/YYYY",
          dayFormat: "DD",
          dateTimeFormat: "DD/MM/YYYY HH:mm:ss",
          monthFormat: "MM/YYYY",
          monthBeforeYear: true,
          previousYear: "Năm trước",
          nextYear: "Năm sau",
          previousDecade: "Thập kỷ trước",
          nextDecade: "Thập kỷ sau",
          previousCentury: "Thế kỷ trước",
          nextCentury: "Thế kỷ sau",
        },
      }}
    />
  );
};

export default CustomDatePicker;
