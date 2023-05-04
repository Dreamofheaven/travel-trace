// 게시글 작성 페이지
import React, {useState} from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import DatePicker from '../components/DatePicker';
import { Button } from 'react-bootstrap';
import "../styles/Post.css";

function Post() {
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className='container'> 
      <Card className='h-100'>
        <Card.Body>
          <p>제목</p>
          {/* <DatePicker /> */}
          <div>
            <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
          </div>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>내용</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
          <p>경로</p>
          <Button type="submit">입력</Button>
        </Card.Body>
      </Card>
    </div>
    
  );
}

export default Post;