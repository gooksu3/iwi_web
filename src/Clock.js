import React, { useState, useEffect } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // 1초마다 시간을 업데이트
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 컴포넌트 언마운트 시 interval 정리
    return () => clearInterval(intervalId);
  }, []);

  // 시간 포맷 함수
  const formatDate = (date) => {
    const weekDays=["일","월","화","수","목","금","토"]
    const year = date.getFullYear();
    const strYear=year.toString().substring(2,4)
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const weekDay=weekDays[date.getDay()]
    
    return `${'\''}${strYear}.${month}.${day}.(${weekDay})`;
  };
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div style={{fontFamily: 'Courier',color: "#EAF3FD",paddingRight:"20px"}}>
      <span style={{fontSize: "2.2vw",paddingRight:"10px"}}>{formatDate(time)}</span>
      <span style={{fontWeight: "bold", fontSize: "3.5vw"}}>{formatTime(time)}</span>
    </div>
  );
}

export default Clock;
