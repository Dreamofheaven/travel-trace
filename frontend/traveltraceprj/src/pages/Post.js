// // 게시글 작성 페이지
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
// import DatePicker from '../components/DatePicker';
import { Button, Container, InputGroup, Form, Row, Col, FormControl } from 'react-bootstrap';
import ImageFuntion from '../components/Images';
import Rating from '../components/Rating';
import "../styles/Post.css";
import axios from 'axios';


function Post() {
 
  // 서버로 보내기 위한 변수들
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 이미지관련
  const [images, setImages] = useState([]);
  const [score, setScore] = useState(0); // score state 추가

  const token = '';

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    // HTTP POST 요청 보내기
    axios.post('http://127.0.0.1:8000/articles/', {title, content, images}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
      .then(response => {
        console.log(response);
        // 게시글 작성 성공 후 처리할 작업
      })
      .catch(error => {
        console.log(error);
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
                  <Form.Select aria-label='Default select example'>
                    <option>---</option>
                    <option value="1">힐링</option>
                    <option value="2">관광</option>
                    <option value="3">맛집/카페</option>
                    <option value="4">액티비티</option>
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row> 
            <ImageFuntion onChange={handleImagesChange} />
            <button>장소 선택</button>
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
              <Rating setScore={setScore} /> {/* Rating 컴포넌트 추가 */}
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
