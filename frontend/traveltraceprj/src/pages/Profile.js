import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Profile.css";

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
    <Container className="text-align-center">
      <Stack gap={2} className='Profile col-md-5 mx-auto text-center'>
        <div className='profile_image'>
          <h3 className=''>프로필 사진</h3>
        </div>
        <span className=''>
          닉네임(이메일)
        </span>
        <>
          <p>정보 뿌려주기</p>
          <h2>{user.username}</h2>
          <p>Email: {user.email}</p>

          {/* <p>{userProfile.profile_img}</p> */}
          {/* <p>{userProfile.followings}</p> */}
          {/* <p>{userProfile.followers}</p> */}
          {/* <p>{userProfile.info}</p> */}
          {/* <p>{userProfile.articles}</p> */}
          {/* <p>{userProfile.bookmarks}</p> */}
        </>
        <span className='07'>
          팔로워 0 / 팔로잉 7
        </span>
        <span className='MBTI'>
          “MBTI 극 P인 맛집 탐방가 ”
        </span>
        <div>
          <Button className='' href="/personal_all">
            게시글
          </Button>
          <Button className='' href="/bookmark">
            북마크
          </Button>
        </div>
        <Link to="/edit_account">
          계정 관리
        </Link>
      </Stack>
    </Container>
  );
}

export default Profile;






