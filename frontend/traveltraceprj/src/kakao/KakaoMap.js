import React, { useEffect, useState } from 'react'
import Test from '../pages/Test'

const { kakao } = window

const KakaoMap = ({ searchPlace, setLocation, setPlaceName }) => {
  // const [placeName, setPlaceName] = useState('')

  const [InputText, setInputText] = useState('')
  const [Place, setPlace] = useState('')
  // const [address, setAddress] = useState('')


  const onChange = (e) => {
    setInputText(e.target.value)
    console.log(InputText)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPlace(InputText)
    setInputText('')
  }
  
  useEffect(() => {
    var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 })
    const container = document.getElementById('myMap')
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    }
    const map = new kakao.maps.Map(container, options)

    const ps = new kakao.maps.services.Places()

    ps.keywordSearch(searchPlace, placesSearchCB)

    function placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        let bounds = new kakao.maps.LatLngBounds()

        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i])
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x))
        }

        map.setBounds(bounds)
      }
    }

    function displayMarker(place) {
      let marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x),
      })

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'click', function () {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        setPlaceName(place.place_name)
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>')
        infowindow.open(map, marker)

        // 클릭한 위치의 좌표를 얻어옵니다
        var latlng = marker.getPosition();
        
        // 좌표로 위치 정보를 얻어옵니다
        var geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(latlng.getLng(), latlng.getLat(), function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
              setLocation(result[0].address.address_name);
            }
        });
      })
    }
  }, [searchPlace])

  return (
    <div>
      <div
          id="myMap"
          style={{
            width: '500px',
            height: '500px',
          }}>
      </div>
    </div>
  )
}

export default KakaoMap
    //   <div>
    //     <form className="inputForm" onSubmit={handleSubmit}>
    //       <input placeholder="검색어를 입력하세요" onChange={onChange} value={InputText} />
    //       <button type="submit">검색</button>
    //     </form>
    //     <KakaoMap searchPlace={Place} />
    //     <p>{{ placeName }}</p>
    //   </div>
    //     <Test value={placeName} />
    // </div>

        {/* <form className="inputForm" onSubmit={handleSubmit}>
      <input placeholder="검색어를 입력하세요" onChange={onChange} value={InputText} />
      <button type="submit">검색</button>
    </form> */}