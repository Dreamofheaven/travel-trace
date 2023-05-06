import React from "react";
import { Link } from 'react-router-dom';
import "../styles/MainPage.css";
import { GeoAltFill } from 'react-bootstrap-icons'
import background from '../assets/background.jpg'

function MainPage() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center background">
      <div>
        <Link to='/map_second'>
          {/* <img src={process.env.PUBLIC_URL + '/img/location.png'} 
            style={{width: "30%", marginTop: "100px", marginBottom: "100px"}}
          /> */}
          <GeoAltFill className="geo_icon" />
        </Link>
      </div>

      <div className="mb-2"><span className="fw-bold">현위치를 등록</span>해주세요!</div>
      <div className="mb-5">당신과 가까운 여행지를 소개해드릴게요!</div>

      {/* <img src={process.env.PUBLIC_URL + '/img/adult.jpg'} />  */}
    </div>
  );
}

export default MainPage;