import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createGoalList } from "../../../actions/Goal";

const GoalBar = ({ createGoalList }) => {
  const [title, setGoalData] = useState("");

  const onClick = (e) => {
    e.preventDefault();
    createGoalList(title);
    setGoalData("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      createGoalList(title);
      setGoalData("");
    }
  };
  return (
    <Fragment>
      <div className='goal-bar'>
        <input
          placeholder='Create a new goal category'
          name='title'
          value={title}
          onChange={(e) => setGoalData(e.target.value)}
          onKeyDown={(e) => onKeyDown(e)}
        />
        <div className='arrow-div'>
          {" "}
          <i className='fas fa-arrow-right fa-2x' onClick={(e) => onClick(e)} />
        </div>
      </div>
    </Fragment>
  );
};

GoalBar.propTypes = {
  createGoalList: PropTypes.func.isRequired,
};

export default connect(null, { createGoalList })(GoalBar);
