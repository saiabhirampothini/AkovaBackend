const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

//@Test route to fetch user data

router.get("/", auth, async (req, res) => {
  // const user = await User.findById(req.user.id).select("-password");
  // if (user) return res.status(200).json(user);
  // else return res.status(400).json({ msg: "User data not found" });
  res.status(200).json({ msg: "Token is valid" });
});

//Login route

router.post(
  "/",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Please provide a password").exists(),
    check("password", "The password should atleast 8 characters long").isLength(
      { min: 8 }
    ),
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
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //Generate token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          else {
            return res.status(200).json({
              token,
              msg: "User Logged in successfully",
              profession: user.profession,
            });
          }
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

//Fetch Enterprenuer Route
//Private
router.get("/getEnterprenuer/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .select("-_id")
    .select("-date")
    .select("-__v");
  return res.status(200).json(user);
});

//Route to get profile
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (user) return res.status(200).json(user);
  else return res.status(400).json({ msg: "Invalid Authorization" });
});
module.exports = router;
