import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, HeartFill } from 'react-bootstrap-icons';

const LikeBtn = ({ articleId }) => {
  const [isLiked, setIsLiked] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/articles/${articleId}/likes/`)
      .then((res) => {
        setIsLiked(res.data.is_liked);
      })
      .catch((err) => {
        setIsLiked(false);
      });
  }, [articleId]);

  const handleLikedToggle = () => {
    if (isLiked) {
      axios
        .delete(`http://localhost:8000/articles/${articleId}/likes/`)
        .then(() => {
          setIsLiked(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(`http://localhost:8000/articles/${articleId}/likes/`)
        .then(() => {
          setIsLiked(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (isLiked === null) {
    return <div>Loading...</div>;
  }

  return (
    <div onClick={handleLikedToggle}>
      {isLiked ? (
        <HeartFill color="red" size={24} />
      ) : (
        <Heart color="gray" size={24} />
      )}
    </div>
  );
};

export default LikeBtn;