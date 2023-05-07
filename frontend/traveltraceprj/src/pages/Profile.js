import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Container, Stack, Image} from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import "../styles/Profile.css";
import defaultProfilePic from '../assets/profile_logo.png';
import { BookmarkHeartFill, PostcardHeartFill, PersonPlus, PlusSquareDotted } from 'react-bootstrap-icons';

function Profile() {
  const [user, setUser] = useState({});
  const { user_pk } = useParams(); // URL 파라미터에서 user_pk 가져오기
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)access\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const fetchData = axios.get(`http://127.0.0.1:8000/accounts/profile/${user_pk}`);
    const fetchFollow = axios.get(`http://127.0.0.1:8000/accounts/follow/${user_pk}/`);
    
    Promise.all([fetchData, fetchFollow])
    .then(([data, follow]) => {
      setUser(data.data);
      setIsFollowed(follow.data.is_followed);
      console.log(data.data);
      console.log(follow.data);
    })
    .catch(error => {
      console.error(error);
    });
    }, []);

    const handleFollow = () => {
      // 팔로우 API 호출
      axios.post(`http://127.0.0.1:8000/accounts/follow/${user_pk}/`)
        .then(response => setIsFollowed(response.data.is_followed))
        .catch(error => console.log(error));
    };

    const handleUnfollow = () => {
      // 언팔로우 API 호출
      axios.delete(`http://127.0.0.1:8000/accounts/follow/${user_pk}/`)
        .then(response => setIsFollowed(response.data.is_followed))
        .catch(error => console.log(error));
    };


  ///////////
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
            <>
              <h2>{user.username}</h2>
              <p>{user.email}</p>
              <p>{user.id}</p>
            </>
          </span>
          <span className='ps-3 align-self-center'>
            <PersonPlus className='follow_icon'onClick={isFollowed ? handleUnfollow : handleFollow} />
            <span>{isFollowed ? '언팔로우' : '팔로우'}</span>
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



