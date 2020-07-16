import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  addGoalListComment,
  deleteGoalList,
  getSpecificGoalList,
  likeGoalList,
  unlikeGoalList,
  goalListComplete,
  goalListIncomplete,
  makePrivate,
  makePublic,
} from "../../../actions/Goal";
import Comment from "./Comment";

const GoalList = ({
  goalList: { title, comments, likes, goals, _id, user, complete, isPrivate },
  deleteGoalList,
  addGoalListComment,
  getSpecificGoalList,
  likeGoalList,
  unlikeGoalList,
  goalListComplete,
  goalListIncomplete,
  makePrivate,
  makePublic,
}) => {
  const [commentActive, setCommentState] = useState(false);

  const [comment, setComment] = useState("");

  const commentView = () => {
    commentActive === true ? setCommentState(false) : setCommentState(true);
  };

  const [likeActive, setLikeState] = useState(false);

  const likeView = () => {
    likeActive === true ? setLikeState(false) : setLikeState(true);
  };

  const onChange = (e) => {
    setComment(e.target.value);
  };

  const onClick = (e) => {
    e.preventDefault();
    addGoalListComment(_id, comment, user);
    setComment("");
  };

  const likeGoalListToggle = (goalList_id, user) => {
    likeActive === false
      ? likeGoalList(goalList_id, user)
      : unlikeGoalList(goalList_id, user);
    likeView();
  };

  return (
    <Fragment>
      <div className='goal-list-item' onClick={(e) => getSpecificGoalList(_id)}>
        <div className='goal-list-title'>
          <h4>
            <u>{title}</u>
          </h4>
        </div>
        <div className='goal-list-goals'>
          {goals.slice(0, 3).map((foundGoal, index) => (
            <div>
              {index + 1}) {""}
              {foundGoal.goal}
            </div>
          ))}
        </div>
        <div className='trash'>
          <i className='fas fa-trash' onClick={(e) => deleteGoalList(_id)}></i>
        </div>
        <div className='goal-list-actions'>
          {complete === false ? (
            <div>
              <i
                className='fas fa-check-square'
                onClick={() => goalListComplete(_id, user)}
                title='Mark goal complete'
              ></i>
            </div>
          ) : (
            <div>
              <i
                className='fas fa-check'
                title='Mark goal as incomplete'
                onClick={() => goalListIncomplete(_id, user)}
              ></i>
            </div>
          )}
          {isPrivate === false ? (
            <div>
              <i
                className='fas fa-unlock'
                title='Click to make goal private'
                onClick={() => makePrivate(_id, user)}
              ></i>
            </div>
          ) : (
            <div>
              <i
                className='fas fa-lock'
                title='Click to make goal public'
                onClick={() => makePublic(_id, user)}
              ></i>
            </div>
          )}

          <div>
            <i
              className='fas fa-comment'
              onClick={commentView}
              title='View Comments'
            ></i>{" "}
            {comments.length}
          </div>
          <div>
            <i
              className='fas fa-medal'
              onClick={(e) => likeGoalListToggle(_id, user)}
              title='Give user a star'
            ></i>{" "}
            {likes.length}
          </div>
        </div>
      </div>
      {commentActive === true ? (
        <div className='goalListComment'>
          <textarea
            name='comment'
            value={comment}
            onChange={(e) => onChange(e)}
            rows='5'
            cols='30'
            placeholder='Write a comment...'
          />
          <button onClick={(e) => onClick(e)}>Post</button>
          <div className='comment-wrapper'>
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                goalList_id={_id}
                user_id={user}
              />
            ))}
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

GoalList.propTypes = {
  deleteGoalList: PropTypes.func.isRequired,
  addGoalListComment: PropTypes.func.isRequired,
  getSpecificGoalList: PropTypes.func.isRequired,
  likeGoalList: PropTypes.func.isRequired,
  unlikeGoalList: PropTypes.func.isRequired,
  goalListComplete: PropTypes.func.isRequired,
  goalListIncomplete: PropTypes.func.isRequired,
  makePublic: PropTypes.func.isRequired,
  makePrivate: PropTypes.func.isRequired,
};

export default connect(null, {
  deleteGoalList,
  addGoalListComment,
  getSpecificGoalList,
  likeGoalList,
  unlikeGoalList,
  goalListComplete,
  goalListIncomplete,
  makePrivate,
  makePublic,
})(GoalList);
