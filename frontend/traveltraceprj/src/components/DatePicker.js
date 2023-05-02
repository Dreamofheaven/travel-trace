import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function DatePicker() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [date, setDate] = useState(new Date());

  const toggleCalendar = () => {
    setShowCalendar((prevShowCalendar) => !prevShowCalendar);
  };

  const onChange = (date) => {
    setDate(date);
  };

  return (
    <div>
      <button onClick={toggleCalendar}>날짜</button>
      {showCalendar && (
        <div>
          <Calendar onChange={onChange} value={date} />
          <p>선택된 날짜: {date.toString()}</p>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
