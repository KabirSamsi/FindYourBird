const mongoose = require('mongoose');

const updateRequestSchema = new mongoose.Schema({
	bird: {type: mongoose.Schema.Types.ObjectId, ref: "Bird"},
	description: {type: String, default: ''},
	appearance: {type: String, default: ''},
	diet: {type: String, default: ''},
	habitat: [{type: String}],
	range: {type: String, default: ''},
	size: String,
	colors: [{type: String}],
	version: {type: String}
});

module.exports = mongoose.model("UpdateRequest", updateRequestSchema);
