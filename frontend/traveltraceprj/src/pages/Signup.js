import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: username,
      password: password,
      email: email,
    };
    const response = await axios.post('http://localhost:8000/accounts/signup/', newUser);
    console.log(response.data);
    // 회원가입이 완료되면 로그인 페이지로 이동
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label>
        Email:
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button type="submit">회원가입</button>
    </form>
  );
}

export default Signup;
