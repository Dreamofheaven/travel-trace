import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

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
        setCookies("access_token", response.data.token.access, { path: "/" });
        setCookies("refresh_token", response.data.token.refresh, { path: "/" });
        console.log('Successfully logged in!');
        console.log(email, password);
        console.log(response.data);
        console.log(response.data.user.id);
        // window.location.href = '/profile';
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
  
  return(
    <Container>
      {/* <button onClick={handleLogout}>로그아웃</button> */}
      <form onSubmit={handleLogin}>
        <label>
          이메일:
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          비밀번호:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit">로그인</button>
      </form>
      <p>
        <Link to="/signup">회원가입</Link>
      </p>
    </Container>
  );
}

export default Login;
