const { Schema, model } = require("mongoose");

const requestWikiSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

module.exports = model("RequestWiki", requestWikiSchema);
