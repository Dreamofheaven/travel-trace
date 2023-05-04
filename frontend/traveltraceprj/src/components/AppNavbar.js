import React from 'react'
import { Navbar, Nav, Form, Button, Stack } from "react-bootstrap";
import { Link } from 'react-router-dom';
import "../styles/AppNavbar.css";

function AppNavbar() {
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
            <Button variant="outline-success" href="/login">로그인</Button>
          </div>
        </Navbar.Collapse>
      </Stack>
    </Navbar>
  );
}

export default AppNavbar;
