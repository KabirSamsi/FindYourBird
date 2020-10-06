const mongoose = require('mongoose');

var updateRequestSchema = new mongoose.Schema({
  bird: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bird"
  },

  name: String,
  img: [{type: String}],
  description: String,
  appearance: String,
  diet: [{type: String}],
  habitat: [{type: String}],
  range: String,
  gallery: [
    [{type: String}]
  ],
  size: String,
  colors: [{type: String}],

  version: {type: String}
})

module.exports = mongoose.model("UpdateRequest", updateRequestSchema);
