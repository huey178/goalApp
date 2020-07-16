const express = require("express");
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const router = express.Router();

//Private
// Update profile
// /api/profile/

router.post("/", auth, async (req, res) => {
  const {
    bio,
    dob,
    location,
    occupation,
    hobbies,
    facebook,
    instagram,
    twitter,
    youtube,
  } = req.body;

  // Create profile fields
  const profileFields = {};
  if (bio) profileFields.bio = bio;
  if (dob) profileFields.dob = dob;
  if (location) profileFields.location = location;
  if (occupation) profileFields.occupation = occupation;
  if (hobbies) profileFields.hobbies = hobbies;
  // Add social elements to profile field
  profileFields.social = {};

  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;
  if (twitter) profileFields.social.twitter = twitter;
  if (youtube) profileFields.social.youtube = youtube;
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      ).populate("user", ["name", "avatar"]);

      await profile.save();
      return res.json(profile);
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

//Public
// Get all profiles
// /api/profile/all
router.get("/all", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    if (!profiles) {
      return res.status(400).json("No profiles were found");
    }
    return res.json(profiles);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

// public
// get a specific profile
// /api/profile/user/:user_id
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json("Profile was not found");
    }
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

// Private
// Get my profile
// /api/profile/

router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(404).json({ msg: "You do not have a profile" });
    }
    return res.json(profile);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

//Private
// Delete a profile
// /api/profile/user/:user_id/delete

//Will need to delete all goal lists

router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    return res.json("User Removed");
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

module.exports = router;
