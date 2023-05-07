import React, { useState } from 'react';
import { HandThumbsUp, HandThumbsUpFill } from 'react-bootstrap-icons';

function CommentLikeBtn({ commentId }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const handleLike = () => {
    if (liked) {
      // Perform unlike logic
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      // Perform like logic
      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  return (
    <div>
      <button
        className="btn btn-success ms-auto"
        style={{ backgroundColor: 'transparent', border: 'none' }}
        onClick={handleLike}
      >
        {liked ? (
          <HandThumbsUpFill size={20} style={{ color: '#A0D468' }} />
        ) : (
          <HandThumbsUp size={20} style={{ color: '#A0D468' }} />
        )}
      </button>
      <span className="ms-2">{likeCount}</span>
    </div>
  );
}
//

export default CommentLikeBtn;