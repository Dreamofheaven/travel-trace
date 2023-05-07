import "../styles/PersonalAll.css";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Container, Badge } from "react-bootstrap";
import defaultImg from '../assets/default_img.png';

function PersonalAll() {
  const [myArticles, setMyArticles] = useState([])

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      const result = await axios.get('http://127.0.0.1:8000/accounts/my_article_list/');
      setMyArticles(result.data);
    };

    fetchData();
  }, []);


  return(
    <Container>
      <div className="mt-5 d-flex flex-column align-items-center">
        <h2 className='mb-1'>😎나의 추억 모음집🧡</h2>
        <h3 className='mb-5'>🚗🚅🛫🚢</h3>
      </div>
      <div className='my-5 mx-5'>
          <Row xs={1} sm={2} md={3} lg={4}className="g-4">
            {myArticles.map(myArticle => (
              <Col key={myArticle.id}>
                <Card className='card_container3'>
                  {myArticle.images.length > 0 ? <Card.Img variant="top" src={myArticle.images[0].image} style={{ objectFit: 'cover', height: '250px', padding: '3%' }} />
                  :
                  <Card.Img variant="top" src={defaultImg} style={{ objectFit: 'contain', height: '250px', padding: '3%' }} />
                  }
                  <Card.Body className='p-2'>
                    <Card.Title>
                      <Link className='my_article_link' to={`/detail/${myArticle.id}/`}>{myArticle.title}</Link>
                    </Card.Title>
                    <Card.Text>
                    </Card.Text>
                    <Card.Footer className="text-muted py-1 d-flex justify-content-between">
                      <div><small>{myArticle.username}</small></div>
                      <div><small className='fw-bold'>장소</small></div>
                  </Card.Footer>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
    </Container>
  );
}


export default PersonalAll;