module.exports.search = function(req, res) { //Searching Tutorial
	return res.render('tutorial', {birdInfo: false, field: "search"});
}

module.exports.identify = function(req, res) { //Identify Tutorial
	return res.render('tutorial', {birdInfo: false, field: "identify"});
}

module.exports.add = function(req, res) { //Add Bird Tutorial
	return res.render('tutorial', {birdInfo: false, field: "add"});
}

module.exports.edit = function(req, res) { //Edit Bird Tutorial
	return res.render('tutorial', {birdInfo: false, field: "edit"});
}

module.exports.gallery = function(req, res) { //View/Update Gallery Tutorial
	return res.render('tutorial', {birdInfo: false, field: "gallery"});
}
