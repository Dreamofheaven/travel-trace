import React from 'react';
import { Button, Container, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../styles/Profile.css";

function Profile() {
  return (
    <Container className="text-align-center">
      <Stack gap={2} className='Profile col-md-5 mx-auto text-center'>
        <div className='profile_image'>
          <h3 className=''>프로필 사진</h3>
        </div>
        <span className=''>
          닉네임(이메일)
        </span>
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