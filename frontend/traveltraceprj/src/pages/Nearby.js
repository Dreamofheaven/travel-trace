import React, {useState, useEffect} from 'react';
import axios from 'axios';
// import "../styles/All.css";
import { Card, Col, Row, Button, ButtonGroup, Container, Badge } from "react-bootstrap";
import { Bookmark, Heart, PinMap ,Search } from 'react-bootstrap-icons'
import defaultImg from '../assets/default_img.png';
import { Link } from 'react-router-dom';

function Nearby() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchArticles = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/articles/nearby/`);
        setArticles(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load nearby articles.');
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <h1>Nearby Articles</h1>
      {/* 검색어창 */}
      <div className="d-flex justify-content-center align-items-center my-5">
        <Search className="me-2" />
        <input className='search_bar' type="text" placeholder="검색어를 입력하세요" value={searchTerm} onChange={handleSearch} />
      </div>
      <div className="button-wrapper my-5">
        <Button className='btn_custom'><PinMap className='pin_icon' />내 주변</Button>
        <Button className='btn_custom'>전체</Button>
        <Button className='btn_custom'>힐링</Button>
        <Button className='btn_custom'>관광</Button>
        <Button className='btn_custom'>맛집/카페</Button>
        <Button className='btn_custom'>액티비티</Button>
      </div>

      {/* 본 게시물 */}
      <div className='my-5 mx-5'>
        <Row xs={1} sm={2} md={3} lg={4}className="g-4">
          {articles.map(article => (
            <Col key={article.id}>
              <Card className='card_container'>
                {article.images.length > 0 ? <Card.Img variant="top" src={article.images[0].image} style={{ objectFit: 'cover', height: '250px', padding: '3%' }} />
                :
                <Card.Img variant="top" src={defaultImg} style={{ objectFit: 'contain', height: '250px', padding: '3%' }} />
                }
                <Card.Body className='p-2'>
                  <Card.Title>
                    <Link className='all_link' to={`/detail/${article.id}/`}>{article.title}</Link>
                  </Card.Title>
                  <Card.Text>
                    <div className='d-flex justify-content-between align-items-center'>
                      <div>장소</div>
                      <div className='d-flex'>
                        <div className='me-2'><Heart fill='grey' /></div>
                        <div><Bookmark fill='grey'/></div>
                      </div>
                    </div>
                  </Card.Text>
                  <Card.Footer className="text-muted py-1">
                    <small>{article.username}</small>
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

export default Nearby;
