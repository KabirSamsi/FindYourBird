//LIBRARIES
const {occurrencesByArray, lastElement, parsePropertyArray, mapToMatrix, removeIfIncluded} = require("../utils/searchOperations");
const {colors, sizes, habitats, values} = require("../utils/fields");
const {attrs, identifyValues} = require("../utils/fields");
const {compareSimilarity} = require("../utils/similarity");
const {keywordSearch} = require("../utils/search");
const filter = require("../utils/filter");
const math = require("mathjs");

//SCHEMA
const Bird = require('../models/bird');
const AddRequest = require('../models/addRequest');
const UpdateRequest = require('../models/updateRequest');

const controller = {};

controller.index = function(req, res) { //Display homepage
	return res.render('index', {info: false, search: null});
}

controller.search = async function(req, res) { //Search for bird with entered keyword
	const delimeter = new RegExp(/[^a-zA-z0-9]/, 'g'); //Characters that can distort word nature
	let results = await keywordSearch(req.body.name.toLowerCase(), Bird);
	if (results.error) {
		await req.flash("error", results.error);
		return res.redirect("/");
	}

	//Eliminate birds that fall below a standard deviation of similarity
	let birdMatrix = await parsePropertyArray(mapToMatrix(results.resultMap), 1);
	for (let bird of results.resultMap) {
		if (math.mean(birdMatrix) - bird[1] > math.std(birdMatrix)) {
			removeIfIncluded(results.birds, bird[0], "_id");
			results.resultMap.delete(bird[0]);
		}
	}

	if (results.birds.length > 0 && results.birds.length < 30) { //If there are results with the given keyword
		return res.render('results', results);
	} else if (results.birds.length > 0) {
		await req.flash("error", "Please enter a more specific search");
		return res.redirect("/");
	}

	//If there are no results, search with just general species name
	results = await keywordSearch(req.body.name.toLowerCase(), Bird, true);
	if (results.error) {
		await req.flash("error", results.error);
		return res.redirect("/");
	}
	//Eliminate birds that fall below a standard deviation of similarity
	birdMatrix = await parsePropertyArray(mapToMatrix(results.resultMap), 1);
	for (let bird of results.resultMap) {
		if (math.mean(birdMatrix) - bird[1] > math.std(birdMatrix)) {
			removeIfIncluded(results.birds, bird[0], "_id");
			results.resultMap.delete(bird[0]);
		}
	}

	if (results.birds.length > 0 && results.birds.length < 30) { //If there are results with the given keyword
		return res.render('results', results);
	} else if (results.birds.length > 0) {
		await req.flash("error", "Please enter a more specific search");
		return res.redirect("/");
	}

	//If still no results, attempt to search for birds with similar keyword profiles
	const birds = await Bird.find({});
	if (!birds) {
		req.flash("error", "An error occurred");
		return res.redirect('/');
	}

	let similarArray = [];
	let similarMap = new Map(); //Build map of birds with similar names to the entered keyword
	for (let bird of birds) {
		if (req.body.name.toLowerCase().split(delimeter).join('').length > 3 && await compareSimilarity(bird.name.toLowerCase().split(delimeter).join(''), req.body.name.toLowerCase().split(delimeter).join('')) > 0) {
			await similarMap.set(bird._id, compareSimilarity(bird.name.toLowerCase().split(delimeter).join(''), req.body.name.toLowerCase().split(delimeter).join('')));
			await similarArray.push(bird);
		} else if (lastElement(req.body.name.toLowerCase().split(' '), -1).length > 3 && (await compareSimilarity(lastElement(bird.name.toLowerCase().split(' '), -1), lastElement(req.body.name.toLowerCase().split(' '), -1)) > 30) && !(similarMap.has(bird._id))) {
			await similarMap.set(bird._id, compareSimilarity(lastElement(bird.name.toLowerCase().split(' '), -1), lastElement(req.body.name.toLowerCase().split(' '), -1))/3);
			await similarArray.push(bird);
		}
	}

	//Eliminate birds that fall below a standard deviation of similarity
	birdMatrix = await parsePropertyArray(mapToMatrix(similarMap), 1);
	for (let bird of similarMap) {
		if (math.mean(birdMatrix) - bird[1] > math.std(birdMatrix)) {
			removeIfIncluded(similarArray, bird[0], "_id");
			similarMap.delete(bird[0]);
		}
	}

	//Matrix bubblesort (by having the most search occurrences)
	for (let i = 0; i < similarArray.length; i +=1) {
		for (let j = 0; j < similarArray.length - 1; j += 1) {
			if (similarMap.get(similarArray[j]._id) < similarMap.get(similarArray[j+1]._id)) {
				[similarArray[j], similarArray[j+1]] = [similarArray[j+1], similarArray[j]]
			}
		}
	}
	return res.render("results", {info: false, resultMap: similarMap, birds: similarArray, from: 'search', search: req.body.name, perfectMatch: values.get("name"), similarResults: true});
}

controller.new = async function(req, res) { //Form to create new bird
	const birds = await Bird.find({});
	if (!birds) {
		req.flash('error', "Unable to find birds");
		return res.redirect('back');
	}

	//Builds list of all bird names, as well as all add requests, for overlap warning
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
	return res.render('new', {info: false, colors, sizes, habitats, birds: birdNameArr, requests: requestNameArr});
}

controller.create = async function(req, res) { //Create add request for new bird
	let finalHabitats = [];
	for (let habitat of habitats) { //Build habitat array based on form
		if (req.body[habitat] == 'on') {finalHabitats.push(habitat);}
	}
	
	let finalColors = [];
	for (let color of colors) { //Build color array based on form
		if (req.body[color] == 'on') {
			for (let i = 0 ; i < parseInt(req.body[`${color}Slider`]); i++) {
				finalColors.push(color);
			}
		}
	}
	
	//Check if bird, or add request, already exists with this name
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
	
	const request = await AddRequest.create({ //Create new bird add request
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

controller.edit = async function(req, res) { //Form to edit bird profile (not all features mutable)
	const bird = await Bird.findById(req.params.id);
	if (!bird) {
		req.flash('error', "Unable to find bird");
		return res.redirect("back");
  	}
  	return res.render('edit', {info: false, bird, colors, sizes, habitats});
}

controller.identifyForm = function(req, res) { //Form to identify bird
	return res.render('identify', {info: false, colors, habitats, sizes});
}

controller.identify = async function(req, res) { //Identify bird based on form data
	let allowed_sizes = [];
	for (let i = 0; i < sizes.length; i += 1) { //Calculates sizes within range on either side of entered accuracy
		if (req.body.size == sizes[i] || req.body.size == sizes[i+1] || req.body.size == sizes[i-1]) {
			allowed_sizes.push(sizes[i]);
		}
	}
	
	if (req.body.color) { //Confirm that a color is selected
		const birds = await Bird.find({size: {$in: allowed_sizes}});
		if (!birds) {
			req.flash("error", "An error occurred");
			return res.redirect("back");
		}

		//Sort entered colors so that they can be ranked for bird results
		let colorOrders = [];
		let selectedCount = 0;
		if (typeof req.body.color == "string" && parseInt(req.body[`${req.body.color}Slider`]) > 0) { //If one color is enteered
			colorOrders.push([req.body.color, parseInt(req.body[`${req.body.color}Slider`])]);
			selectedCount ++;
		} else {
			let temp;
			for (let color of colors) { //If multiple colors are entered
				if (colorOrders.length > 0 && colorOrders[colorOrders.length-1][1] < parseInt(req.body[`${color}Slider`])) {
					//In-place bubblesort algorithm pushes colors to colorOrder array in order of intensity
					temp = colorOrders[colorOrders.length-1];
					colorOrders[colorOrders.length-1] = [color, parseInt(req.body[`${color}Slider`])];
					colorOrders.push(temp);
				} else {
					colorOrders.push([color, parseInt(req.body[`${color}Slider`])]);
				}
				if (parseInt(req.body[`${color}Slider`]) > 0) {selectedCount ++;} //Enables algorithm to store records of all colors, but tracks which ones the user has directly entered
			}
		}

		if (selectedCount < 1) {
			req.flash("error", "Please enter at least one color with an intensity level of greater than 0");
			return res.redirect("back");
		}

		let finalBirds = new Map(); //Stores sorted birds as map with accuracy
		let sorted = []; //Stores birds sorted by accuracy
		let colorOccurrences; //Stores the number of times a color occurs per bird

		for (let bird of birds) { //Iterates through birds and searches for characteristics that match entered data
	  		if (bird.habitat.includes(habitats[req.body.habitat])) {
				finalBirds.set(bird._id.toString(), 2); //If habitat is a match add bird
				if (req.body.size == bird.size) { //If size falls in accurate range, multiply by accuracy coefficient
					finalBirds.set(bird._id.toString(), finalBirds.get(bird._id.toString())*2);
				} else {
		  			finalBirds.set(bird._id.toString(), finalBirds.get(bird._id.toString())*1.5);
				}

				for (let color of colorOrders) { //Iterates through colors and ranks birds based on their resemblance to color form
					if (color[1] > 0 && !bird.colors.includes(color[0])) { //If bird does not contain color, remove it
						finalBirds.delete(bird._id.toString());
						break;
					} else { //The further away the listed color intensity is from the bird's color intensity, the more the bird's accuracy index reduces
						colorOccurrences = occurrencesByArray(bird.colors).get(color[0]) || 0; //Either stores number of times color appears in bird, or 0 if it does not appear at all
						finalBirds.set(bird._id.toString(), (finalBirds.get(bird._id.toString())/(1+(0.1*Math.abs(color[1] - colorOccurrences)))));
					}
				}
	  		}
		}
		
		//Eliminate birds that fall below a standard deviation of similarity
		let birdMatrix = await parsePropertyArray(mapToMatrix(finalBirds), 1);
		for (let bird of finalBirds) {
			if (math.mean(birdMatrix) - bird[1] > math.std(birdMatrix)) {
				finalBirds.delete(bird[0]);
			}
		}

		//Convert all bird IDs to full objects
		let populatedBird;
		for (let bird of finalBirds) {
	  		populatedBird = await Bird.findById(bird[0]);
	  		if (!populatedBird) {
				req.flash("error", "An error occurred");
				return res.redirect("back");
	  		}
	  		sorted.push(populatedBird);
		}

		//Find any keywords to further help narrow down identification
		const textSplitter = new RegExp(/[\"-\s\'\r\n]/, 'g'); //Splitting delimters between phrases
		const delimeter = new RegExp(/[^a-zA-z0-9]/, 'g'); //Characters that can distort word nature
		let searchExpressions = [];
		for (let word of filter(req.body.keywords).split(textSplitter)) { //Parse out words from full phrase
			if (!['', ' '].includes(word) && word.length > 3) { //Ignore spaces
				searchExpressions.push(word.toLowerCase().split(delimeter).join(''));
			}
		}

		//Iterate through sorted birds and update their match rankings based on keyword similarity match
		for (let i = 0; i < sorted.length; i++) {
			for (let attr of attrs) {
				if (typeof sorted[i][attr] == 'string') { //If the attribute is a string, add the value directly to the 'data String'
				for (let word of filter(sorted[i][attr].toLowerCase()).split(delimeter)) { //Remove filler words to decrease search complexity
					innerLoop:
					for (let keyword of searchExpressions) {
						if (word.includes(keyword) && identifyValues.has(attr)) {
							finalBirds.set(sorted[i]._id.toString(), finalBirds.get(sorted[i]._id.toString()) * identifyValues.get(attr));
							break innerLoop;
						}
					}
				}
			
				} else { //If the attribute is an array, add each value inside the array to the data String
					for (let wordset of sorted[i][attr]) {
						for (let word of filter(wordset.toLowerCase()).split(delimeter)) { //Remove filler words to decrease search complexity
							innerLoop:
							for (let keyword of searchExpressions) {
								if (word.includes(keyword) && identifyValues.has(attr)) {
									finalBirds.set(sorted[i]._id.toString(), finalBirds.get(sorted[i]._id.toString()) * identifyValues.get(attr));
									break innerLoop;
								}
							}
						}
					}
				}
			}
		}
		
		//Bubblesort algorithm sorts based on which bird has the highest similarity to entered data
		for (let i = 0; i < sorted.length; i ++) {
			for (let j = 0; j < sorted.length-1; j++) {
				if (finalBirds.get(sorted[j]._id.toString()) < finalBirds.get(sorted[j+1]._id.toString())) {
					[sorted[j], sorted[j+1]] = [sorted[j+1], sorted[j]];
				}
			}
		}

		return res.render('results', {info: false, birds: sorted, birdMap: finalBirds, from: 'data'});
	}
	req.flash("error", "You must enter at least one color");
	return res.redirect('back');
}

controller.contact = function(req, res) { //Display contact information (static)
	return res.render('contact', {info: false});
}

controller.showBird = async function(req, res) { //Display bird profile
	const bird = await Bird.findById(req.params.id);
	if (!bird) {
		req.flash('error', "Bird not found");
		return res.redirect("back");
	}
	return res.render('index', {info: true, bird, similar: []});
}

controller.updateBird = async function(req, res) { //Create bird update request with form data
	let finalHabitats = [];
	for (let habitat of habitats) { //Update habitats based on form
		if (req.body[habitat] == 'on') {
			finalHabitats.push(habitat);
		}
	}
	
	let finalColors = []; //Update colors based on form
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
	
	const request = await UpdateRequest.create({ //Create update request with new bird data
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