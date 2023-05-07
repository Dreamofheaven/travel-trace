import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Airplane } from 'react-bootstrap-icons'

function Opper() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center background">
    <div>
      <Link to="/all">
          <Airplane className="geo_icon" />
      </Link>
    </div>
      <h1>
        당신 근처의 여행지를 찾았습니다!
        아이콘을 누르고, ✨내 주변✨을 클릭해보세요.
      </h1>
  </div>
  );
}


export default Opper;