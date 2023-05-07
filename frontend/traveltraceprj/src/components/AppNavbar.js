import React, { useState,useEffect } from 'react'
import { Navbar, Nav, Form, Button, Stack, Container, Badge } from "react-bootstrap";
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/AppNavbar.css'
import logo from '../assets/logo.png'
import { Person } from 'react-bootstrap-icons'
import axios from 'axios';
import { useCookies } from 'react-cookie';
// import NotificationDropdown from '../components/Notification';


function AppNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // useNavigate 훅 사용
  const user_id = localStorage.getItem('user_id');
  // 수정
  const [cookies, setCookie, removeCookie] = useCookies(['access', 'refresh']);
  const [username, setUsername] = useState(''); // 사용자 이름 상태 추가

  //
  // useEffect(() => {
  //   const accessCookie = cookies.access;
  //   const refreshCookie = cookies.refresh;
  
  //   if (accessCookie && refreshCookie) {
  //     setIsLoggedIn(true);
  //   }
  // }, [cookies]);
  useEffect(() => {
    const accessCookie = cookies.access;
    const refreshCookie = cookies.refresh;
  
    if (accessCookie && refreshCookie) {
      setIsLoggedIn(true);
      // 로그인 상태인 경우에만 API 호출
      const fetchUsername = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/accounts/');
          const userData = response.data;
          setUsername(userData.username);
        } catch (error) {
          console.error(error);
        }
      };
  
      // setIsLoggedIn(true);
      fetchUsername();
    }
  }, [cookies]);
  const handleLogin = (e) => {
    e.preventDefault();
    // setIsLoggedIn(true);
    navigate('/login'); // 페이지 이동
  };
  
  
  const handleLogout = () => {
    // setIsLoggedIn(false);

    axios.delete('http://127.0.0.1:8000/accounts/')
    .then(() => {
      removeCookie('access');
      removeCookie('refresh');
      // 로그아웃 후 처리할 작업이 있다면 여기에 추가
      setIsLoggedIn(false);
      console.log('로그아웃 성공')
      navigate('/');
    })
    .catch(error => {
      console.error(error);
    });
  };
  
  return (
    <Navbar bg='light' sticky='top' variant="tabs" defaultactivekey="/home">
      <Container fluid>
        <Nav.Item>
          <Navbar.Brand>
            <Link to="/">
              <img
                src={logo}
                width="140"
                height="80"
                className="navbar_logo"
                alt="Travel-trace logo"
              />
            </Link>
          </Navbar.Brand>
        </Nav.Item>

        <Navbar.Toggle aria-controls="basic-navbar-nav"/>

        <Nav.Item>
          <Link to='/post'>
            <Button variant="outline-secondary" href="/" size="lg" className='create_bar'>
              당신의 여행지를 공유해보세요! <Badge pill bg="success">+</Badge>
            </Button>
          </Link>
        </Nav.Item>
        <Nav.Item>
          <Navbar.Collapse id="basic-navbar-nav">
              <div className='d-flex align-items-center'>
                <div className='pe-3 d-flex align-items-center'>
                  {/* {isLoggedIn ? (
                    <div className='me-2'><NotificationDropdown /></div>
                  ) : null} */}
                  {isLoggedIn ? (
                    <Link className='my_profile' to={`/profile/${user_id}`}>
                      <Person className='person_icon' />
                      {username && `${username}님`}
                    </Link>
                  ) : null}
                  {/* <Link className='my_profile' to={`/profile/${user_id}`}>
                    <Person className='person_icon' />
                    User님
                  </Link> */}
                </div>
                {isLoggedIn ? (
                  <Button className='logout_btn' onClick={handleLogout}>
                    <Person className='person_icon' />
                    로그아웃
                  </Button>
                    ) : (
                  <Button className='login_btn' onClick={handleLogin}>
                    <Person className='person_icon' />
                    로그인
                  </Button>
                  )}
                </div>
          </Navbar.Collapse>
        </Nav.Item>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;

//  <Profile user_id={user_pk2} />

// function AppNavbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [expanded, setExpanded] = useState(false);

//   const handleLogin = (e) => {
//     e.preventDefault();
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//   };

//   const toggleNavbar = () => {
//     setExpanded(!expanded);
//   }

//   return (
//     <Navbar bg='light' sticky='top' fill variant="tabs" defaultActiveKey="/home" expand='md'>
//       <Container fluid>
//         <Nav.Item>
//           <Navbar.Brand>
//             <Link to="/">
//               <img
//                 src={logo}
//                 width="140"
//                 height="80"
//                 className="navbar_logo"
//                 alt="Travel-trace logo"
//               />
//             </Link>
//           </Navbar.Brand>
//         </Nav.Item>

//         <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleNavbar} />

//         <Navbar.Collapse id="basic-navbar-nav" className={expanded ? 'show' : ''}>

//           <Nav.Item>
//             <Button variant="outline-secondary" href="/" size="lg" className='create_bar'>
//               당신의 여행지를 공유해보세요! <Badge pill bg="success">+</Badge>
//             </Button>
//           </Nav.Item>

//           <Nav className="ms-auto">
//             {isLoggedIn ? (
//               <div className='d-flex align-items-center'>
//                 <div className='pe-3 d-flex align-items-center'>
//                   <Link className='my_profile' to="/profile">
//                     <Person className='person_icon' />
//                     User님
//                   </Link>
//                 </div>
//                 <Button className='logout_btn' onClick={handleLogout}>
//                   <Person className='person_icon' />
//                   로그아웃
//                 </Button>
//               </div>
//             ) : (
//               <Button className='login_btn' as={Link} to="/login" onClick={handleLogin}>
//                 <Person className='person_icon' />
//                 로그인
//               </Button>
//             )}
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

// export default AppNavbar;

{/* <로그인 버튼을 누르면 이상한 팝업이 되는 이유>
이러한 동작이 발생하는 이유는 handleLogin 함수에서 isLoggedIn 상태를 true로 설정하는 것 외에 다른 동작이 없기 때문입니다.

즉, handleLogin 함수를 호출하면 isLoggedIn이 true로 설정되므로, 조건부 렌더링에서 로그인 버튼 대신 로그아웃과 마이페이지 버튼이 나타납니다. 그러나 페이지가 다시 렌더링될 때 isLoggedIn 상태가 다시 false로 설정되므로, 다시 로그인 버튼으로 돌아가게 됩니다.

이 문제를 해결하려면 로그인 상태가 지속되도록 isLoggedIn 값을 어딘가에 저장하고, 이 값을 유지해야 합니다. 예를 들어, 브라우저의 로컬 스토리지 또는 쿠키를 사용하여 사용자가 로그인한 것을 추적할 수 있습니다. 이렇게 하면 사용자가 페이지를 새로 고침하거나 나중에 페이지를 방문할 때도 로그인 상태가 유지됩니다. */}