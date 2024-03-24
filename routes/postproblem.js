const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const PostProblem = require("../models/PostProblem");
const User = require("../models/User");
//@Test get route
router.get("/", (req, res) => {
  res.send("Hi i post");
});

//POST request for posting a problem
router.post(
  "/",
  [
    check("title", "Title is required").not().isEmpty(),
    check("technologies", "Technologies are required").not().isEmpty(),
    check("languages", "Languages required").not().isEmpty(),
    check("domain", "Domain is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("uses", "Uses required").not().isEmpty(),
    check("output", "Output is required").not().isEmpty(),
    check("problemStatement", "Problem Statement is required").not().isEmpty(),
    check("dueDate", "Due date is required").not().isEmpty(),
    check("image", "Link of the image is required").not().isEmpty(),
    check("githubrepository", "Git repo link is required").not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await User.findById(req.user.id).select("-password");
      let userProfession = "Enterprenuer";
      if (user.profession.toLowerCase() !== userProfession.toLowerCase()) {
        return res.status(400).json({
          errors: [{ msg: "You are not authorized to post a problem" }],
        });
      }
      const {
        title,
        technologies,
        languages,
        domain,
        description,
        uses,
        output,
        dueDate,
        problemStatement,
        image,
        githubrepository,
      } = req.body;
      const newProblem = new PostProblem({
        user: user.id,
        contributer: user.name,
        title,
        technologies,
        languages,
        domain,
        description,
        uses,
        output,
        dueDate,
        problemStatement,
        image,
        githubrepository,
      });
      let post = await PostProblem.findOne({ title });
      if (post) {
        return res
          .status(400)
          .json({ msg: "The project title has been taken already!" });
      }
      const problem = await newProblem.save();
      return res.status(200).json(problem);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);
router.put("/updateDate", auth, async (req, res) => {
  const filter = { _id: req.body._id };
  const newProblem = req.body;
  await PostProblem.findOneAndUpdate(filter, newProblem);
  return res.status(200).json({ msg: "Due Date Updated" });
});
module.exports = router;
