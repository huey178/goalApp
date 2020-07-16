import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editProfile } from "../../../../actions/Profile";

const About = ({ profile, editProfile }) => {
  const [ProfileForm, SetProfileData] = useState({
    occupation: "",
    location: "",
    hobbies: "",
    dob: "",
    facebook: "",
    youtube: "",
    instagram: "",
    twitter: "",
  });

  const {
    occupation,
    location,
    hobbies,
    dob,
    facebook,
    youtube,
    instagram,
    twitter,
  } = ProfileForm;
  const [EditState, EditToggle] = useState(false);

  const submitProfileChange = (e) => {
    e.preventDefault();
    editProfile(ProfileForm);
    SetProfileData({
      occupation: "",
      location: "",
      dob: "",
      hobbies: "",
      facebook: "",
      youtube: "",
      instagram: "",
      twitter: "",
    });
    toggleEdit();
  };
  const onChange = (e) => {
    SetProfileData({
      ...ProfileForm,
      [e.target.name]: e.target.value,
    });
  };
  const toggleEdit = () => {
    !EditState ? EditToggle(true) : EditToggle(false);
  };
  return (
    <div className='about-container'>
      <div>
        <i className='fas fa-edit' onClick={() => toggleEdit()} />
      </div>
      <div>Occupation: {profile.occupation}</div>
      {EditState && (
        <div className='stepText'>
          <textarea
            name='occupation'
            value={occupation}
            rows='3'
            cols='20'
            placeholder='Occupation'
            onChange={(e) => onChange(e)}
          />
          <br />
        </div>
      )}
      <div>Location: {profile.location}</div>
      {EditState && (
        <div className='stepText'>
          <textarea
            name='location'
            value={location}
            rows='3'
            cols='20'
            placeholder='Location'
            onChange={(e) => onChange(e)}
          />
          <br />
        </div>
      )}
      <div>Hobbies: {profile.hobbies}</div>
      {EditState && (
        <div className='stepText'>
          <textarea
            name='hobbies'
            value={hobbies}
            rows='3'
            cols='20'
            placeholder='Hobbies'
            onChange={(e) => onChange(e)}
          />
          <br />
        </div>
      )}
      <div>Member Since: </div>
      {EditState && (
        <button onClick={(e) => submitProfileChange(e)}>Update</button>
      )}
    </div>
  );
};

About.propTypes = {
  editProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

export default connect(mapStateToProps, { editProfile })(About);
