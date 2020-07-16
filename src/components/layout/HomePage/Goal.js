import React, { useState } from "react";
import PropTypes from "prop-types";
import StepItem from "./StepItem";
import { connect } from "react-redux";
import {
  deleteGoal,
  deleteStep,
  goalComplete,
  goalIncomplete,
  makeGoalPublic,
  makeGoalPrivate,
} from "../../../actions/Goal";

const Goal = ({
  goalList_id,
  goalItem: { goal, _id, steps, isPrivate, complete },
  deleteGoal,
  deleteStep,
  goalComplete,
  goalIncomplete,
  auth,
  makeGoalPrivate,
  makeGoalPublic,
}) => {
  const toggleStepEdit = () => {
    Step === false ? editSteps(true) : editSteps(false);
  };
  const [Step, editSteps] = useState(false);

  return (
    <div className='goalContainer'>
      {" "}
      <div className='goalItem-1'>
        <h2 className=''>{goal}</h2>{" "}
      </div>
      <div className='goalItem-6'>
        {complete === false ? (
          <div>
            <i
              className='fas fa-check-square'
              onClick={(e) => goalComplete(goalList_id, _id, auth._id)}
            ></i>
          </div>
        ) : (
          <div>
            {" "}
            <i
              className='fas fa-check'
              onClick={(e) => goalIncomplete(goalList_id, _id, auth._id)}
            ></i>{" "}
          </div>
        )}

        {isPrivate === true ? (
          <div>
            <i
              className='fas fa-lock'
              onClick={(e) => makeGoalPublic(goalList_id, _id, auth._id)}
            ></i>{" "}
          </div>
        ) : (
          <div>
            <i
              className='fas fa-unlock'
              onClick={(e) => makeGoalPrivate(goalList_id, _id, auth._id)}
            ></i>
          </div>
        )}
      </div>
      <div className='trash'>
        <i
          className='fas fa-trash '
          onClick={() => deleteGoal(goalList_id, _id, auth)}
        />
      </div>
      <div className='goalItem-3'>
        <h4 className=''>
          <u>Steps</u>{" "}
          <i className='fas fa-edit' onClick={() => toggleStepEdit()}></i>
        </h4>
      </div>
      <div className='goalItem-4'>
        {steps.length > 0 &&
          steps.map((step, index) => (
            <div className='goalItem-4' key={index}>
              <p>
                - {step.step}{" "}
                {Step && (
                  <i
                    className='fas fa-times'
                    size='10x'
                    onClick={() => deleteStep(goalList_id, _id, step._id)}
                  ></i>
                )}
              </p>
            </div>
          ))}{" "}
      </div>
      <div className='goalItem-5'>
        <StepItem goal={_id} key={goal._id} />
      </div>
    </div>
  );
};

Goal.propTypes = {
  deleteGoal: PropTypes.func.isRequired,
  deleteStep: PropTypes.func.isRequired,
  goalComplete: PropTypes.func.isRequired,
  goalIncomplete: PropTypes.func.isRequired,
  makeGoalPublic: PropTypes.func.isRequired,
  makeGoalPrivate: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth.user,
});

export default connect(mapStateToProps, {
  deleteGoal,
  deleteStep,
  goalComplete,
  goalIncomplete,
  makeGoalPrivate,
  makeGoalPublic,
})(Goal);
