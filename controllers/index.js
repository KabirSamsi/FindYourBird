//LIBRARIES
const filter = require("../utils/filter");
const {isInMap, occurrencesByMap, isInString, occurrencesByString, occurrencesByArray} = require("../utils/searchOperations");
const {attrs, colors, sizes, habitats, values} = require("../utils/fields");

//SCHEMA
const Bird = require('../models/bird');
const AddRequest = require('../models/addRequest');
const UpdateRequest = require('../models/updateRequest');

const controller = {};

controller.index = function(req, res) {
	return res.render('index', {birdInfo: false, search: null});
}

controller.search = async function(req, res) {
	let resultMatrix = []; //Hold info about each bird that matches search, and the number of times the search shows up in its info
	let results = []; //Hold info about each matching bird
	const textSplitter = new RegExp(/[\"-\s\'\r\n]/, 'g'); //Splitting delimters between phrases
	const delimeter = new RegExp(/[^a-zA-z0-9]/, 'g'); //Characters that can distort word nature
	
	let searchExpressions = [];
	for (let word of filter(req.body.name).split(textSplitter)) { //Parse out words from full phrase
		if (!['', ' '].includes(word)) { //Ignore spaces
			searchExpressions.push(word.toLowerCase().split(delimeter).join(''));
		}
	}

	for (let i = searchExpressions.length-1; i >= 0; i--) { //Double check with within-word regex (non-ascii keywords can still pass filter)
		if (searchExpressions[i].split(delimeter).join('') == '') {
			searchExpressions.splice(i, 1);
		}
	}
	
	if (searchExpressions.length == 0) { //If no results are matched
		req.flash('error', "Please enter a more specific search");
		return res.redirect('/');
	}
	
	const birds = await Bird.find({});
	if (!birds) {
		req.flash('error', "Unable to access database");
		return res.redirect('back');
	}
	
	let data = new Map(); //Tracks occurrences of whole words in birds' data
	let dataString = ""; //Tracks occurrences of partial words in birds' data
	
	for (let bird of birds) {
		for (let item of data) {data.delete(item[0]);} //Refresh data after eeach iteration
		dataString = "";
		
		for (let attr of attrs) {
			if (typeof bird[attr] == 'string') { //If the attribute is a string, add the value directly to the 'data String'
			for (let word of filter(bird[attr].toLowerCase()).split(delimeter)) { //Remove filler words to decrease search complexity
				dataString += `${word} `;
				if (data.has(word)) {data.set(word, data.get(word) + 1);
				} else {data.set(word, 1);}
			}
		
			} else { //If the attribute is an array, add each value inside the array to the data String
				for (let i of bird[attr]) {
					for (let word of filter(i.toLowerCase()).split(delimeter)) { //Remove filler words to decrease search complexity
						dataString += `${word} `;
						if (data.has(word)) {data.set(word, data.get(word) + 1);
						} else {data.set(word, 1);}
					}
				}
			}
		}
	
		//Evalautes both options and so captures both out-of-order strings (with the map) and partial strings (with the string)
		if (isInMap(searchExpressions, data)) {
			resultMatrix.push([bird, occurrencesByMap(searchExpressions, data)]);
		
		} else if (isInString(searchExpressions, dataString)) {
			resultMatrix.push([bird, occurrencesByString(searchExpressions, dataString)]);
		}
	}
	
	//Sort matrix through iteration (by having the most occurring search)
	for (let i = 0; i < resultMatrix.length; i +=1) {
		for (let j = 0; j < resultMatrix.length - 1; j += 1) {
			if (resultMatrix[j][1] > resultMatrix[j+1][1]) {
				[resultMatrix[j], resultMatrix[j+1]] = [resultMatrix[j+1], resultMatrix[j]]
			}
		}
	}
	
	let resultMap = new Map();
	for (let r of resultMatrix) { //Push birds of sorted matrix to results list, without corresponding regex values
		results.push(r[0]);
		resultMap.set(r[0]._id.toString(), r[1]);
	}
	return res.render('results', {birdInfo: false, resultMap, birds: results.reverse(), from: 'search', search: req.body.name});
}

controller.new = async function(req, res) {
	const birds = await Bird.find({});
	if (!birds) {
		req.flash('error', "Unable to find birds");
		return res.redirect('back');
	}
	
	let birdNameArr = []
	for (let bird of birds) {
		birdNameArr.push(bird.name);
	}
	
	const addRequests = await AddRequest.find({});
	if (!addRequests) {
		req.flash('error', "Unable to find add requests");
		return res.redirect('back');
	}
	
	let requestNameArr = [];
	for (let request of addRequests) {
		requestNameArr.push(request.name);
	}
	return res.render('new', {birdInfo: false, colors, sizes, habitats, birds: birdNameArr, requests: requestNameArr});
}

controller.create = async function(req, res) {
	let finalHabitats = [];
	for (let habitat of habitats) {
		if (req.body[habitat] == 'on') {finalHabitats.push(habitat);}
	}
	
	let finalColors = [];
	for (let color of colors) {
		if (req.body[color] == 'on') {
			for (let i = 0 ; i < parseInt(req.body[`${color}Slider`]); i++) {
				finalColors.push(color);
			}
		}
	}
	
	const requestOverlap = await AddRequest.find({name: req.body.name});
	if (!requestOverlap) {
		req.flash('error', "Unable to access database");
		return res.redirect('back');
	}
	
	if (requestOverlap.length > 0) {
		req.flash('error', "Bird is already a pending add request");
		return res.redirect('back');
	}
	
	const birdOverlap = await Bird.find({name: req.body.name});
	if (!birdOverlap) {
		req.flash('error', "Error accessing list of birds");
		return res.redirect('back');
	}
	
	if (birdOverlap.length > 0) {
		req.flash('error', "Bird is already in database");
		return res.redirect('back');
	}
	
	let birdImage = { //Sets up bird image as an object
		url: req.body.img,
		citation: req.body.citation
	};
	
	const request = await AddRequest.create({
		name: req.body.name,
		scientificName: req.body.scientificName,
		img: birdImage,
		description: req.body.description,
		appearance: req.body.appearance,
		diet: req.body.diet,
		habitat: finalHabitats,
		range: req.body.range,
		size: req.body.size,
		colors: finalColors
	});

	if (!request) {
		req.flash('error', "Error accessing your request");
		return res.redirect('back');
  	}

	req.flash('success', "Thank you for adding a bird! Please wait a few days for the admin to verify and accept bird");
	return res.redirect('/');
}

controller.edit = async function(req, res) {
	const bird = await Bird.findById(req.params.id);
	if (!bird) {
		req.flash('error', "Unable to find bird");
		return res.redirect("back");
  	}
  	return res.render('edit', {birdInfo: false, bird, colors, sizes, habitats});
}

controller.identifyForm = function(req, res) {
	return res.render('identify', {birdInfo: false, colors, habitats, sizes});
}

controller.identify = async function(req, res) {
	let allowed_sizes = [];
	for (let i = 0; i < sizes.length; i += 1) {
		if (req.body.size == sizes[i] || req.body.size == sizes[i+1] || req.body.size == sizes[i-1]) {
			allowed_sizes.push(sizes[i]);
		}
	}
	
	if (req.body.color) { //A color is selected
		const birds = await Bird.find({size: {$in: allowed_sizes}});
		if (!birds) {
			req.flash("error", "An error occurred");
			return res.redirect("back");
		}

		//Sort entered colors so that they can be ranked for bird results
		let colorOrders = [];
		if (typeof req.body.color == "string" && req.body[`${req.body.color}Slider`] > 0) {
			colorOrders.push([req.body.color, req.body[`${req.body.color}Slider`]]);
		} else {
			let temp;
			for (let color of req.body.color) { //Sort colors
				if (req.body[`${color}Slider`] > 0) {
					if (colorOrders.length > 0 && colorOrders[colorOrders.length-1][1] < req.body[`${color}Slider`]) {
						temp = colorOrders[colorOrders.length-1];
						colorOrders[colorOrders.length-1] = [color, req.body[`${color}Slider`]];
						colorOrders.push(temp);
					} else {
						colorOrders.push([color, req.body[`${color}Slider`]]);
					}
				}
			}
		}

		if (colorOrders.length < 1) {
			req.flash("error", "Please enter at least one color with an intensity level of greater than 0");
			return res.redirect("back");
		}

		let finalBirds = new Map();
		let sorted = [];
		let final = [];

		for (let bird of birds) { //Iterates through birds and searches for characteristics that match entered data
	  		if (bird.habitat.includes(habitats[req.body.habitat])) {
				finalBirds.set(bird._id.toString(), 2);
				if (req.body.size == bird.size) {
					finalBirds.set(bird._id.toString(), finalBirds.get(bird._id.toString())*2);
				} else {
		  			finalBirds.set(bird._id.toString(), finalBirds.get(bird._id.toString())*1.5);
				}

				for (let color of colorOrders) { //Iterates through colors and ranks birds based on their resemblance to color form
					if (!bird.colors.includes(color[0])) { //If bird does not contain color, remove it
						finalBirds.delete(bird._id.toString());
						break;
					} else { //The further away the listed color intensity is from the bird's color intensity, the more the bird's accuracy index reduces
						finalBirds.set(bird._id.toString(), (finalBirds.get(bird._id.toString())/(1+(0.1*Math.abs(color[1] - occurrencesByArray(bird.colors).get(color[0]))))));
					}
				}
	  		}
		}

		let populatedBird;
		for (let bird of finalBirds) {
	  		populatedBird = await Bird.findById(bird[0]);
	  		if (!populatedBird) {
				req.flash("error", "An error occurred");
				return res.redirect("back");
	  		}
	  		sorted.push([populatedBird, bird[1]]);
		}

		for (let i = 0; i < sorted.length; i ++) { //Bubblesort algorithm sorts based on which bird has the most matches
			for (let j = 0; j < sorted.length-1; j++) {
				if (sorted[j][1] < sorted[j+1][1]) {
					[sorted[j], sorted[j+1]] = [sorted[j+1], sorted[j]];
				}
			}
		}

		for (let bird of sorted) {
			final.push(bird[0]);
		}
		return res.render('results', {birdInfo: false, birds: final, birdMap: finalBirds, from: 'data'});
	}
	req.flash("error", "You must enter at least one color");
	return res.redirect('back');
}

controller.contact = function(req, res) {
	return res.render('contact', {birdInfo: false});
}

controller.showBird = async function(req, res) {
	const bird = await Bird.findById(req.params.id);
	if (!bird) {
		req.flash('error', "Bird not found");
		return res.redirect("back");
	}
	return res.render('index', {birdInfo: true, bird});
}

controller.updateBird = async function(req, res) {
	let finalHabitats = [];
	for (let habitat of habitats) {
		if (req.body[habitat] == 'on') {
			finalHabitats.push(habitat);
		}
	}
	
	let finalColors = [];
	for (let color of colors) {
		if (req.body[color] == 'on') {
			for (let i = 0 ; i < parseInt(req.body[`${color}Slider`]); i++) {
				finalColors.push(color);
			}
		}
	}
	
	const bird = await Bird.findById(req.params.id);
	if (!bird) {
		req.flash('error', "Unable to find bird");
		return res.redirect('back');
	}
	
	const request = await UpdateRequest.create({
		bird, description: req.body.description,
		appearance: req.body.appearance,
		diet: req.body.diet,
		habitat: finalHabitats,
		range: req.body.range,
		size: req.body.size,
		colors: finalColors
	});
	
	if (!request) {
		req.flash('error', "Unable to create update request");
		return res.redirect('back');
	}
	await request.save();
	req.flash('success', "Bird Updates Sent to Admin! Please wait a few days for the admin to verify and accept changes");
	return res.redirect(`/${bird._id}`);
}

module.exports = controller;