const mongoose = require('mongoose');

var addRequestSchema = new mongoose.Schema({
  name: String,
  scientificName: String,
  img: {type: Object},
  description: String,
  appearance: String,
  diet: {type: String},
  habitat: [{type: String}],
  range: String,
  gallery: [
    {type: Object}
  ],
  size: String,
  colors: [{type: String}]
})

module.exports = mongoose.model("AddRequest", addRequestSchema);
