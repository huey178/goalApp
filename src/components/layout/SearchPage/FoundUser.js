import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProfile } from "../../../actions/Profile";
import { getGoalListStats, getGoalStats } from "../../../actions/Goal";

import PropTypes from "prop-types";

const FoundUser = ({
  user: { avatar, name, _id },
  getProfile,
  getGoalStats,
  getGoalListStats,
}) => {
  return (
    <div className='user-card'>
      <div className='search-image'>
        <img src={avatar} alt='Found user' />
      </div>
      <div className='search-name'>
        <Link
          to={`/profile/${_id}`}
          onClick={() => {
            getProfile(_id);
            getGoalStats(_id);
            getGoalListStats(_id);
          }}
        >
          <h4>{name}</h4>
        </Link>
      </div>
    </div>
  );
};

FoundUser.propTypes = {
  getProfile: PropTypes.func.isRequired,
  getGoalListStats: PropTypes.func.isRequired,
  getGoalStats: PropTypes.func.isRequired,
};

export default connect(null, { getProfile, getGoalStats, getGoalListStats })(
  FoundUser
);
