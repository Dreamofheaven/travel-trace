import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bookmark, BookmarkFill } from 'react-bootstrap-icons';

const BookmarkBtn = ({ articleId }) => {
  const [isBookmarked, setIsBookmarked] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/accounts/bookmark/${articleId}/`)
      .then((res) => {
        setIsBookmarked(res.data.is_bookmarked);
      })
      .catch((err) => {
        setIsBookmarked(false);
      });
  }, [articleId]);

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      axios
        .delete(`http://localhost:8000/accounts/bookmark/${articleId}/`)
        .then(() => {
          setIsBookmarked(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .post(`http://localhost:8000/accounts/bookmark/${articleId}/`)
        .then(() => {
          setIsBookmarked(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  if (isBookmarked === null) {
    return <div>Loading...</div>;
  }

  return (
    <div onClick={handleBookmarkToggle}>
      {isBookmarked ? (
        <BookmarkFill className='bookmark_btn2' color="#A0D468" size={24} />
      ) : (
        <Bookmark color="gray" size={24} />
      )}
    </div>
  );
};

export default BookmarkBtn;