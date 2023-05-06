// // 게시글 작성 페이지
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
// import DatePicker from '../components/DatePicker';
import { Button, Container, InputGroup, Form, Row, Col, FormControl, Modal } from 'react-bootstrap';
import ImageFuntion from '../components/Images';
import Rating from '../components/Rating';
import "../styles/Post.css";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import KakaoMap  from '../kakao/KakaoMap';
// import Map from '../components/Map';

function Post() {
 
  // 서버로 보내기 위한 변수들
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(''); // 선택된 값을 상태로 유지
  const [location, setLocation] = useState('');
  const [placeName, setPlaceName] = useState('');
 
  //쿠키
  const [cookies] = useCookies(['access', 'refresh']);

  // 이미지관련
  // const [images, setImages] = useState([]);
  const [images, setShowImages] = useState([]);
  // const [file,setFile] = useState()

  //레이팅
  const [rating, setCountStar] = useState(0); 

  // 장소
  const [lgShow, setLgShow] = useState(false);
  const [InputText, setInputText] = useState('')
  const [Place, setPlace] = useState('')
  // const [placeName, setPlaceName] = useState('')
  // const [address, setAddress] = useState('');

  const handleSaveLocation = () => {
    setLocation(location)
    setPlaceName(placeName)
    setLgShow(false) // 모달 닫기
  }

  const onChange = (e) => {
    setInputText(e.target.value)
  }

  const handleSubmit2 = (e) => {
    e.preventDefault()
    setPlace(InputText)
    setInputText('')
  }


  // const handleImagesChange = (event) => {

  //   const formData = new FormData();

  //   if(event.target.files){
  //     const uploadFile = event.target.files[0]
  //     formData.append('file',uploadFile)
  //     setFile(uploadFile)
  //     console.log(uploadFile)
  //     console.log('===useState===')
  //     console.log(file)
  //   }

  // }

  // 카테고리 처리
  const handleCategoryChange = (event) => {
    setCategory(event.target.value); // 선택된 값으로 상태 업데이트
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // const formData = new FormData();
    // formData.append('file',file)

    // HTTP POST 요청 보내기
    axios.post('http://127.0.0.1:8000/articles/', {title, content, category, rating, images}, {
      headers: {
        Authorization: `Bearer ${cookies.access}`, // access 토큰을 요청 헤더에 포함
      },
    })
      .then(response => {
        console.log(response);
        // 게시글 작성 성공 후 처리할 작업
      })
      .catch(error => {
        console.log(error);
        console.log(title, content, rating, "실패!", category, images)
        // 게시글 작성 실패 후 처리할 작업
      });
  }

  return (
    <Container className='d-flex justify-content-center'>
      <Card className='card my-5'>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col xs={9}>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">제목</InputGroup.Text>
                  <Form.Control
                    placeholder="나만의 여행 꿀팁을 뽐내기 위한 제목을 작성해주세요!"
                    aria-label="title"
                    aria-describedby="basic-addon1"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="basic-addon1">카테고리</InputGroup.Text>
                  <Form.Select aria-label='Default select example' onChange={handleCategoryChange}>
                    <option>---</option>
                    <option value="1">힐링</option>
                    <option value="2">관광</option>
                    <option value="3">맛집/카페</option>
                    <option value="4">액티비티</option>
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
            <div>{/* <ImageFuntion onChange={handleImagesChange} /> */}
              <ImageFuntion images={images} setShowImages={setShowImages} />
              {/* <input type="file" id="profile-upload" accept="image/*" onChange={handleImagesChange} /> */}</div>
            <div className='d-flex justify-content-between mb-3'>
              <div><p className='location_text'>{placeName}</p></div>
              <div><Button className='location_btn' variant="primary" onClick={() => setLgShow(true)}>장소 선택</Button></div>
            </div>
            <>
              <Modal
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
                >
                <Modal.Header closeButton>
                  <Modal.Title id="example-modal-sizes-title-lg">
                    해당 장소를 마킹하고 등록해주세요
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className='d-flex flex-column align-items-center'>
                  <>
                    <form className="inputForm mb-3" onSubmit={handleSubmit2}>
                      <input className='search_bar2' placeholder="검색어를 입력하세요" onChange={onChange} value={InputText} />
                      <button className='button2' type="submit">검색</button>
                    </form>
                    <KakaoMap searchPlace={Place}  setLocation={setLocation} setPlaceName={setPlaceName}/>
                    <p className='mt-3'>장소: { placeName }</p>
                    <p>주소: { location }</p>
                  </>
                </Modal.Body>
                <Modal.Footer>
                  <Button className='button3' variant="secondary" onClick={() => setLgShow(false)}>
                    닫기
                  </Button>
                  <Button className='button2' onClick={handleSaveLocation}>
                    저장하기
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
            {/* <Map lat={lat} lon={lon} /> */}
            <InputGroup>
              <InputGroup.Text>내용</InputGroup.Text>
                <Form.Control 
                  as="textarea" 
                  row={5} 
                  aria-label="With textarea" 
                  style={{ height: '300px' }} 
                  placeholder='여행의 추억, 고스란히 담아볼까요?!'
                  value={content}
                  onChange={e => setContent(e.target.value)} 
                />
              </InputGroup>
              {/* <Rating setScore={setScore} />  */}
              <Rating rating={rating} setCountStar={setCountStar} />
              {/* Rating 컴포넌트 추가 */}
            <Button className='mt-2 create_btn' type="submit">후기 생성</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Post;




// 지도관련 코드들

// import KakaoMap  from '../kakao/KakaoMap';
// import Modal from 'react-modal';
// Modal.setAppElement('#root'); // 모달창이 렌더링될 DOM 요소를 설정합니다.
 // 모달관련
  // const [modalIsOpen, setModalIsOpen] = useState(false); // 모달창 띄우기 위한 상태
  // const [selectedPlace, setSelectedPlace] = useState(null); // 선택한 장소 정보를 저장하기 위한 상태

  // const openModal = () => {
  //   setModalIsOpen(true);
  // };

  // const closeModal = (e) => {
  //   e.setModalIsOpen(false);
  // };

  // const handleSelectPlace = (place) => {
  //   setSelectedPlace(place);
  //   closeModal();
  // };

            {/* <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
              <KakaoMap onSelectPlace={handleSelectPlace} />
            </Modal> */}
            {/* <>
              <form className="inputForm" onSubmit={MaphandleSubmit}>
                <input placeholder="검색어를 입력하세요" onChange={onChange} value={InputText} />
                <button type="submit">검색</button>
              </form>
              <KakaoMap searchPlace={Place} />
              {/* <p>{{ placeName }}</p> 
              </> */} 
