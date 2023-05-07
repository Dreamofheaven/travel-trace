import React, {useState, useEffect} from 'react';
import axios from 'axios';
import "../styles/Bookmark.css";
import { Link } from 'react-router-dom';
import { Card, Col, Row, Container } from "react-bootstrap";
import { Trash3 } from "react-bootstrap-icons"
import defaultImg from '../assets/default_img.png';

function Bookmark() {
  const [bookmarks, setBookmarks] = useState([])
  
  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    console.log(token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = async () => {
      const result = await axios.get('http://127.0.0.1:8000/accounts/bookmark/my_bookmark/');
      setBookmarks(result.data);
      console.log(result.data)
    };

    fetchData();
  }, []);

  const deleteBookmark = async (articlePk) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/accounts/bookmark/${articlePk}/`);
      setBookmarks((prevBookmarks) => prevBookmarks.filter((bookmark) => bookmark.article.id !== articlePk));
    } catch (error) {
      console.error(error);
    }
  };

  return(
    <Container>
      <div className="mt-5 d-flex flex-column align-items-center">
        <h2 className='mb-1'>😎이번엔 어디로 가지~?🧡</h2>
        <h3 className='mb-5'>🚗🚅<span className='text1'>북마크</span>🛫🚢</h3>
      </div>
      <div className='my-5 mx-5'>
          <Row xs={1} sm={2} md={3} lg={4}className="g-4">
            {bookmarks.map(bookmark => (
              <Col key={bookmark.id}>
                <Card className='card_container2'>
                  {bookmark.article.images.length > 0 ? <Card.Img variant="top" src={bookmark.image} style={{ objectFit: 'cover', height: '250px', padding: '3%' }} />
                  :
                  <Card.Img variant="top" src={defaultImg} style={{ objectFit: 'contain', height: '250px', padding: '3%' }} />
                  }
                  <Card.Body className='p-2'>
                    <Card.Title>
                      <Link className='bookmark_link' to="/detail">{bookmark.article.title}</Link>
                    </Card.Title>
                    <Card.Text>
                    </Card.Text>
                    <Card.Footer className="text-muted py-1 d-flex justify-content-between">
                      <div><small>{bookmark.article.username}</small></div>
                      <div><small className='fw-bold'>장소</small></div>
                  </Card.Footer>
                  <div className='delete_btn' onClick={() => deleteBookmark(bookmark.article.id)}><Trash3 fill='rgb(252, 65, 65)' type='button' /></div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
    </Container>
  );
}

export default Bookmark;