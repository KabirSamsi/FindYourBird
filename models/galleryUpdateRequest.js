const mongoose = require('mongoose');

const galleryUpdateRequestSchema = new mongoose.Schema({
	bird: {type: mongoose.Schema.Types.ObjectId, ref: "Bird"},
	imgIndex: {type: Number}, //Only for deleting
	img: {type: Object}, //Only for adding
	action: {type: String}
});

module.exports = mongoose.model("GalleryUpdateRequest", galleryUpdateRequestSchema);
