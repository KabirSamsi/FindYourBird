//LIBRARIES
const filter = require("../utils/filter");
const {isInMap, occurrencesByMap, isInString, occurrencesByString} = require("../utils/searchOperations");
const {attrs, values} = require("../utils/fields");

const keywordSearch = async function(query, Schema) {
    let resultMatrix = []; //Hold info about each object that matches search, and the number of times the search shows up in its info
	let results = []; //Hold info about each matching object
	const textSplitter = new RegExp(/[\"-\s\'\r\n]/, 'g'); //Splitting delimters between phrases
	const delimeter = new RegExp(/[^a-zA-z0-9]/, 'g'); //Characters that can distort word nature
	
	let searchExpressions = [];
	for (let word of filter(query).split(textSplitter)) { //Parse out words from full phrase
		if (!['', ' '].includes(word)) { //Ignore spaces
			searchExpressions.push(word.toLowerCase().split(delimeter).join(''));
		}
	}

	for (let i = searchExpressions.length-1; i >= 0; i--) { //Double check with within-word regex (non-ascii keywords can still pass filter)
		if (searchExpressions[i].split(delimeter).join('') == '' || searchExpressions[i].length < 4) {
			searchExpressions.splice(i, 1);
		}
	}
	
    //If no results are matched
	if (searchExpressions.length == 0) {
		return {error: "Please enter a more specific search"};
	}
	
	const objects = await Schema.find({});
	if (!objects) {return {error: "Unable to access database"};}
	
	let data = new Map(); //Tracks occurrences of whole words in objects' data
	let dataString = ""; //Tracks occurrences of partial words in objects' data
	
	for (let object of objects) {
		for (let item of data) {data.delete(item[0]);} //Refresh data after eeach iteration
		dataString = "";
		
		for (let attr of attrs) {
			if (typeof object[attr] == 'string') { //If the attribute is a string, add the value directly to the 'data String'
			for (let word of filter(object[attr].toLowerCase()).split(delimeter)) { //Remove filler words to decrease search complexity
				dataString += `${word} `;
				if (data.has(word)) {data.set(word, data.get(word) + values.get(attr)); //Weights result based on where keywords appear
				} else {data.set(word, values.get(attr));}
			}
		
			} else { //If the attribute is an array, add each value inside the array to the data String
				for (let i of object[attr]) {
					for (let word of filter(i.toLowerCase()).split(delimeter)) { //Remove filler words to decrease search complexity
						dataString += `${word} `;
						if (data.has(word)) {data.set(word, data.get(word) + values.get(attr));
						} else {data.set(word, values.get(attr));}
					}
				}
			}
		}
	
		//Evalautes both options and so captures both out-of-order strings (with the map) and partial strings (with the string)
		if (isInMap(searchExpressions, data)) {
			resultMatrix.push([object, occurrencesByMap(searchExpressions, data)]);
		
		} else if (isInString(searchExpressions, dataString)) {
			resultMatrix.push([object, occurrencesByString(searchExpressions, dataString)]);
		}
	}
	
	//Matrix bubblesort (by having the most search occurrences)
	for (let i = 0; i < resultMatrix.length; i +=1) {
		for (let j = 0; j < resultMatrix.length - 1; j += 1) {
			if (resultMatrix[j][1] > resultMatrix[j+1][1]) {
				[resultMatrix[j], resultMatrix[j+1]] = [resultMatrix[j+1], resultMatrix[j]]
			}
		}
	}
	
	let resultMap = new Map();
	for (let r of resultMatrix) { //Push objects of sorted matrix to results list, without corresponding regex values
		results.push(r[0]);
		resultMap.set(r[0]._id.toString(), r[1]);
	}
	return {info: false, resultMap, birds: results.reverse(), from: 'search', search: query, perfectMatch: values.get("name"), similarResults: false};
}

module.exports = {keywordSearch};