const mongoose = require('mongoose');

const galleryUpdateRequestSchema = new mongoose.Schema({
	bird: {type: mongoose.Schema.Types.ObjectId, ref: "Bird"},
	imgIndex: Number, //Only for deleting
	img: { //Only for adding
		url: {type: String, default: ''},
		citation: {type: String, default: ''}
	},
	action: {type: String}
});

module.exports = mongoose.model("GalleryUpdateRequest", galleryUpdateRequestSchema);
