import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addGoal } from "../../../actions/Goal";
import Goal from "./Goal";

const EditGoal = ({ addGoal, goal: { _id, title, goals }, auth }) => {
  const [GoalState, setGoal] = useState("");

  const addGoalToList = () => {
    addGoal(GoalState, _id, auth);
    setGoal("");
  };

  const onChange = (e) => {
    setGoal(e.target.value);
  };

  return (
    <div className='createGoal'>
      {" "}
      <h2>
        <u>{title}</u>
      </h2>
      <textarea
        name='goal'
        value={GoalState}
        rows='3'
        cols='30'
        onChange={(e) => onChange(e)}
        placeholder='Create Goal'
      />
      <br />
      <button name='createButton' onClick={() => addGoalToList()}>
        Create
      </button>
      <h2>
        <u>Goals</u>
      </h2>
      <div className='goal'>
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <Goal goalList_id={_id} goalItem={goal} key={goal._id} />
          ))
        ) : (
          <h3>You have no goals :\</h3>
        )}
      </div>
    </div>
  );
};

EditGoal.propTypes = {
  goal: PropTypes.object.isRequired,
  addGoal: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  goal: state.goal.goalList,
  auth: state.auth.user,
});

export default connect(mapStateToProps, {
  addGoal,
})(EditGoal);
