const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  bio: {
    type: String,
  },
  dob: {
    type: Date,
  },
  location: {
    type: String,
  },
  occupation: {
    type: String,
  },
  hobbies: {
    type: String,
  },
  social: {
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    twitter: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
});
module.exports = Profile = mongoose.model("profile", ProfileSchema);
