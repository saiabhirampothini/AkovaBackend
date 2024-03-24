const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const InvestProject = require("../models/Invest");
const Interest = require("../models/InvestorIntrest");
const User = require("../models/User");

//POST request for asking an investment
router.post(
  "/",
  [
    check("title", "Title is required").not().isEmpty(),
    check("technologies", "Technologies are required").not().isEmpty(),
    check("languages", "Languages required").not().isEmpty(),
    check("domain", "Domain is required").not().isEmpty(),
    check("description", "Description is required").not().isEmpty(),
    check("uses", "Uses required").not().isEmpty(),
    check("quotation", "Quotation is required").not().isEmpty(),
    check("investment", "Investment requested amount is required")
      .not()
      .isEmpty(),

    check("image", "Link of the image is required").not().isEmpty(),
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
          errors: [{ msg: "You are not authorized to ask for an investment" }],
        });
      }
      const {
        title,
        technologies,
        languages,
        domain,
        description,
        uses,
        quotation,
        investment,
        image,
      } = req.body;
      let accepted = false;
      const newInvestment = new InvestProject({
        enterprenuer: user.id,
        title,
        technologies,
        languages,
        domain,
        description,
        uses,
        quotation,
        investment,
        image,
        accepted,
      });

      let invest = await InvestProject.findOne({ title });

      if (invest) {
        return res.status(400).json({
          msg: "There was already an investment request for this project title!",
        });
      }
      const investRequest = await newInvestment.save();
      return res.status(200).json(investRequest);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

router.get("/projects", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id).select("-password");
    let userProfession = "Investor";
    if (user.profession.toLowerCase() !== userProfession.toLowerCase()) {
      return res
        .status(400)
        .json({ msg: "You are not allowed to access this route" });
    }
    let posts = await InvestProject.find()
      .sort({ date: -1 })
      .populate("enterprenuer", ["name", "email"]);
    if (posts.length != 0) {
      return res.status(200).json(posts);
    } else {
      return res
        .status(400)
        .json({ msg: "No Enterprenuer has asked for an investment yet" });
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});
//GET an investors intersted projects
router.get("/i", auth, async (req, res) => {
  // console.log("hi");
  let interested = await Interest.find({ investor: req.user.id }).populate(
    "project",
    ["title", "description", "quotation", "investment"]
  );
  if (interested) return res.status(200).json(interested);
  else
    return res
      .status(400)
      .json({ msg: "You did not show interest in any project to invest" });
});
router.get("/enterprenuer", auth, async (req, res) => {
  let id = req.user.id;
  let projects = await InvestProject.find({ enterprenuer: id });
  // console.log(projects);
  if (projects) return res.status(200).json(projects);
  else return res.status(400).json({ msg: "Projects are not posted yet" });
});
router.get("/enterprenuer/investor/:id", auth, async (req, res) => {
  let investors = await Interest.find({ project: req.params.id }).populate(
    "investor",
    ["name", "email"]
  );
  // console.log(investors);
  if (investors) return res.status(200).json(investors);
  else return res.status(400).json({ msg: "No investment intrests yet" });
});
router.get("/:post_id", auth, async (req, res) => {
  try {
    let problem = await InvestProject.findById(req.params.post_id).populate(
      "enterprenuer",
      ["name", "email"]
    );
    if (!problem) {
      return res.status(400).json({ msg: "No project found" });
    }
    return res.status(200).json(problem);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "No project has been posted yet" });
    }
    return res.status(500).json({ msg: "Server Error" });
  }
});
router.put("/:post_id", auth, async (req, res) => {
  try {
    let problem = await InvestProject.findById(req.params.post_id).populate(
      "enterprenuer",
      ["name", "email"]
    );
    const data = req.body;
    const filter = { _id: req.params.post_id };
    await InvestProject.findOneAndUpdate(filter, problem);
    let investor = new Interest({
      project: problem._id,
      investor: req.user.id,
      status: data.interest,
    });
    await investor.save();
    return res.status(200).json(problem);
    // return res.status(400).json({ msg: "Error" });
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "No project has been posted yet" });
    }
    return res.status(500).json({ msg: "Server Error" });
  }
});
//Status GET request
router.get("/status/:id", auth, async (req, res) => {
  let interest = await Interest.findOne({
    investor: req.user.id,
    project: req.params.id,
  });
  if (interest) {
    return res.status(200).json(interest);
  } else {
    return res.status(400).json({ msg: "No interest submitted" });
  }
});
router.put("/stop/:id", auth, async (req, res) => {
  let project = await InvestProject.findById(req.params.id);
  let data = req.body;
  project.accepted = data.accepted;
  const filter = { _id: req.params.id };
  // await Idea.findOneAndUpdate(filter, newIdea);
  // console.log(project);
  // console.log(data);
  await InvestProject.findOneAndUpdate(filter, project);
  return res.status(200).json(project);
});
module.exports = router;
