// import React, { useState } from 'react';
// import { useCookies } from 'react-cookie';
// import { Container } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// function Login() {

//   const [Email, setEmail] = useState("");
//   const [Password, setPassword] = useState("");
//   const [jwt, setJWT, removeJWT] = useCookies(['jwt']);

//     const handleLogin = async (event) => {
//       event.preventDefault();

//       try {
//         const response = await axios.post('http://127.0.0.1:8000/accounts/', { Email, Password }, {
//           headers: {
//             Authorization: `Bearer ${jwt.jwt}`
//           }
//         });
//         console.log('Successfully logged in!');
//         return response.data;
//       } catch (error) {
//         console.error(error.response.data);
//         console.log(Email, Password, jwt);
//         // 에러 처리
//       }
//     };

//     const handleFormChange = (event) => {
//       const { name, value } = event.target;
//       if (name === "email") {
//         setEmail(value);
//       } else if (name === "password") {
//         setPassword(value);
//       }
//     };
  
//     const handleLogout = () => {
//       removeJWT('jwt', { path: '/' });
//     };

//   return(
//     <Container>
//       <button onClick={handleLogout}>로그아웃</button>
//       <form onSubmit={handleLogin}>
//         <label>
//           이메일:
//           <input type="text" value={Email} onChange={(e) => setEmail(e.target.value)} />
//         </label>
//         <label>
//           비밀번호:
//           <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} />
//         </label>
//         <button type="submit">로그인</button>
//       </form>
//       <p>
//         <Link to="/signup">회원가입</Link>
//       </p>
//     </Container>
//   );
// }

// export default Login;


////////////////////
import React, { useState } from 'react';
import axios from 'axios';
import "../styles/Login.css";
import { Container, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/login_logo.png'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/', { email, password });
      const { access, refresh, user } = response.data.token;
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      // 로그인 후 사용자 정보를 보여줄 페이지로 이동
      window.location.href = '/';
    } catch (error) {
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <Container>
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <div>
          <img
            src={logo}
            height="350"
            className="login_logo"
            alt="Travel-trace logo"
          />
        </div>
        <div>
          <form onSubmit={handleLogin}>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control size="lg" type="email" id="email" placeholder="이메일" value={email} onChange={handleEmailChange}/>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control size="lg" type="password" id="password" placeholder="비밀번호" value={password} onChange={handlePasswordChange} />
              </Form.Group>
              <div className="d-grid gap-2 mb-5">
                <Button className='login2_btn' size="lg" type="submit">로그인</Button>
              <Form.Group>
                <Form.Text className="text-muted d-flex justify-content-center">
                  <Link className='signup_link' to="/Signup.js">
                    회원가입
                  </Link>
                </Form.Text>
              </Form.Group>
              </div>
            </Form>
          </form>
        </div>
      </div>
    </Container>
  );
}

export default Login;
