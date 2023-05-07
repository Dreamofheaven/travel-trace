// // 게시글 작성 페이지
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { Button, Container, InputGroup, Form, Row, Col, Modal } from 'react-bootstrap';
import ImageFuntion from '../components/Images';
import Rating from '../components/Rating';
import "../styles/Post.css";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import KakaoMap  from '../kakao/KakaoMap';
import { Link, useNavigate} from 'react-router-dom';

function Post() {
 
  // 서버로 보내기 위한 변수들
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(''); // 선택된 값을 상태로 유지
  const [location, setLocation] = useState('');
  const [placename, setPlaceName] = useState('');
 
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
    setPlaceName(placename)
    setLgShow(false) // 모달 닫기
  }

  const onChange = (e) => {
    setInputText(e.target.value)
  }

  const Submit = (e) => {
    e.preventDefault()
    setPlace(InputText)
    setInputText('')
  }

  // 카테고리 처리
  const handleCategoryChange = (event) => {
    setCategory(event.target.value); // 선택된 값으로 상태 업데이트
  }


  async function createArticle(title, content, category, rating, images, location, placename) {
    const formData = new FormData();
  
    // 이미지 추가
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      formData.append('images', imageUrl);
    }
  
    // 이미지 업로드 함수
    const uploadImages = async () => {
      const fileBlobs = [];
  
      // 이미지 URL에서 Blob 객체 가져오기
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        fileBlobs.push(blob);
      }
  
      // Blob 객체를 FormData에 추가
      for (let i = 0; i < fileBlobs.length; i++) {
        const blob = fileBlobs[i];
        formData.append('images', blob, `image-${i}.jpg`);
      }
  
      // FormData를 서버에 전송하여 이미지 업로드
      const responseArticle = await axios.post('http://127.0.0.1:8000/articles/upload_image/', formData, {
        headers: {
          Authorization: `Bearer ${cookies.access}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      // 이미지 업로드 결과에서 파일 URL 가져오기
      const fileUrls = responseArticle.data.fileUrls;
  
      // 파일 URL을 Blob으로 변환하여 FormData에 추가
      for (let i = 0; i < fileUrls.length; i++) {
        const response = await fetch(fileUrls[i]);
        const blob = await response.blob();
        formData.append('images', blob, `image-${i}.jpg`);
      }
    };
  
    try {
      // 이미지 업로드
      await uploadImages();
  
      // 게시글 데이터 추가
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('rating', rating);
      formData.append('location', location);
      formData.append('placename', placename)
  
      // 게시글 생성
      const responseCreate = await axios.post('http://127.0.0.1:8000/articles/', formData, {
        headers: {
          Authorization: `Bearer ${cookies.access}`,
        },
      });
  
      console.log(responseCreate.data);
      // window.location.href = '/all';
      // 게시글 작성 성공 후 처리할 작업
    } catch (error) {
      console.log(error);
      console.log(title, content, rating, '실패!', category, images, location);
      // 게시글 작성 실패 후 처리할 작업
      // window.location.href = '/all';
    }
  }
  return (
    <Container className='d-flex justify-content-center'>
      <Card className='card my-5'>
        <Card.Body>
          <Form onSubmit={(e) => {
            e.preventDefault()
            createArticle(title, content, category, rating, images, location, placename);
          }}>
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
                    <option value="힐링">힐링</option>
                    <option value="관광">관광</option>
                    <option value="맛집,카페">맛집/카페</option>
                    <option value="액티비티">액티비티</option>
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
            <div>{/* <ImageFuntion onChange={handleImagesChange} /> */}
              <ImageFuntion images={images} setShowImages={setShowImages} />
              {/* <input type="file" id="profile-upload" accept="image/*" onChange={handleImagesChange} /> */}</div>
            <div className='d-flex justify-content-between mb-3'>
              <div><p className='location_text'>{placename}</p></div>
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
                <Modal.Body className='d-flex flex-column align-items-center modal_body'>
                  <>
                    <form className="inputForm mb-3" onSubmit={Submit}>
                      <input className='search_bar2' placeholder="검색어를 입력하세요" onChange={onChange} value={InputText} />
                      <button className='button2' type="submit">검색</button>
                    </form>
                    <KakaoMap searchPlace={Place}  setLocation={setLocation} setPlaceName={setPlaceName}/>
                    <p className='mt-3'>장소: { placename }</p>
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
              <div className='d-flex justify-content-end'>
              <Button className='mt-2 me-3 create_btn' type="submit">임시 저장</Button>
              <Link type="button" className="btn mt-2 link3_btn btn-primary" to='/all'>후기 생성</Link>
              </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Post;

// const handleSubmit = (event) => {
//   event.preventDefault();

//   // const formData = new FormData();
//   // formData.append('file',file)
  
//   // HTTP POST 요청 보내기
//   axios.post('http://127.0.0.1:8000/articles/', {title, content, category, rating, images, location}, {
//     headers: {
//       Authorization: `Bearer ${cookies.access}`, // access 토큰을 요청 헤더에 포함
//     },
//   })
//   .then(response => {
//     console.log(response);
//     // 게시글 작성 성공 후 처리할 작업
//   })
//   .catch(error => {
//     console.log(error);
//     console.log(title, content, rating, "실패!", category, images)
//     // 게시글 작성 실패 후 처리할 작업
//   });
// }

// const formData = new FormData();
// for (let i = 0; i < images.length; i++) {
  //   const file = images[i];
  //   const absoluteUrl = URL.createObjectURL(file);
  //   formData.append('images', file, absoluteUrl);
  // }
  
  // 이미지관련 은정님 코드
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
