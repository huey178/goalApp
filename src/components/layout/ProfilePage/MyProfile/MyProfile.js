import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Loader from "../../Loader";
import GoalStats from "./GoalStats";
import About from "./About";
import Groups from "./Groups";
import { editProfile } from "../../../../actions/Profile";
import { getGoalListStats, getGoalStats } from "../../../../actions/Goal";
import { getMyProfile } from "../../../../actions/Profile";

const MyProfile = ({
  biography,
  profile,
  loading,
  editProfile,
  getGoalListStats,
  getGoalStats,
  auth,
  getMyProfile,
}) => {
  useEffect(() => {
    if (auth) {
      getMyProfile();
      getGoalListStats(auth);
      getGoalStats(auth);
    }
  }, [getGoalListStats, getGoalStats, auth, getMyProfile]);
  const [AboutState, AboutToggle] = useState(true);
  const [GoalStatsState, GoalStatToggle] = useState(false);
  const [GroupsState, GroupsToggle] = useState(false);
  const [EditState, EditToggle] = useState(false);

  const [BioStatus, SetBioStatus] = useState({
    bio: "",
  });

  const { bio } = BioStatus;

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
  const toggleEdit = () => {
    !EditState ? EditToggle(true) : EditToggle(false);
  };

  const onChange = (e) => {
    SetBioStatus({
      ...BioStatus,
      [e.target.name]: e.target.value,
    });
  };

  const submitProfileChange = (e) => {
    e.preventDefault();
    editProfile(BioStatus);
    SetBioStatus({
      bio: "",
    });
    toggleEdit();
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
                <p>
                  {biography}{" "}
                  <i className='fas fa-edit' onClick={() => toggleEdit()} />
                </p>
                {EditState && (
                  <div className='stepText'>
                    <textarea
                      name='bio'
                      value={bio}
                      rows='3'
                      cols='30'
                      placeholder='Tell us about yourself'
                      onChange={(e) => onChange(e)}
                    />
                    <br />
                    <button onClick={(e) => submitProfileChange(e)}>
                      add bio
                    </button>
                  </div>
                )}
              </div>
              <div className='profile-options'>
                <div onClick={() => toggleAbout()}>About</div>
                <div onClick={() => toggleGoalStats()}>Goal Stats</div>
                <div onClick={() => toggleGroups()}>Groups</div>
              </div>
            </div>
          </div>

          <div className='profile-options-container'>
            {AboutState && <About />}
            {GoalStatsState && <GoalStats />}
            {GroupsState && <Groups />}
          </div>
        </div>
      )}
    </div>
  );
};

MyProfile.prototype = {
  editProfile: PropTypes.func.isRequired,
  getGoalListStats: PropTypes.func.isRequired,
  auth: PropTypes.string.isRequired,
  getGoalStats: PropTypes.func.isRequired,
  getMyProfile: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  biography: state.profile.profile.bio,
  loading: state.profile.loading,
  auth: state.auth.user._id,
});

export default connect(mapStateToProps, {
  editProfile,
  getGoalListStats,
  getGoalStats,
  getMyProfile,
})(MyProfile);
