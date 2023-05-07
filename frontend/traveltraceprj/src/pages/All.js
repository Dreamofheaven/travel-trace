import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "../styles/All.css";
import { Card, Col, Row, Button, Container, Form } from "react-bootstrap";
import { PinMap ,Search, Eye } from 'react-bootstrap-icons'
import defaultImg from '../assets/default_img.png';
import { Link } from 'react-router-dom';
import BookmarkBtn from '../components/BookmarkBtn';
import LikeBtn from '../components/LikeBtn';

function All() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [sortBy, setSortBy] = useState("");

  // useEffect(() => {
  //   handleNearbyClick(); // 컴포넌트 마운트 후 handleNearbyClick 함수 실행
  // }, []);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const filteredArticles = articles.filter(article => {
    return article.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const articleByCategory = async (category) => {
    const url = category ? `http://127.0.0.1:8000/articles/${category}/`
    : 
    'http://127.0.0.1:8000/articles/';
    const result = await axios.get(url);
    console.log(result.data)
    setArticles(result.data);
  }

  const handleNearbyClick = async () => {
    try {
      let url = 'http://127.0.0.1:8000/articles/nearby/';
      const result = await axios.get(url);
      const updatedData = result.data.map(article => {
        if (article.image) {
          return {
            ...article,
            image: article.image
          }
        } else {
          return article;
        }
      });
      setArticles(updatedData);
      console.log(updatedData)
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    articleByCategory(category);
  };

  const handleSortChange = (event) => {
    const selectedSortBy = event.target.value;
    setSortBy(selectedSortBy);
  };

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // console.log(token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      const url = selectedCategory ? `http://127.0.0.1:8000/articles/${selectedCategory}/` : 'http://127.0.0.1:8000/articles/';
      const result = await axios.get(url, {
        params: {
          sort: sortBy
        }
      });
      setArticles(result.data);
    };

    fetchData();
  }, [selectedCategory, sortBy]);

  return (
    <Container>
      {/* 검색어창 */}

        <div className="d-flex justify-content-center align-items-center my-5 flex-grow-1">
          <Search className="me-2" />
          <input className='search_bar' type="text" placeholder="검색어를 입력하세요" value={searchTerm} onChange={handleSearch} />
        </div>
    <div className='d-flex align-items-center justify-content-center'>
      <div className="button-wrapper my-3">
        <Button className='btn_custom' onClick={handleNearbyClick}><PinMap className='pin_icon' />내 주변</Button>
        <Button className='btn_custom' onClick={() => handleCategoryClick(undefined)}>전체</Button>
        <Button className='btn_custom' onClick={() => handleCategoryClick('힐링')}>힐링</Button>
        <Button className='btn_custom' onClick={() => handleCategoryClick('관광')}>관광</Button>
        <Button className='btn_custom' onClick={() => handleCategoryClick('맛집,카페')}>맛집/카페</Button>
        <Button className='btn_custom' onClick={() => handleCategoryClick('액티비티')}>액티비티</Button>
      </div>
      <div className='filter_box d-flex justify-content-center'>
          <Form.Select onChange={handleSortChange} size="sm">
            <option value="">정렬</option>
            <option value="newest">최신순</option>
            <option value="likes">좋아요순</option>
            <option value="views">조회순</option>
          </Form.Select>
        </div>
      </div>
      {/* 본 게시물 */}
      <div className='my-5 mx-5'>
        <Row xs={1} sm={2} md={3} lg={4}className="g-4">
          {filteredArticles.map(article => (
            <Col key={article.id}>
              <Card className='card_container'>
                {article.images.length > 0 ? <Card.Img variant="top" src={article.image} style={{ objectFit: 'cover', height: '250px', padding: '3%' }} />
                :
                <Card.Img variant="top" src={defaultImg} style={{ objectFit: 'contain', height: '250px', padding: '3%' }} />
                }
                <Card.Body className='p-2'>
                  <Card.Title>
                    <Link className='all_link' to={`/detail/${article.id}/`}>{article.title}</Link>
                  </Card.Title>
                  <Card.Text>
                    <div className='d-flex justify-content-between align-items-center'>
                      <div>{article.location.split(' ')[0]} {article.location.split(' ')[1]}</div>
                      <div className='d-flex'>
                        <div className='me-2'><LikeBtn articleId={article.id} /></div>
                        <div><BookmarkBtn articleId={article.id}/></div>
                      </div>
                    </div>
                  </Card.Text>
                  <Card.Footer className="text-muted py-1 d-flex justify-content-between align-items-center">
                    <small>{article.username}</small>
                    <small><Eye className='me-2'/>{article.views}</small>   
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

export default All;
