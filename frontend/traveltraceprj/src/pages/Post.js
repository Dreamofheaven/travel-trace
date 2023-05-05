// // 게시글 작성 페이지
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
// import DatePicker from '../components/DatePicker';
import { Button, Container, InputGroup, Form, Row, Col } from 'react-bootstrap';
import ImageFuntion from '../components/Images';
import Rating from '../components/Rating';
import "../styles/Post.css";

function Post() {
  const [images, setImages] = useState([]);
  const [score, setScore] = useState(0); // score state 추가

  const handleImagesChange = (newImages) => {
    setImages(newImages);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle form submission with images and score data
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
            <div>장소</div>
            <InputGroup>
              <InputGroup.Text>내용</InputGroup.Text>
                <Form.Control as="textarea" row={5} aria-label="With textarea" style={{ height: '300px' }} placeholder='여행의 추억, 고스란히 담아볼까요?!' />
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
// function Post() {
  
//   const [selectedDate, setSelectedDate] = useState(new Date());
  
//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   return (
//     <Container>
//       <Card className='h-100'>
//         <Card.Body>
//           <p>제목</p>
//           {/* <DatePicker /> */}
//           <div>
//             <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
//           </div>
//           <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
//             <Form.Label>내용</Form.Label>
//             <Form.Control as="textarea" rows={3} />
//           </Form.Group>
//           <p>경로</p>
//           <Button type="submit">입력</Button>
//         </Card.Body>
//       </Card>
//     </Container>
    
//   );
// }