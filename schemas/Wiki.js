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
  lastEdit: Schema.Types.Mixed
});

module.exports = model("Wiki", wikiSchema);
