const count = function(phrase, char) { //Count the occurrences of a character in a phrase
    let count = 0;
    for (let i = 0; i < phrase.length; i++) { //Iterate through phrase and look for instances of character
        if (phrase.charAt(i) == char) {count ++;}
    }
    return count;
}

const compareSimilarity = function(a, b) { //Compares two phrases to analyze character similarity
    const charsets = [ //Stores similar character sets to reduce distinction between sets
        ['a', 'e', 'i', 'o', 'u', 'y'],
        ['q', 'w', 'e', 'r', 't', 'y'],
        ['a', 's', 'd', 'f', 'g', 'h'],
        ['z', 'x', 'c', 'v', 'b', 'n']
    ];

    let similarity = (100 - 5*Math.abs(a.length - b.length)); //Current similarity (100 minus 5 * the difference in lengths)
    //Decide shorter array for comparison iteration
    let shorter;
    if (a.length < b.length) {shorter = a} else { shorter = b;}

    let counter = 0;
    let innerCount = 0;
    let charsetOverlap = false;
    let difference;

    while (counter < shorter.length) { //Iterate through smaller array and compare to larger
        charsetOverlap = false;
        if (a[counter] != b[counter]) { //If the two characters at the given point are not identical
            if (counter == 0) {
                similarity -= (10*(a.length-counter));
            } else {
                similarity -= (2*(a.length-counter));
            }
            innerCount = 0;
            difference = a.length;

            for(let charset of charsets) { //Check if there is any specified similarity between the two characters
                if (charset.includes(a[counter]) && charset.includes(b[counter])) {
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
            similarity -= (3 * difference + 2 * Math.abs(count(a, b[counter]) - count(b, b[counter])));
        }
        counter ++; //Increment
    }
    return similarity;
}

module.exports = {compareSimilarity};