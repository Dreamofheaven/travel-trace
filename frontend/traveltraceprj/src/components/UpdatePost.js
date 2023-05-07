import React, { useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import { Button, Container, InputGroup, Form, Row, Col, FormControl, Modal } from 'react-bootstrap';
import ImageFuntion from '../components/Images';
import Rating from '../components/Rating';
import "../styles/Post.css";
import { Link, useNavigate} from 'react-router-dom';
import KakaoMap  from '../kakao/KakaoMap';

function UpdatePost(props) {
  const [title, setTitle] = useState(props.article.title);
  const [content, setContent] = useState(props.article.content);
  const [category, setCategory] = useState(props.article.category);
  const [rating, setRating] = useState(props.article.rating);
  const [location, setLocation] = useState(props.article.location);
  const [placename, setPlacename] = useState(props.article.placename);
  const [images, setShowImages] = useState(props.article.images);
  const [lgShow, setLgShow] = useState(false);
  const [Place, setPlace] = useState('') 
  const handleSubmit2 = (e) => {
    e.preventDefault()
    setPlace(InputText)
    setInputText('')
  }

  const handleSaveLocation = () => {
    setLocation(location)
    setPlacename(placename)
    setLgShow(false) // 모달 닫기
  }
  const onChange = (e) => {
    setInputText(e.target.value)
  }
  const [InputText, setInputText] = useState('')
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handlePlacenameChange = (event) => {
    setPlacename(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);
    formData.append('rating', rating);
    formData.append('location', location);
    formData.append('placename', placename);

    axios.put(`http://localhost:8000/articles/${props.article.id}/`, formData)
      .then(response => {
        props.onUpdate(response.data);
      })
      .catch(error => {
        console.log(error);
      });
      
  };

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
                    onChange={handleTitleChange}
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
                    <form className="inputForm mb-3" onSubmit={handleSubmit2}>
                      <input className='search_bar2' placeholder="검색어를 입력하세요" onChange={onChange} value={InputText} />
                      <button className='button2' type="submit">검색</button>
                    </form>
                    <KakaoMap searchPlace={Place}  setLocation={setLocation} setPlaceName={setPlacename}/>
                    <p className='mt-3' onChange={handlePlacenameChange}>장소: { placename }</p>
                    <p onChange={handleLocationChange}>주소: { location }</p>
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
                  onChange={handleContentChange} 
                  />
              </InputGroup>
              {/* <Rating setScore={setScore} />  */}
              <Rating rating={rating} onChange={handleRatingChange} />
              {/* Rating 컴포넌트 추가 */}
              <div className='d-flex justify-content-end'>
                <Button className='mt-2 me-3 create_btn' type="submit">임시 저장</Button>
                <Link type="button" className="btn mt-2 link3_btn btn-primary" to='/all'>후기 수정</Link>
              </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  ) 
}

export default UpdatePost;