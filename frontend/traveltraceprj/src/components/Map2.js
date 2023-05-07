import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
const { kakao } = window;

const Map2 = () => {
  const [cookies] = useCookies(['access', 'refresh']);//쿠키
  const [location, setLocation] = useState("");

  useEffect(() => {
    const container = document.getElementById('myMap');
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };
    const map = new kakao.maps.Map(container, options);

    // 주소-좌표 변환 객체를 생성합니다
    const geocoder = new kakao.maps.services.Geocoder();

    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
    if (navigator.geolocation) {
    
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        function(position) {  
          const lat = position.coords.latitude; // 위도
          const lon = position.coords.longitude; // 경도
      
          const locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
          const message = '<div style="padding:20px; border-line:none; font-size:15px; white-space:nowrap;">상단의 주소를 클릭하면<br>근처 여행지를 추천해드려요!</div>'; // 인포윈도우에 표시될 내용입니다

          // 마커와 인포윈도우를 표시합니다
          displayMarker(locPosition, message);

          // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
          searchAddrFromCoords(locPosition, displayCenterInfo);
          // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
          kakao.maps.event.addListener(map, 'idle', function() {
            searchAddrFromCoords(locPosition, displayCenterInfo);
          });
        });

    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      const locPosition = new kakao.maps.LatLng(33.450701, 126.570667)
      const message = 'geolocation을 사용할수 없어요..'
      displayMarker(locPosition, message);
    }

    // 지도에 마커와 인포윈도우를 표시하는 함수입니다
    function displayMarker(locPosition, message) {
      // 마커를 생성합니다
      const marker = new kakao.maps.Marker({  
        map: map, 
        position: locPosition,
        draggable: true
      }); 
      const iwContent = message// 인포윈도우에 표시할 내용
      const iwRemoveable = true;
  
      // 인포윈도우를 생성합니다
      const infowindow = new kakao.maps.InfoWindow({
          content : iwContent,
          removable : iwRemoveable
        });
  
      // 인포윈도우를 마커위에 표시합니다 
      infowindow.open(map, marker);
      
      // 마커 드래그가 끝났을 때 이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'dragend', function() {
      infowindow.setPosition(marker.getPosition());
      const coords = marker.getPosition(); // 마커의 위치 좌표를 얻습니다
      searchAddrFromCoords(coords, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const infoDiv = document.getElementById('centerAddr');
          setLocation(result[0].address_name);
          infoDiv.innerHTML = result[0].address_name;
        }
      });
    });
      
      // 지도 중심좌표를 접속위치로 변경합니다
      map.setCenter(locPosition);    
    }

    // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, 'idle', function() {
      searchAddrFromCoords(map.getCenter(), displayCenterInfo);
    });

    function searchAddrFromCoords(coords, callback) {
      // 좌표로 행정동 주소 정보를 요청합니다
      geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
    }

    // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
    function displayCenterInfo(result, status) {  
      if (status === kakao.maps.services.Status.OK) {
        const infoDiv = document.getElementById('centerAddr');
        setLocation(result[0].address_name)

        for(let i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === 'H') {
              console.log(result[i].address_name)
              infoDiv.innerHTML = result[i].address_name;
              break;
          }
        }
      }
    }
  });

  // 주소를 클릭하면 서버로 보내기 
  const handleClicked = (event) => {
    event.preventDefault();
        // HTTP POST 요청 보내기
    axios.post(`http://127.0.0.1:8000/accounts/current_location/`, {location},{
      headers: {
        Authorization: `Bearer ${cookies.access}`, // access 토큰을 요청 헤더에 포함
      },})
      .then(response => {
        console.log(response);
        window.location.href = '/opper';
      })
      .catch(error => {
        console.log(error);
        window.location.href = '/opper';
      });
}

  return (
    <Container className="d-flex justify-content-center my-5">
      <div id='myMap' style={{
        width: '1000px', 
        height: '500px',
        textAlign: 'center',
      }}/>
      <div className="map_wrap">
        <Button id="centerAddr" onClick={handleClicked}
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '1',
            backgroundColor: 'darkgreen',
            border :'none',
            padding: '12px',
            borderRadius: '10px',
          }}/>
          {/* <Link to="/all">
            <Button id="centerAddr"
              style={{
                position: 'absolute',
                top: '20%',
                left: '20%',
                transform: 'translate(-50%, -50%)',
                zIndex: '1',
                backgroundColor: '#A0D468',
                border :'none',
                padding: '12px',
                borderRadius: '10px',
              }}/>
          </Link> */}
      </div>
    </Container>
  );
}

export default Map2; 

