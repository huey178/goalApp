import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addStep } from "../../../actions/Goal";

const StepItem = ({ goal, goalList, addStep }) => {
  const [Step, setStep] = useState("");
  const onChange = (e) => {
    setStep(e.target.value);
  };
  const onClick = () => {
    addStep(goalList._id, goal, Step);
    setStep("");
  };
  const [stepStatus, setStepStatus] = useState(false);

  const stepView = () => {
    stepStatus === false ? setStepStatus(true) : setStepStatus(false);
  };

  return (
    <div className='stepItem'>
      {stepStatus === true ? (
        <i
          className='fas fa-minus-circle stepToggle'
          onClick={() => stepView()}
        ></i>
      ) : (
        <i
          className='fas fa-plus-circle stepToggle'
          onClick={() => stepView()}
        ></i>
      )}

      {stepStatus === true && (
        <div className='stepText'>
          <textarea
            name='step'
            value={Step}
            rows='3'
            cols='30'
            onChange={(e) => onChange(e)}
            placeholder='Add Step'
          />
          <br />
          <button onClick={() => onClick()}>Add Step</button>
        </div>
      )}
    </div>
  );
};

StepItem.propTypes = {
  addStep: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  goalList: state.goal.goalList,
});

export default connect(mapStateToProps, { addStep })(StepItem);
