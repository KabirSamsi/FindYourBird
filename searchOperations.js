const filter = require("./filter");

const isInMap = function(subArr, data) {
  for (let item of subArr) {
    if (!data.has(item)) {
      return false;
    }
  }
  return true;
}

const occurrencesByMap = function(subArr, data) {
  let occurrences = 0;
  for (let i = 0; i < subArr.length; i ++) {
    if (subArr.indexOf(subArr[i]) == i) { //Ensures that the same search query is not repeated
      occurrences += data.get(subArr[i]);
    }
  }
  return occurrences;
}

const isInString = function(subArr, data) {
  for (let item of subArr) {
    if (!data.includes(item)) {
      return false;
    }
  }
  return true;
}

const occurrencesByString = function(subArr, data) {
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

module.exports = {isInMap, occurrencesByMap, isInString, occurrencesByString};
