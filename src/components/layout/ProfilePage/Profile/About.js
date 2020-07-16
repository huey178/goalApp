import React from "react";

const About = (profile) => {
  return (
    <div className='about-container'>
      <div>Occupation: {profile.occupation}</div>
      <div>Location: {profile.location}</div>
      <div>Hobbies: {profile.hobbies}</div>
      <div>Member Since: </div>
    </div>
  );
};

export default About;
