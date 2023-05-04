import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import { Navbar, Nav, Form, Button, Stack } from "react-bootstrap";
import { Link } from 'react-router-dom';

// 이거는 제가 로그인 로그아웃 구분할라고 잠시 작성 중인페이지라서 정식 페이지 아니예요!! 

function LogedNav() {
  
  const [cookies, setCookie, removeCookie] = useCookies(['access', 'refresh']);
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookies.access);


  const handleLogout = (event) => {
    event.preventDefault();
    removeCookie('access');
    removeCookie('refresh');
    setIsLoggedIn(false);
  }

  return (
    <Navbar bg="light" expand="lg">
      <Stack direction="horizontal" gap={3}>
        {/* <Navbar.Brand><Link to="/">여행자국</Link></Navbar.Brand> */}
        <Navbar.Brand href="/">여행자국</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='ms-auto'>
          <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                />
              <Button variant="outline-success">Search</Button>
          </Form>
          <div className="ms-auto">
            <span><Link to="/profile">User님</Link></span>
            {/* <Button variant="outline-success" href="/login">로그아웃</Button> */}
            <Button onClick={handleLogout}>로그아웃</Button>
            {isLoggedIn ? (
              <Button onClick={handleLogout}>Logout</Button>
            ) : (
              <Button variant="outline-success" href="/login">Login</Button>
            )}
          </div>
        </Navbar.Collapse>
      </Stack>
    </Navbar>
  );
}

export default LogedNav;
