import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../../actions/Auth";

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) return <Redirect to='/home' />;

  return (
    <Fragment>
      <section className='form-container'>
        <h1>
          {" "}
          <i className='fas fa-lock' /> Log In
        </h1>

        <form onSubmit={(e) => onSubmit(e)}>
          <input
            autoComplete='email'
            type='email'
            name='email'
            placeholder='E-mail'
            value={email}
            onChange={(e) => onChange(e)}
          />
          <input
            autoComplete='current-password'
            type='password'
            name='password'
            placeholder='Password'
            value={password}
            onChange={(e) => onChange(e)}
          />
          <br />
          <br />
          <button type='submit'>Login</button>
          <br />
          <br />
          <p>
            Don't have an account?{" "}
            <Link to='/register' style={{ color: "white" }}>
              Sign up
            </Link>
          </p>
        </form>
      </section>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
