import React from "react";
import PropTypes from "prop-types";
import ProgressBar from "react-bootstrap/ProgressBar";
import { connect } from "react-redux";

const GoalStats = ({
  stats: { numberOfGoalLists, numberOfCompletedGoals, GoalListPercentage },
  goalStats,
}) => {
  return (
    <div className='goal-stat-container'>
      <h3>Goal Category Completion </h3>
      {GoalListPercentage > 50 ? (
        <div className='goal-list-progress'>
          <ProgressBar variant='success' now={`${GoalListPercentage}`} />{" "}
          <p>{numberOfCompletedGoals + " / " + numberOfGoalLists}</p>
        </div>
      ) : (
        <div className='goal-list-progress'>
          <ProgressBar variant='warning' now={`${GoalListPercentage}`} />
          <p>{numberOfCompletedGoals + " / " + numberOfGoalLists}</p>
        </div>
      )}
      <h3>
        <u>Goal Categories</u>
      </h3>
      <br />

      {goalStats.length > 0 ? (
        goalStats.map((goal, index) => (
          <div className='goal-list-progress' key={index}>
            <h4>
              <u>{goal.goalListName}</u>
            </h4>

            {goal.totalGoalNumber > 0 ? (
              <div>
                <ProgressBar variant='success' now={goal.ratio} />
                <p>{goal.completedGoalNumber + " / " + goal.totalGoalNumber}</p>
              </div>
            ) : (
              <p>No goals yet</p>
            )}
          </div>
        ))
      ) : (
        <p>No goals have been added</p>
      )}
    </div>
  );
};

GoalStats.propTypes = {
  stats: PropTypes.object.isRequired,
  goalStats: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  stats: state.goal.stats,
  goalStats: state.goal.goalStats,
});

export default connect(mapStateToProps, {})(GoalStats);
