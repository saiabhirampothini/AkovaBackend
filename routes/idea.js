const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const PostProblem = require("../models/PostProblem");
const { check, validationResult } = require("express-validator");
const Idea = require("../models/Idea");
//@Test

router.get("/", (req, res) => {
  res.send("Hi from idea");
});

//POST an idea for a problem
router.post(
  "/:post_id",
  [
    check("overview", "An overview heading of project idea is needed")
      .not()
      .isEmpty(),
    check("description", "A description of project is needed").not().isEmpty(),
    check("attachment", "An attachment to the solution repository is needed")
      .not()
      .isEmpty(),
  ],
  auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let post = await PostProblem.findById(req.params.post_id);
      // console.log(req.params.id);
      if (!post) {
        return res.status(400).json({ errors: [{ msg: "No problem exists" }] });
      }
      let user = await User.findById(req.user.id);
      let userProfession = "student";
      if (user.profession.toLowerCase() !== userProfession.toLowerCase()) {
        return res.status(400).json({
          errors: [
            { msg: "You are not allowed to post idea for this problem" },
          ],
        });
      }
      const { overview, description, attachment } = req.body;
      const idea = new Idea({
        user: req.user.id,
        problem: req.params.post_id,
        overview,
        description,
        attachment,
      });
      let ideaSearch = await Idea.find({
        user: req.user.id,
        problem: req.params.post_id,
      });
      // console.log(ideaSearch);
      if (ideaSearch && ideaSearch.length != 0)
        return res.status(400).json({
          errors: [{ msg: "Only one idea can be posted by user to a problem" }],
        });
      const ideaSubmit = await idea.save();
      return res.status(200).json(ideaSubmit);
    } catch (err) {
      console.error(err.message);
      if (err.kind == "ObjectId") {
        return res
          .status(400)
          .json({ errors: [{ msg: "This problem does not exists" }] });
      }
      return res.status(500).send("Server Error");
    }
  }
);

//GET all ideas for a specific project
router.get("/getideas/:post_id", auth, async (req, res) => {
  try {
    let post = await PostProblem.findById(req.params.post_id);
    // console.log(post);
    if (!post) {
      return res.status(400).json({ errors: [{ msg: "No problem exists" }] });
    }
    let id = await Idea.find({ problem: req.params.post_id }).populate("user", [
      "name",
      "email",
    ]);
    // console.log(id);
    if (id.length == 0) {
      return res
        .status(400)
        .json({ msg: "No ideas are submitted yet for the current project" });
    }
    return res.json(id);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res
        .status(400)
        .json({ errors: [{ msg: "This problem does not exists" }] });
    }
    return res.status(500).send("Server Error");
  }
});

//GET all ideas submitted by student
router.get("/getidea/me", auth, async (req, res) => {
  try {
    let ideas = await Idea.find({ user: req.user.id }).populate("problem", [
      "contributer",
      "title",
      "dueDate",
      "user",
      "problemStatement",
    ]);
    if (ideas.length == 0) {
      return res
        .status(400)
        .json({ msg: "You haven't submitted any ideas for any projects" });
    }
    return res.status(200).json(ideas);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});
router.put("/update/:id", auth, async (req, res) => {
  const filter = { _id: req.params.id };
  const newIdea = req.body;
  await Idea.findOneAndUpdate(filter, newIdea);
  // console.log(idea);
  return res.status(200).json(newIdea);
  // console.log(newIdea);
  // await newIdea.save();
});
module.exports = router;
