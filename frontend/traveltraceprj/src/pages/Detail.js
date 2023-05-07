import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Form, Carousel, Dropdown } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';
import "../styles/Detail.css";
import BookmarkBtn from '../components/BookmarkBtn';
import LikeBtn from '../components/LikeBtn';
import DeleteBtn from '../components/DeleteBtn';
import UpdateBtn from '../components/UpdateBtn';
import CommentLikeBtn from '../components/CommentLikeBtn';


function CustomDropdownToggle(props) {
  return (
    <button
      type="button"
      className="btn btn-link border-0 p-0"
      onClick={props.onClick}
      style={{ outline: 'none', color: 'black' }}
    >
      <ThreeDotsVertical size={24} />
    </button>
  );
}

function Detail() {
  const { id } = useParams();
  
  const [article, setArticle] = useState(null);
  const [cookies] = useCookies(['access', 'refresh']);
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [newContent, setNewContent] = useState([]);


  const handleUpdate = (updatedArticle) => {
    setArticle(updatedArticle);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleCommentChange = (event) => {
    setContent(event.target.value);
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/articles/${id}/comments/`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCommentCount = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/articles/${id}/`);
      setCommentCount(response.data.comment_count);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setContent('');
    console.log(content); // content 값 확인
    axios.post(
      `http://127.0.0.1:8000/articles/${id}/comments/create/`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${cookies.access}`,
        },
      }
    )

    .then((response) => {
      setComments((prevComments) => [
        ...prevComments,
        { content, user: article.username, created_at: new Date().toISOString() }
      ]);
      setCommentCount(commentCount + 1);
      setContent('');
    })
    .catch((error) => {
      console.log(error);
    });
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/articles/${id}/`);
        setArticle(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchCommentCount = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/articles/${id}/`);
        setCommentCount(response.data.comment_count);
      } catch (error) {
        console.error(error);
      }
    };
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/articles/${id}/comments/`);
        setComments(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchArticle();
    fetchCommentCount();
    fetchComments();
  }, [id]);

  if (!article) {
    return <div>Loading...</div>;
    }
    return (
      <Container className="mt-5">
      <div className="border p-4">
        <div className='d-flex justify-content-between align-items-center'>
          <h3>{article.title}</h3>
          <p className="me-3">{article.placename} / {article.location.split(' ')[0]} {article.location.split(' ')[1]}</p>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className='d-flex flex-column'> 
            <Link to={`/profile/${article.user}`}>
              <div>{article.username}</div>
            </Link> 
              {/* <div>{article.username}</div> */}
            <div className='date'>{formatDate(article.created_at)}</div>
          </div>
          <div>
            <div className='d-flex align-items-center'>
              <div className='me-2'><LikeBtn articleId={article.id} /></div>
              <div><BookmarkBtn articleId={article.id}/></div>
              <div>
              <Dropdown>
                <Dropdown.Toggle as={CustomDropdownToggle} />
                <Dropdown.Menu>
                  <UpdateBtn article={article} onUpdate={handleUpdate} />
                  <DeleteBtn articlePk={article.id} />
                </Dropdown.Menu>
              </Dropdown>
              </div>
            </div>
          </div>
        </div>
      </div>
        <hr className="my-4" />
        <Form>
          {/* Form 내용을 추가하거나 수정할 수 있습니다 */}
        </Form>
        <div className="mt-4">
          <Container style={{ maxWidth: '600px' }}>
            <Carousel>
              {article.images.map((image, index) => (
                <Carousel.Item className='img_container2' key={index}>
                  <img
                    className="img2"
                    src={`http://127.0.0.1:8000${image.image}`}
                    alt={`이미지 ${index + 1}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Container>
        </div>
          <div>
            <p className='m-3'>
              {article.content.split(' ').map((word, index) => {
                if (word.startsWith('#')) {
                  const tag = word.substring(1);
                  return (
                    <React.Fragment key={index}>
                      {' '}
                      <a href={`/tags/${tag}`}>{`#${tag}`}</a>{' '}
                    </React.Fragment>
                  );
                } else {
                  return <span key={index}>{word} </span>;
                }
              })}
            </p>
          </div>
        <div className="mt-4">
          <hr className="my-4" />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <p>댓글 개수: {commentCount}</p>
          </div>
          <Form onSubmit={handleSubmit}>
            <div className="mb-3 d-flex justify-content-center align-items-center" style={{ marginBottom: '10px' }}>
              <input 
                type="text" 
                className="form-control flex-grow-1" 
                placeholder="댓글 입력" 
                style={{ height: 'auto', minWidth: '70%', maxWidth: '90%' }}
                onChange={handleCommentChange}
              />
              <button type="submit" className="btn btn-success ms-2" style={{ backgroundColor: '#A0D468', border: 'none' }}>등록</button>
            </div>

          </Form>
        <div>
          {newContent.map((item, index) => (
            <div key={index} className="d-flex mb-3">
            <p className="ms-3">{item.user}</p>
            <p className="ms-auto me-3">{formatDate(new Date().toISOString())}</p>
            <p>{item.content}</p>
            <button className="btn btn-success ms-auto" style={{ backgroundColor: '#A0D468', border: 'none' }}>댓글 좋아요</button>
            </div>
          ))}
        </div>
        <div>
        <hr className="my-4" />
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="d-flex mb-3">
              <p className="ms-3">{comment.user}</p>
              <p className="ms-auto me-3">{formatDate(comment.created_at)}</p>
            </div>
            <div className="d-flex align-items-center">
              <p className='me-auto'>{comment.content}</p>
              <CommentLikeBtn commentId={comment.id} />{comment.likeCount}
            </div>
            <hr className="my-4" />
          </div>
        ))}
      </div>
      </div>
    </Container>
  );
}

export default Detail;

// 규상님의 이미지 클래스네임
// d-block mx-auto w-100