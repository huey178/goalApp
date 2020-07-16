const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Private Route
// Get Current User
// /api/auth
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json("Server Error");
  }
});

// Public
// Login in
// /api/auth

router.post(
  "/",
  [
    check("email", "Email is required"),
    check("password", "Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json("Invalid Email or Password");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials " }] });
      }
      const payload = {
        user: {
          id: user.id,
        },
        name: {
          name: user.name,
        },
      };

      jwt.sign(
        payload,
        config.get("JWT_SECRET"),
        { expiresIn: 7200 },
        (error, token) => {
          if (error) throw error;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Server Error");
    }
  }
);
module.exports = router;
