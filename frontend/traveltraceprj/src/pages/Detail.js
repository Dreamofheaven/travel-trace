import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Button, Form, Carousel } from 'react-bootstrap';
import { Bookmark, Heart } from 'react-bootstrap-icons';
import { useCookies } from 'react-cookie';

function Detail() {
  const [article, setArticle] = useState(null);

  const { id } = useParams(); // 디테일이랑 all 연결
  const [cookies] = useCookies(['access', 'refresh']);//쿠키
  
  const [commentCount, setCommentCount] = useState(0); // 댓글 개수 상태 변수
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState([]);//댓글 입력해서 보내기 변수
  const [newContent, setNewContent] = useState([]);//댓글 입력해서 보내기 변수

  // 작성일(년월일)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  const handleCommentChange = (event) => {
    setContent(event.target.value); // 선택된 값으로 상태 업데이트
    console.log('댓글이 입력되었다.')
    console.log(content) 
  }
  const handleSubmit = (event) => {
    console.log("입력을 눌렀다.")
    event.preventDefault();
    setContent('');

    // HTTP POST 요청 보내기
    axios.post(`http://127.0.0.1:8000/articles/${id}/comments/`, {content},{
      headers: {
        Authorization: `Bearer ${cookies.access}`, // access 토큰을 요청 헤더에 포함
      },
    })
    .then(response => {
      console.log(response);
      setNewContent([...newContent, content]);
      setContent('');
      console.log(newContent)
    })
    .catch(error => {
      console.log(error);
    });
    setContent('');
    // // HTTP GET 요청 보내기
    // axios.get(`http://127.0.0.1:8000/articles/${id}/`, {
    //   headers: {
    //     Authorization: `Bearer ${cookies.access}`, // access 토큰을 요청 헤더에 포함
    //   },
    // })
    // .then(response => {
    //   console.log(response);
    // })
    // .catch(error => {
    //   console.log(error);
    // });
  }

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/articles/${id}/`); // 디테일과 all 연결을 위한 url파라미터
        console.log("이거의 id파람스: " + id)
        setArticle(response.data);
        console.log('아티클:'+ {id});
      } catch (error) {
        console.error(error);
        console.log('아티클:'+ {id});
      }
    };
    const fetchCommentCount = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/articles/${id}/`);
        setCommentCount(response.data.comment_count);
        console.log(comments)
        console.log('댓글카운트:'+ {id});
      } catch (error) {
        console.error(error);
        console.log('댓글카운트:'+ {id});
      }
    };
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/articles/${id}/comments`);
        setComments(response.data);
        console.log('댓글:'+ {id});
      } catch (error) {
        console.error(error);
        console.log('댓글:'+ {id});
      }
    };

    fetchArticle();
    fetchCommentCount();
    fetchComments();
  }, []);

  if (!article) {
    return <div>Loading...</div>; // 로딩 상태 표시
  }

  return (
    <Container className="mt-5">
      <div className="border p-4">
        <div className='d-flex justify-content-between align-items-center'>
          <h3>{article.title}</h3>
          <p className="me-3">{article.location}</p>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            
          {article.username} {formatDate(article.created_at)}
            
          </div>
          <div>
            <div className='d-flex'>
              <div className='me-2'><Heart fill='grey' /></div>
              <div><Bookmark fill='grey'/></div>
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
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100 mx-auto"
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
          <hr className="my-4" />
        </Form>
        <div>
          <p>=============댓글보기테스트===========</p>
          {newContent.map((item, index) => (
            <p key={index}>{item}</p>
          ))}
        </div>
        
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="d-flex mb-3">
              <p className="ms-3">{comment.user}</p>
              <p className="ms-auto me-3">{formatDate(comment.created_at)}</p>
            </div>
            <div className="d-flex align-items-center">
              <p>{comment.content}</p>
              <button className="btn btn-success ms-auto" style={{ backgroundColor: '#A0D468', border: 'none' }}>댓글 좋아요</button>
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