import axios from 'axios';
import { Dropdown } from 'react-bootstrap';


function DeleteBtn(props) {
  const handleClick = () => {
    const confirmDelete = window.confirm('게시글을 삭제하시겠습니까?');
    if (confirmDelete) {
      axios.delete(`http://localhost:8000/articles/${props.articlePk}/`)
        .then(() => {
          console.log('게시글 삭제 완료');
          // 게시글 목록 페이지로 이동
          window.location.href = 'http://localhost:3000/all';
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Dropdown.Item onClick={handleClick}>
      삭제
    </Dropdown.Item>
  );
}

export default DeleteBtn;