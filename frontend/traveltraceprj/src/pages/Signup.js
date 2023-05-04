import { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from "axios";
// import "../styles/SignUp.css";


function SignUp() {
  const [cookies, setCookie] = useCookies(['jwt']);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();

    console.log(username, email, password)
    
    try {
      const response = await axios.post('http://127.0.0.1:8000/accounts/signup/', {username, email, password});
      console.log(response);
      setCookie('jwt', response.data.token.access, { path: '/' });
      // console.log('jwt');
      console.log('Successfully signed up and logged in!');
      // 리다이렉트 등 다른 작업 수행
    } catch (error) {
      console.error(error.response.data);
      // 에러 처리
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
    <form onSubmit={handleSignUp}>
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
    </form>
  );
}

export default SignUp;
