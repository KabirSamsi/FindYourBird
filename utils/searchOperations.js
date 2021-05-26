//Search operations are utilized in bird keyword search
const filter = require("../utils/filter");

const isInMap = function(subArr, data) { //Check that all elements of array are inside map
	for (let item of subArr) {
		if (!data.has(item)) {return false;}
	}
	return true;
}

const occurrencesByMap = function(subArr, data) { //Check for occurrences per map of each array element
	let occurrences = 0;
	for (let i = 0; i < subArr.length; i ++) {
		if (subArr.indexOf(subArr[i]) == i) { //Ensures that the same search query is not repeated
			occurrences += data.get(subArr[i]);
		}
	}
	return occurrences;
}

const isInString = function(subArr, data) { //Check that all elements of array are inside string
	for (let item of subArr) {
		if (!data.includes(item)) {return false;}
	}
	return true;
}

const occurrencesByString = function(subArr, data) { //Check for occurrences per string of each array element
	let occurrences = 0;
	for (let i = 0; i < subArr.length; i ++) {
		for (let word of filter(data).split(' ')) {
			if (word.includes(subArr[i]) && subArr.indexOf(subArr[i]) == i) { //Ensures that the same search query is not repeated
				occurrences ++;
			}
		}
	}
	return occurrences;
}

const occurrencesByArray = function(arr) { //Take an array and return how many times each element occurs in it
	let results = new Map(); //Stores each element and its occurrences
	for (let element of arr) {
		if (results.has(element)) {
			results.set(element, results.get(element) + 1);
		} else {
			results.set(element, 1);
		}
	}
	return results;
}

module.exports = {isInMap, occurrencesByMap, isInString, occurrencesByString, occurrencesByArray};
