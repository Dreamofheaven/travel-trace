import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Login() {
  return(
    <Container>
      <h1>로그인 페이지 입니다.</h1>
      <p>
        <Link to="/signup">회원가입</Link>
      </p>
    </Container>
  );
}

export default Login;