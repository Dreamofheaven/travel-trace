import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Login() {

  const [Email, setEmail]  =useState("")
  const [Password, setPassword]  =useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault(); //페이지가 리프레쉬되는 것을 막는 기능

    console.log('Email', Email)
    console.log('Password', Password)
    // 로그인 값을 서버에 보내기
  //   let body ={
  //     email: Email,
  //     password: Password
  //   }
  //   Axios.post('/api/user/login', body)
  }

  return(
    <Container>
      <h1>로그인 페이지 입니다.</h1>
      <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
        <label>이메일</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <label>비밀번호</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <button type="submit">
          로그인
        </button>
      </form>

      <p>
        <Link to="/signup">회원가입</Link>
      </p>
    </Container>
  );
}

export default Login;