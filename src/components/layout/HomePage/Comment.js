import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  removeGoalListComment,
  addLikeToComment,
  deleteLikeOnComment,
} from "../../../actions/Goal";
import { connect } from "react-redux";

const Comment = ({
  goalList_id,
  comment: { avatar, text, likes, name, _id, date },
  removeGoalListComment,
  addLikeToComment,
  deleteLikeOnComment,
  user_id,
}) => {
  const [LikeComment, ToggleLike] = useState(false);
  const removeComment = () => {
    removeGoalListComment(goalList_id, _id, user_id);
  };
  const likeToggle = () => {
    LikeComment === false ? ToggleLike(true) : ToggleLike(false);
  };

  const like = (goalList_id, _id, user_id) => {
    likeToggle();
    LikeComment === false
      ? addLikeToComment(goalList_id, _id, user_id)
      : deleteLikeOnComment(goalList_id, _id, user_id);
  };
  return (
    <div className='comment-container'>
      <img src={avatar} className='comment-img' alt='profile' />
      <h4>{name}</h4>

      <div className='trash-div'>
        <i className='fas fa-trash' onClick={(e) => removeComment()} />
      </div>
      <div className='commentTextDiv'>
        <p>
          {text}
          <br />
          <small>{date}</small>
        </p>
      </div>
      <div className='likeCommentDiv'>
        <i
          className='fas fa-medal'
          onClick={() => like(goalList_id, _id, user_id)}
        ></i>
        {likes.length}
      </div>
    </div>
  );
};

Comment.propTypes = {
  removeGoalListComment: PropTypes.func.isRequired,
  addLikeToComment: PropTypes.func.isRequired,
  deleteLikeOnComment: PropTypes.func.isRequired,
};

export default connect(null, {
  removeGoalListComment,
  addLikeToComment,
  deleteLikeOnComment,
})(Comment);
