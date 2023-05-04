import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Stack, Image} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../styles/Profile.css";
import defaultProfilePic from '../assets/profile_logo.png';
import { BookmarkHeartFill, PostcardHeartFill, PersonPlus, PlusSquareDotted } from 'react-bootstrap-icons'

const BASE_URL = 'http://127.0.0.1:8000';

function Profile() {
  const [user, setUser] = useState({});
  console.log(localStorage.getItem('access'));

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/accounts/profile/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`
      }
    })
    .then(response => {
      setUser(response.data);
    })
    .catch(error => {
      console.log(error);
    });
    }, []);

  return (
    <Container className="my-5 text-align-center">
      <Stack gap={4} className='Profile col-md-5 mx-auto text-center'>
        <div className='position-relative'>
          <Image
            src={ defaultProfilePic }
            alt='defaultProfilePic'
            width='70%'
            roundedCircle
            className='profile_image'
          />
          <div className="position-absolute bottom-0 end-0">
            <PlusSquareDotted className='img_plus_icon'/>
          </div>
        </div>

        <div className='d-flex justify-content-center'>
          <span className='user_identification'>
            닉네임(이메일)
            <>
              <p>정보 뿌려주기</p>
              <h2>{user.username}</h2>
              <p>Email: {user.email}</p>
            </>
          </span>
          <span className='ps-3 align-self-center'>
            <PersonPlus className='follow_icon'/>
          </span>
        </div>
        <span className='user_follow'>
          팔로워 0 / 팔로잉 7
        </span>
        <span className='user_info'>
          “MBTI 극 P인 맛집 탐방가 ”
        </span>
        <div>
          <Link className='me-3' to="/personal_all">
            <PostcardHeartFill className='post_icon' /> 
          </Link>
          <Link className='ms-3' to="/bookmark">
            <BookmarkHeartFill className='bookmark_icon' />
          </Link>
        </div>
        <Link className='account_management mt-5' to="/edit_account">
          계정 관리
        </Link>
      </Stack>
    </Container>
  );
}

export default Profile;



