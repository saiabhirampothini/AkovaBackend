const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InterestSchema = new Schema({
  project: {
    type: mongoose.Types.ObjectId,
    ref: "investproject",
  },
  investor: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  status: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

Interest = mongoose.model("interest", InterestSchema);

module.exports = Interest;
