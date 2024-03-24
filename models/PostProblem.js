const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostProblemSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  contributer: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  technologies: {
    type: String,
    required: true,
  },
  languages: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  uses: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  problemStatement: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  githubrepository: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});
PostProblem = mongoose.model("postproblem", PostProblemSchema);
module.exports = PostProblem;
