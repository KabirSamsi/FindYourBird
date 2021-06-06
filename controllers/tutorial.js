const controller = {};

controller.home = function(req, res) { //FindYourBird Overview
	return res.render('tutorial', {info: false, field: "home"});
}

controller.search = function(req, res) { //Searching Tutorial
	return res.render('tutorial', {info: false, field: "search"});
}

controller.identify = function(req, res) { //Identify Tutorial
	return res.render('tutorial', {info: false, field: "identify"});
}

controller.add = function(req, res) { //Add Bird Tutorial
	return res.render('tutorial', {info: false, field: "add"});
}

controller.edit = function(req, res) { //Edit Bird Tutorial
	return res.render('tutorial', {info: false, field: "edit"});
}

controller.gallery = function(req, res) { //View/Update Gallery Tutorial
	return res.render('tutorial', {info: false, field: "gallery"});
}

module.exports = controller;