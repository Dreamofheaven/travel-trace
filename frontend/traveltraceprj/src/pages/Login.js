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
    <div>
      <h2>로그인 페이지</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
