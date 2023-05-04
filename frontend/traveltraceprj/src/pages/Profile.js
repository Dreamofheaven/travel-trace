import React from 'react';
import { Button, Container, Stack, Image} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import "../styles/Profile.css";
import defaultProfilePic from '../assets/profile_logo.png';
import { BookmarkHeartFill, PostcardHeartFill, PersonPlus, PlusSquareDotted } from 'react-bootstrap-icons'

function Profile() {
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


// function Profile() {
//   return (
//     <Container className="text-align-center">
//       div
//       <Stack gap={2} className='Profile col-md-5 mx-auto text-center'>
//         <div className='profile_image'>
//           <h3 className=''>프로필 사진</h3>
//         </div>
//         <span className=''>
//           닉네임(이메일)
//         </span>
//         <span className='07'>
//           팔로워 0 / 팔로잉 7
//         </span>
//         <span className='MBTI'>
//           “MBTI 극 P인 맛집 탐방가 ”
//         </span>
//         <div>
//           <Button className='' href="/personal_all">
//             게시글
//           </Button>
//           <Button className='' href="/bookmark">
//             북마크
//           </Button>
//         </div>
//         <Link to="/edit_account">
//           계정 관리
//         </Link>
//       </Stack>
//     </Container>
//   );
// }

// export default Profile;