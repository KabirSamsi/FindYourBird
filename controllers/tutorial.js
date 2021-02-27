module.exports.search = function(req, res) {
	return res.render('tutorial', {birdInfo: false, field: "search"});
}

module.exports.identify = function(req, res) {
	return res.render('tutorial', {birdInfo: false, field: "identify"});
}

module.exports.add = function(req, res) {
	return res.render('tutorial', {birdInfo: false, field: "add"});
}

module.exports.edit = function(req, res) {
	return res.render('tutorial', {birdInfo: false, field: "edit"});
}

module.exports.gallery = function(req, res) {
	return res.render('tutorial', {birdInfo: false, field: "gallery"});
}
