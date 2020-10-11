const mongoose = require('mongoose');

var galleryUpdateRequestSchema = new mongoose.Schema({
  bird: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bird"
  },
  imgIndex: {type: Number}, //Only for deleting
  img: [{type: String}], //Only for adding
  action: {type: String}
})

module.exports = mongoose.model("GalleryUpdateRequest", galleryUpdateRequestSchema);
