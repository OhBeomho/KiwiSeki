const { Schema, model } = require("mongoose");

const wikiSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  previousContent: String,
  lastUpdateTime: {
    type: Number,
    required: true
  },
  lastUpdateUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = model("Wiki", wikiSchema);
