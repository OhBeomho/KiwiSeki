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
  createdTime: {
    type: Number,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  editedTime: {
    type: Number,
    default: -1
  },
  editor: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = model("Wiki", wikiSchema);
