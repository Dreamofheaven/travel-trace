import React, {useState} from 'react';
// import SearchMap from '../components/SearchMap';
import KakaoMap  from '../kakao/KakaoMap';

// function Test(placeName) {
function Test() {
  const [InputText, setInputText] = useState('')
  const [Place, setPlace] = useState('')
  const [placeName, setPlaceName] = useState('')
  const [location, setLocation] = useState('');

  const onChange = (e) => {
    setInputText(e.target.value)
  }

  const handleSubmit2 = (e) => {
    e.preventDefault()
    setPlace(InputText)
    setInputText('')
  }

  return (
    <>
      <form className="inputForm" onSubmit={handleSubmit2}>
        <input placeholder="검색어를 입력하세요" onChange={onChange} value={InputText} />
        <button type="submit">검색</button>
      </form>
      <KakaoMap searchPlace={Place}  setLocation={setLocation} setPlaceName={setPlaceName}/>
      <p>{ placeName }</p>
      <h2>{ location }</h2>
    </>
  )
}

export default Test;