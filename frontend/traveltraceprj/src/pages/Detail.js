import React from 'react';
import { Container, Button, Form, Carousel } from 'react-bootstrap';

function Detail() {
  return (
    <Container className="mt-5">
      <div className="border p-4">
        <div className='d-flex justify-content-between align-items-center'>
          <h3>게시글 제목</h3>
          <p className="me-3">장소</p>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            
            작성자  2023-05-05
            
          </div>
          <div>
            <Button variant="success" className="me-3" style={{ backgroundColor: '#A0D468', border: 'none' }}>좋아요</Button>
            <Button variant="success" className="me-3" style={{ backgroundColor: '#A0D468', border: 'none' }}>북마크</Button>
          </div>
        </div>
        <hr className="my-4" />
        <Form>
          {/* Form 내용을 추가하거나 수정할 수 있습니다 */}
        </Form>
        <div className="mt-4">
          <Container style={{ maxWidth: '400px' }}>
            <Carousel>
                <Carousel.Item>
                  <img
                    className="d-block w-100 mx-auto"
                    src="https://via.placeholder.com/50"
                    alt="이미지 1"
                    />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 mx-auto"
                    src="https://via.placeholder.com/50"
                    alt="이미지 2"
                    />
                </Carousel.Item>
                <Carousel.Item>
                  <img
                    className="d-block w-100 mx-auto"
                    src="https://via.placeholder.com/50"
                    alt="이미지 3"
                    />
                </Carousel.Item>
              </Carousel>
          </Container>
        </div>
        <div>
          <p>
            여행 후기 내용 을 적는 칸 입니다. 
          </p>
        </div>
        <div className="mt-4">
          <hr className="my-4" />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <p>댓글 개수</p>
          </div>
          <div className="mb-3 d-flex justify-content-center align-items-center" style={{ marginBottom: '10px' }}>
            <input type="text" className="form-control flex-grow-1" placeholder="댓글 입력" style={{ height: 'auto', minWidth: '70%', maxWidth: '90%'}} />
            <button className="btn btn-success ms-2" style={{ backgroundColor: '#A0D468', border: 'none' }}>등록</button>
          </div>
          <hr className="my-4" />
          <div className="d-flex mb-3">
            <p className="ms-3">댓글 작성자</p>
            <p className="ms-auto me-3">작성일자</p>
          </div>
          <div className="d-flex align-items-center">
            <p>댓글 내용</p>
            <button className="btn btn-success ms-auto" style={{ backgroundColor: '#A0D468', border: 'none' }}>댓글 좋아요</button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Detail;