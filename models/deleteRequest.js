const mongoose = require('mongoose');

var deleteRequestSchema = new mongoose.Schema({
  bird: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bird"
  }
})

module.exports = mongoose.model("DeleteRequest", deleteRequestSchema);
