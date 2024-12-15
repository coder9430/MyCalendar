import React, { useState } from "react";
import { Button } from "../ui/button"; // Assuming you have a Button component from shadcn
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

function Calendar() {
  const [currentDate, setCurrentDate] = useState(getISTDate());
  const navigate = useNavigate(); // Initialize the navigate function

  // Helper functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const prevMonth = prevDate.getMonth() - 1;
      return getISTDate(new Date(prevDate.getFullYear(), prevMonth, 1));
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const nextMonth = prevDate.getMonth() + 1;
      return getISTDate(new Date(prevDate.getFullYear(), nextMonth, 1));
    });
  };

  // Adjust date to IST (UTC +5:30)
  function getISTDate(date = new Date()) {
    const localDate = new Date(date);
    const utcOffset = localDate.getTimezoneOffset(); // Local timezone offset in minutes
    const istOffset = 5 * 60 + 30; // IST offset in minutes (UTC +5:30)
    const diff = istOffset - utcOffset;
    localDate.setMinutes(localDate.getMinutes() + diff); // Adjust to IST
    return localDate;
  }

  // Navigate to the new page with the selected date in the URL
  const handleDateClick = (day) => {
    // Create a new date object for the selected day, adjusted to IST
    const newDate = getISTDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    // Navigate to the new page with the date in ISO format
    navigate(`/date/${newDate.toISOString().split('T')[0]}`);
  };

  // Variables
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Create an array for calendar days
  const calendarDays = Array(firstDayOfMonth)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div className="flex flex-col items-center p-8 border rounded-lg shadow-md bg-white w-[60%] h-[90%]">
      {/* Header */}
      <div className="flex justify-between items-center w-full mb-6">
        <Button variant="outline" onClick={handlePrevMonth}>
          Previous
        </Button>
        <h2 className="text-2xl font-bold">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <Button variant="outline" onClick={handleNextMonth}>
          Next
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4 w-full">
        {/* Weekday Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium text-gray-700">
            {day}
          </div>
        ))}

        {/* Days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`flex items-center justify-center text-center p-4 rounded-lg text-lg font-medium ${
              day ? "bg-gray-100 hover:bg-gray-200 cursor-pointer" : ""
            }`}
            style={{ minHeight: "70px", minWidth: "70px" }}
            onClick={() => day && handleDateClick(day)} // Call handleDateClick on day click
          >
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
