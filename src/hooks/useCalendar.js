import { useState, useMemo } from "react";
import { getMonthData } from "../utils/dateUtils";

export const useCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = useMemo(() => {
    return getMonthData(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  return {
    currentDate,
    days,
    goToPreviousMonth,
    goToNextMonth,
  };
};
