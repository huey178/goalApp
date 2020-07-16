import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const Landing = ({ auth: { isAuthenticated } }) => {
  return (
    <Fragment>
      {isAuthenticated && <Redirect to='/home' />}
      <section className='landing'>
        <div className='dark-overlay'>
          <div className='landing-inner'>
            <h1 className='x-large'>Goal on Goals</h1>
            <p className='lead'>
              Create, track, and share your goals with other achievers!
            </p>
            <div className='landing-buttons'>
              <div className='sign-up'>
                <Link to='/register'>
                  <button>Sign up</button>
                </Link>
              </div>
              <div>
                <Link to='/login' className='button'>
                  <button>Login</button>
                </Link>
              </div>
            </div>
            <p className='quote'>
              "The journey of a thousand miles begins with one step" - Lao Tzu
            </p>
          </div>
        </div>
      </section>
    </Fragment>
  );
};
Landing.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Landing);
