import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../actions/Auth";
import { clearGoals } from "../../actions/Goal";
import { clearProfile } from "../../actions/Profile";

const Navbar = ({ logout, isAuthenticated, clearGoals, clearProfile }) => {
  const logOut = () => {
    clearGoals();
    logout();
  };

  const authenticatedLinks = (
    <div>
      <ul>
        <li>
          <Link to='/home'>Home</Link>
        </li>
        <li>
          <Link to={`/profile`}>Profile</Link>
        </li>
        <li>
          <Link to='/search' onClick={() => clearProfile()}>
            Find Users
          </Link>
        </li>
        <li>
          <Link to='' onClick={() => logOut()}>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to=''>Features</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className='navbar'>
      <h1>
        <Link to='/' className='nav-logo'>
          Goal on Goals (Beta)
        </Link>
      </h1>

      {isAuthenticated === true ? authenticatedLinks : guestLinks}
    </nav>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  clearGoals: PropTypes.func.isRequired,
  clearProfile: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { logout, clearGoals, clearProfile })(
  Navbar
);
