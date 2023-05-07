import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import "../styles/Login.css";
import { Container, Button, Form } from 'react-bootstrap';
import logo from '../assets/login_logo.png'

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookies] = useCookies(['access', 'refresh']);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/', {email, password});
      const { access, refresh } = response.data;

      if (response && response.data) {
        setCookies("access", response.data.token.access, { path: "/" });
        setCookies("refresh", response.data.token.refresh, { path: "/" });
        console.log('Successfully logged in!');
        localStorage.setItem('user_id', response.data.user.id);
        console.log(email, password);
        console.log(response.data);
        console.log(response.data.user.id);
        window.location.href = '/';
      }

      } catch (error) {
        console.error(error.response.data);
        console.log(email, password);
        // 에러 처리
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  
  return (
    <Container>
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <div>
          <img
            src={logo}
            height="200"
            className="login_logo my-5"
            alt="Travel-trace logo"
          />
        </div>
        <div>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control size="lg" type="email" name="email" placeholder="이메일" value={email} onChange={handleFormChange}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control size="lg" type="password" name="password" placeholder="비밀번호" value={password} onChange={handleFormChange} />
            </Form.Group>
            <div className="d-grid gap-2 mb-5">
              <Button className='login2_btn' size="lg" type="submit">로그인</Button>
            <Form.Group>
              <Form.Text className="text-muted d-flex justify-content-center">
                <Link className='signup_link' to="/Signup">
                  회원가입
                </Link>
              </Form.Text>
            </Form.Group>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
}

export default Login;
