// 사용안함
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// 달력 기능 구현하는 컴포넌트라서 얘는 아직 손볼게 있어서 꾸미지 않으셔도 되어요~!

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
