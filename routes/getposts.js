const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const PostProblem = require("../models/PostProblem");
//@Test
router.get("/", (req, res) => {
  res.send("Hi from get me");
});

//GET the logged in enterprenuer posts for them
router.get("/me", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    userProfession = "Enterprenuer";
    if (user.profession.toLowerCase() !== userProfession.toLowerCase()) {
      return res
        .status(400)
        .json({ msg: "You are not allowed to access this route" });
    }
    let problems = await PostProblem.find({ user: req.user.id }).sort({
      date: -1,
    });
    if (problems.length != 0) {
      return res.status(200).json(problems);
    } else {
      return res.status(400).json({ msg: "You didn't post any problems yet" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

//GET all the enterprenuer posts for students
router.get("/all", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    let userProfession = "Student";
    if (user.profession.toLowerCase() !== userProfession.toLowerCase()) {
      return res
        .status(400)
        .json({ msg: "You are not allowed to access this route" });
    }
    let posts = await PostProblem.find().sort({ date: -1 });
    if (posts.length != 0) {
      return res.status(200).json(posts);
    } else {
      return res
        .status(400)
        .json({ msg: "No Enterprenuer has posted a problem yet" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

//GET post by post request

router.get("/post/:post_id", auth, async (req, res) => {
  try {
    let problem = await PostProblem.findById(req.params.post_id);
    if (!problem) {
      return res
        .status(400)
        .json({ msg: "No problem has been posted by this user yet" });
    }
    return res.status(200).json(problem);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res
        .status(400)
        .json({ msg: "No problem has been posted by this user yet" });
    }
    return res.status(500).json({ msg: "Server Error" });
  }
});
module.exports = router;
