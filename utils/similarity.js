const count = function(phrase, char) {
    let count = 0;
    for (let i = 0; i < phrase.length; i++) {
        if (phrase.charAt(i) == char) {count ++;}
    }
    return count;
}

const compareSimilarity = function(a, b) {
    let similarity = (100 - 5*Math.abs(a.length - b.length));
    let shorter;
    if (a.length < b.length) {shorter = a} else { shorter = b;}

    let counter = 0;
    let innerCount = 0;

    while (counter < shorter.length) {
        if (a[counter] != b[counter]) {
            similarity -= (2*(a.length-counter));
            let innerCount = 0;
            let difference = a.length;

            while (innerCount < a.length) {
                if (a[innerCount] == b[counter] && Math.abs(innerCount - counter) < difference) {
                    difference = Math.abs(innerCount - counter)
                }
                innerCount ++;
            }

            similarity -= (3 * difference + 2 * Math.abs(count(a, b[counter]) - count(b, b[counter])));
        }
        counter ++;
    }
    return similarity;
}

module.exports = {compareSimilarity};