import React, { useEffect } from "react";
import PropTypes from "prop-types";
import GoalBar from "./GoalBar";
import GoalList from "./GoalList";
import EditGoal from "./EditGoal";
import { connect } from "react-redux";
import { getMyGoalLists } from "../../../actions/Goal";
import Loader from "../Loader";

const Home = ({
  getMyGoalLists,
  auth,
  goal: { goalLists, goalList, loading },
  name,
}) => {
  useEffect(() => {
    if (auth) {
      getMyGoalLists(auth);
    }
  }, [getMyGoalLists, auth]);

  return (
    <div className='home'>
      <div className='welcome-div'>
        <h1 id='welcome'>Welcome {name} </h1>
      </div>
      <div className='goal-bar-div'>
        <GoalBar />
      </div>
      <div className='goal-wrapper'>
        <div className='goal-list-div'>
          <h1>
            <u>Goal Categories</u>
          </h1>

          {loading === true ? (
            <Loader />
          ) : goalLists.length > 0 ? (
            goalLists.map((goalListItem, index) => (
              <GoalList key={goalListItem._id} goalList={goalListItem} />
            ))
          ) : (
            <h4>No Goal Categories :(</h4>
          )}
        </div>
        <div className='goal-div'>{goalList.length !== 0 && <EditGoal />}</div>
      </div>
    </div>
  );
};

Home.propTypes = {
  getMyGoalLists: PropTypes.func.isRequired,
  goal: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  goal: state.goal,
  auth: state.auth.user,
  name: state.auth.name,
});

export default connect(mapStateToProps, { getMyGoalLists })(Home);
