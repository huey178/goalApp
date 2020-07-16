const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../../models/User.js");
const Profile = require("../../models/Profile");
const gravatar = require("gravatar");
const auth = require("../../middleware/auth");

// Search for users
router.get("/:userName", async (req, res) => {
  try {
    const foundNames = await User.aggregate([
      {
        $search: {
          text: {
            query: req.params.userName,
            path: "name",
          },
        },
      },
      {
        $project: {
          name: 1,
          avatar: 1,
          id: 1,
        },
      },
    ]);
    return res.json(foundNames);
  } catch (error) {
    return res.status(404).json({ msg: error.data });
  }
});

//Create a user & profile

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password must have 8 or more characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    //testing to see if there were validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //testing to see if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "Email already exists" });
      }

      //create gravatar

      const avatar = gravatar.url(email, {
        s: "200", // size
        r: "pg", //pg rating on picture
        d: "mm", //default image
      });

      //Creating new user
      user = new User({
        name,
        email,
        password,
        avatar,
      });

      //salting && hashing password

      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);

      //saving user
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      const {
        bio,
        dob,
        location,
        occupation,
        facebook,
        instagram,
        twitter,
        youtube,
      } = req.body;

      // Create profile fields
      const profileFields = {};
      bio
        ? (profileFields.bio = bio)
        : (profileFields.bio = `I'm still thinking`);
      if (dob) profileFields.dob = dob;
      if (location) profileFields.location = location;
      occupation
        ? (profileFields.occupation = occupation)
        : (profileFields.occupation = `Professional goal setter`);

      // Add social elements to profile field
      profileFields.social = {};

      if (facebook) profileFields.social.facebook = facebook;
      if (instagram) profileFields.social.instagram = instagram;
      if (twitter) profileFields.social.twitter = twitter;
      if (youtube) profileFields.social.youtube = youtube;
      profileFields.user = payload.user.id;
      profile = new Profile(profileFields);
      await profile.save();
      //assigns token that expires in 2 hours
      jwt.sign(
        payload,
        config.get("JWT_SECRET"),
        { expiresIn: 7200 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
