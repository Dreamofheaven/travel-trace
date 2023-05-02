import React from "react";

function MainPage() {
  return (
    <div>
      <h1>메인 페이지</h1>
      <p>여기는 메인 페이지 입니다.</p>
      <img src={process.env.PUBLIC_URL + '/adult.jpg'} /> 
    </div>
  );
}

export default MainPage;