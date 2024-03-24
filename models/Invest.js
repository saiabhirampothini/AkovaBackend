const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvestSchema = new Schema({
  enterprenuer: {
    type: Schema.Types.ObjectId,
    ref: "user",
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
  image: {
    type: String,
    required: true,
  },
  quotation: {
    type: String,
    required: true,
  },
  investment: {
    type: String,
    required: true,
  },
  accepted: {
    type: Boolean,
    deafult: false,
  },

  date: {
    type: Date,
    default: Date.now(),
  },
});
InvestProject = mongoose.model("investproject", InvestSchema);
module.exports = InvestProject;
