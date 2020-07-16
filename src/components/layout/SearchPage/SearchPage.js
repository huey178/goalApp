import React, { useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { searchUsers } from "../../../actions/Profile";
import FoundUser from "./FoundUser";

const SearchPage = ({ searchUsers, users, searched }) => {
  const [Search, SetSearch] = useState("");

  const onChange = (e) => {
    SetSearch(e.target.value);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      searchUsers(Search);
      SetSearch("");
    }
  };

  const onArrow = () => {
    searchUsers(Search);
    SetSearch("");
  };

  const searchedOrNoResultChecker = () => {
    if (searched === false) {
      return "";
    } else if (searched === true && users.length < 1) {
      return <p>No users were found</p>;
    }
  };

  return (
    <div className='search-container'>
      <div>
        <div className='search-header'>
          <h1>User Search</h1>

          <div className='search-div'>
            <input
              value={Search}
              onChange={(e) => onChange(e)}
              onKeyDown={(e) => {
                onKeyDown(e);
              }}
              placeholder='Find Users'
            />
            <i className='fas fa-arrow-right' onClick={() => onArrow()} />
          </div>
        </div>

        <div className='user-container'>
          {users.length > 0
            ? users.map((user) => <FoundUser user={user} key={user._id} />)
            : searchedOrNoResultChecker()}
        </div>
      </div>
    </div>
  );
};

SearchPage.propTypes = {
  searchUsers: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  searched: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.profile.foundUsers.users,
  searched: state.profile.foundUsers.searched,
});

export default connect(mapStateToProps, { searchUsers })(SearchPage);
