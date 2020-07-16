import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Loader from "../../Loader";
import About from "./About";
import GoalStats from "./GoalStats";
import Groups from "./Groups";

const Profile = ({ profile, loading }) => {
  const [AboutState, AboutToggle] = useState(true);
  const [GoalStatsState, GoalStatToggle] = useState(false);
  const [GroupsState, GroupsToggle] = useState(false);

  const toggleAbout = () => {
    if (!AboutState) {
      AboutToggle(true);
      GoalStatToggle(false);
      GroupsToggle(false);
    }
  };

  const toggleGoalStats = () => {
    if (!GoalStatsState) {
      GoalStatToggle(true);
      AboutToggle(false);
      GroupsToggle(false);
    }
  };

  const toggleGroups = () => {
    if (!GroupsState) {
      GroupsToggle(true);
      GoalStatToggle(false);
      AboutToggle(false);
    }
  };

  return (
    <div className='profile-container'>
      {loading === true ? (
        <Loader />
      ) : (
        <div className='profile-top'>
          <div className='profile-top'>
            <div className='photo-wrapper'>
              <img
                src={profile.user.avatar}
                className='profile-picture'
                alt='profile'
              />

              <div className='name-div'>
                <h1>{profile.user.name}</h1>
                <br />
                <p>{profile.bio} </p>
              </div>
              <div className='profile-options'>
                <div onClick={() => toggleAbout()}>About</div>
                <div onClick={() => toggleGoalStats()}>Goal Stats</div>
                <div onClick={() => toggleGroups()}>Groups</div>
              </div>
            </div>
          </div>

          <div className='profile-options-container'>
            {AboutState && <About profile={profile} />}
            {GoalStatsState && <GoalStats />}
            {GroupsState && <Groups />}
          </div>
        </div>
      )}
    </div>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  loading: state.profile.profile.loading,
});
export default connect(mapStateToProps, {})(Profile);
