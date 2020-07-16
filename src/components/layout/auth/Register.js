import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../../actions/Alert";
import { register } from "../../../actions/Auth";

const Register = ({ setAlert, isAuthenticated, register }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });

  const { name, email, password1, password2 } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (password1 !== password2) {
      setAlert("Passwords do not match", "failure");
    } else {
      register(name, email, password1);
    }
  };
  if (isAuthenticated) return <Redirect to='/home' />;
  return (
    <Fragment>
      <section className='form-container'>
        <h1>
          {" "}
          <i className='fas fa-user' /> Create Your Account
        </h1>
        <form onSubmit={(e) => onSubmit(e)}>
          <input
            type='text'
            name='name'
            placeholder='Name'
            value={name}
            onChange={(e) => onChange(e)}
          />
          <input
            type='email'
            name='email'
            placeholder='E-mail'
            value={email}
            onChange={(e) => onChange(e)}
          />
          <small>
            Please use a gravatar email if you would like a profile image.
          </small>
          <input
            autoComplete='new-password'
            type='password'
            name='password1'
            placeholder='Password'
            value={password1}
            onChange={(e) => onChange(e)}
          />
          <small>minimum of 8 characters</small>
          <input
            type='password'
            name='password2'
            placeholder='Confirm Password'
            value={password2}
            onChange={(e) => onChange(e)}
          />
          <br />

          <button> Create Account</button>
          <p>
            Already have an account?{" "}
            <Link to='/login' style={{ color: "white" }}>
              Sign in
            </Link>
          </p>
        </form>
      </section>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});
export default connect(mapStateToProps, { setAlert, register })(Register);
