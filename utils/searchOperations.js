//Search operations are utilized in bird keyword search
const filter = require("../utils/filter");
const package = {};

package.isInMap = function(subArr, data) { //Check that all elements of array are inside map
	for (let item of subArr) {
		if (!data.has(item)) {return false;}
	}
	return true;
}

package.occurrencesByMap = function(subArr, data) { //Check for occurrences per map of each array element
	let occurrences = 0;
	for (let i = 0; i < subArr.length; i ++) {
		if (subArr.indexOf(subArr[i]) == i) { //Ensures that the same search query is not repeated
			occurrences += data.get(subArr[i]);
		}
	}
	return occurrences;
}

package.isInString = function(subArr, data) { //Check that all elements of array are inside string
	for (let item of subArr) {
		if (!data.includes(item)) {return false;}
	}
	return true;
}

package.occurrencesByString = function(subArr, data) { //Check for occurrences per string of each array element
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

package.parsePropertyArray = function(arr, property) { //Takes an array of objects and returns an array of those specific properties
	let results = [];
	for (let item of arr) {
		results.push(item[property]);
	}
	return results;
}

package.objectArrIndex = function(arr, property, key, subproperty, caseInsensitive) { //Check if an object which includes a certain property contains a key in that property
    for (let i = 0; i < arr.length; i ++) {
        if (subproperty) { //If a subproperty needs to be evaluated
            if (caseInsensitive) { //If case insensitive
                if (arr[i][property][subproperty].toString().toLowerCase() == key.toString().toLowerCase()) {return i;} //Check equality with property and subproperty    
            }
            if (arr[i][property][subproperty].toString() == key.toString()) {return i;} //Check equality with property and subproperty
        }
        if (caseInsensitive) {
            if (arr[i][property].toString().toLowerCase() == key.toString().toLowerCase()) {return i;}
        }
        if (arr[i][property].toString() == key.toString()) {return i;} //Otherwise, check equality with just property
    }
    return -1; //If no result is found, return -1 (like a regular array)
}

package.mapToMatrix = function(map) {
	matrix = [];
	for (let element of map) {
		matrix.push(element);
	}
	return matrix;
}

package.occurrencesByArray = function(arr) { //Take an array and return how many times each element occurs in it
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

package.lastElement = function(arr, index) {
	return arr[arr.length+index];
}

package. removeIfIncluded = function(arr, element, property) {
    if (property) { //If a specific property in the element needs to be evaluated, evaluate element's property
        if (package.objectArrIndex(arr, property, element) > -1) {
            arr.splice(package.objectArrIndex(arr, property, element), 1);
            return true;
        }
        return false;
    } else { //If no specific property is listed, evaluate element's exact value
        if (arr.includes(element)) {
            arr.splice(arr.indexOf(element), 1);
            return true;
       }
       return false;
    }
}

module.exports = package;
