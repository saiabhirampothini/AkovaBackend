const express = require("express");
const config = require("config");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

//Test GET Route
// router.get("/", (req, res) => {
//   res.send("User route");
// });

//REGISTER POST ROUTE
router.post(
  "/",
  [
    check("name", "Please add a name").not().isEmpty(),
    check("email", "Enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).isLength({ min: 8 }),
    check("profession", "Profession is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, profession } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
        profession,
      });

      //Encrypting the password
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);

      //save the user
      user.save();
      //Generate Token
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
          else
            return res.status(200).json({
              token,
              msg: "User registered Successfully",
              profession: user.profession,
            });
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

//Change password
router.put("/change", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const password = req.body.password;
  const filter = { _id: req.user.id };
  const salt = await bcryptjs.genSalt(10);
  user.password = await bcryptjs.hash(password, salt);
  let response = await User.findOneAndUpdate(filter, user);
  if (response) return res.json({ msg: "Password Changed Successfully" });
  else return res.json({ msg: "Cannot change password" });
});
module.exports = router;
