const isContained = function(reference, compareTo, matrix) { //Checks if matrix contains the same two chars in any row
    for (let row of matrix) {
        if (row.includes(reference) && row.includes(compareTo)) { //If row includes both
            return true;
        }
    }
    return false;
}

const count = function(phrase, char) { //Count the occurrences of a character in a phrase
    let count = 0;
    for (let i = 0; i < phrase.length; i++) { //Iterate through phrase and look for instances of character
        if (phrase.charAt(i) == char) {count ++;}
    }
    return count;
}

const compareSimilarity = function(a, b) { //Compares two phrases to analyze character similarity
    const startSimilar = [ //Stores similar character starts to reduce distinction between starting characters
        ['s', 'c', 'x', 'z'],
        ['k', 'c', 'q'],
        ['f', 'p', 'v'],
        ['i', 'y'],
        ['a', 'e'],
        ['o', 'u'],
        ['g', 'j']
    ];

    const charsets = [ //Stores similar character sets to reduce distinction between sets
        ['a', 'e', 'i', 'o', 'u', 'y'],
        ['q', 'w', 'e', 'r', 't', 'y'],
        ['a', 's', 'd', 'f', 'g', 'h'],
        ['z', 'x', 'c', 'v', 'b', 'n']
    ];

    let similarity = (100 - 5*Math.abs(a.length - b.length)); //Current similarity (100 minus 5 * the difference in lengths)
    let shorter; //Decide shorter array for comparison iteration
    if (a.length < b.length) {shorter = a} else { shorter = b;}

    let counter = 0;
    let innerCount = 0;
    let charsetOverlap = false;
    let difference;

    while (counter < shorter.length) { //Iterate through smaller array and compare to larger
        charsetOverlap = false;
        if (a[counter] != b[counter]) { //If the two characters at the given point are not similar
            if (counter == 0 && !isContained(a[counter], b[counter], startSimilar)) {
                similarity -= 10*(a.length-counter);
            } else {
                similarity -= 2*(a.length-counter);
            }
            
            [difference, innerCount] = [a.length, 0];
            for(let charset of charsets) { //Check if there is any specified similarity between the two characters
                if (isContained(a[counter], b[counter], charset)) {
                    difference = 1; //Reduces difference factor in this case
                    break;
                }
            }

            if (!charsetOverlap) { //If there is no overlap, search for occurrences of b[counter] in a to find the smallest difference in index position
                while (innerCount < a.length) {
                    if (a[innerCount] == b[counter] && Math.abs(innerCount - counter) < difference) { //If the two positions are the same, and the difference in position is less than the currently specified difference
                        difference = Math.abs(innerCount - counter)
                    }
                    innerCount ++; //Increment
                }
            }
            //Subtract the difference in position, as well as the difference in character occurrence, from the similarity score
            similarity -= (((12/a.length) * difference) + ((9/a.length) * Math.abs(count(a, b[counter]) - count(b, b[counter]))));
        }
        counter ++; //Increment
    }
    return similarity;
}

module.exports = {compareSimilarity};