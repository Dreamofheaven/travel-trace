import React, { useState } from 'react';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import UpdatePost from '../components/UpdatePost';

function UpdateBtn(props) {
  const [showModal, setShowModal] = useState(false);
  const handleUpdate = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Dropdown.Item onClick={handleUpdate}>
        수정
      </Dropdown.Item>
      <Modal size='lg' show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>게시글 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdatePost article={props.article} onUpdate={props.onUpdate} onCloseModal={handleCloseModal} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateBtn;