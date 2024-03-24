const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  problem: {
    type: mongoose.Types.ObjectId,
    ref: "postproblem",
  },
  overview: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  attachment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

Idea = mongoose.model("idea", IdeaSchema);

module.exports = Idea;
