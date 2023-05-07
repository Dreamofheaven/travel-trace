import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from "axios";
import "../styles/SignUp.css";
import { Container, Button, Form } from 'react-bootstrap';
import logo from '../assets/signup_logo.png'

function SignUp() {
  const [cookies, setCookies] = useCookies(['access', 'refresh']);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/signup/', {username, email, password});
      console.log(response.data);
      const { access, refresh } = response.data.token;
      setCookies('access', access, { secure: true, sameSite: 'strict' });
      setCookies('refresh', refresh, { secure: true, sameSite: 'strict' });

      console.log('Successfully signed up and loged in!');
      window.location.href = '/login';
      // 리다이렉트 등 다른 작업 수행
    } catch (error) {
      console.error(error.response.data);
      alert('회원가입을 실패했습니다.');
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "email") {
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
            className="my-5"
            alt="Travel-trace logo"
          />
        </div>
        <div>
          <Form onSubmit={handleSignUp}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control size="lg" name="username" type="text" placeholder="닉네임" value={username} onChange={handleFormChange}/>
              </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control size="lg" type="email" name="email" placeholder="이메일" value={email} onChange={handleFormChange}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control size="lg" type="password" name="password"  placeholder="비밀번호" value={password} onChange={handleFormChange} />
            </Form.Group>
            <div className="d-grid gap-2 mb-5">
              <Button className='signup2_btn' size="lg" type="submit">회원가입</Button>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  );
}

export default SignUp;

{/* <form onSubmit={handleSignUp}>
<label>
  Username:
  <input type="text" name="username" value={username} onChange={handleFormChange} />
</label>
<label>
  Email:
  <input type="email" name="email" value={email} onChange={handleFormChange} />
</label>
<label>
  Password:
  <input type="password" name="password" value={password} onChange={handleFormChange} />
</label>
<button type="submit">가입</button>
</form> */}