const mongoose = require('mongoose');

var birdSchema = new mongoose.Schema({
  name: String,
  scientificName: String,
  img: [{type: String}],
  description: String,
  appearance: String,
  diet: {type: String},
  habitat: [{type: String}],
  range: String,
  gallery: [
    [{type: String}]
  ],
  size: String,
  colors: [{type: String}]
})

module.exports = mongoose.model("Bird", birdSchema);
