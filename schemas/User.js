const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  wikiCount: {
    type: Number,
    default: 0
  }
});

module.exports = model("User", userSchema);
