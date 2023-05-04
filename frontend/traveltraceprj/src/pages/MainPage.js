import React from "react";
import { Link } from 'react-router-dom';
import "../styles/MainPage.css";

function MainPage() {
  return (
    <div className="d-flex justify-content-center">
      <div style={{flexDirection: 'column'}}> 
        <Link to='/map'>
          <img src={process.env.PUBLIC_URL + '/img/location.png'} 
            style={{width: "30%", marginTop: "100px", marginBottom: "100px"}}
          />
        </Link>
        <span>현위치를 확인하세요!</span>
        <span>당신과 가까운 여행지를 소개해드릴게요!</span>
        {/* <img src={process.env.PUBLIC_URL + '/img/adult.jpg'} />  */}
      </div>
    </div>
  );
}

export default MainPage;