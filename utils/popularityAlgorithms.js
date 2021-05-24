// Takes an array of objects and outputs the average popularity coefficient (likes per day)
const getPopularityCoefficiant = function(objects, likeFactor, dateFactor) {
    const now = new Date().getTime();
    const rate = 86400; //Rate of conversion is seconds to days
    let popularityCoefficiant = 0;
    for (let object of objects) {
        //Check datatype of likeFactor (can be a list of likes or a uniform int)
        if (typeof object[likeFactor] == "number") {
            popularityCoefficiant += ((rate * object[likeFactor]) / (now - object[dateFactor].getTime())) / objects.length;
        } else {
            popularityCoefficiant += ((rate * object[likeFactor].length) / (now - object[dateFactor].getTime())) / objects.length;
        }
    }
    return popularityCoefficiant;
}

const sortByPopularity = function(objects, likeFactor, dateFactor, fields) { //Sort objects by popularity coefficiant
    let sorted = {popular: [], unpopular: []}; //Object holds both popular and unpopular items

    for (let i = 0; i < objects.length - 1; i++) { //Sort objects by order of popularity coefficiant
        for (let j = 0; j < objects.length - 1; j++) {
            if (getPopularityCoefficiant([objects[j]], likeFactor, dateFactor) < getPopularityCoefficiant([objects[j + 1]], likeFactor, dateFactor)) {
                [objects[j], objects[j+1]] = [objects[j + 1], objects[j]];
            }
        }
    }

    for (let object of objects) { //Uses popularity coefficiant to sort objects into popular and unpopular
        if (getPopularityCoefficiant([object], likeFactor, dateFactor) >= getPopularityCoefficiant(objects, likeFactor, dateFactor)) {
            sorted.popular.push(object);
        } else {
            sorted.unpopular.push(object);
        }
    }

    if (fields) { //If function includes specific fields as params
        let sortedByField = {popular: [], unpopular: []};
        for (let category in sorted) {
            for (let object of sorted[category]) {
                for (let field in object) {
                    if (fields.includes(field)) {
                        sortedByField[category].push(object[field]);
                    }
                }
            }
        }
        return sortedByField;
    }
    return sorted;
}

const equateObjects = function(objects, property) { //Find overlapping objects, based on the equality of one array property
    let sortedObjects = new Map();
    let sortedMatrix = [];

    for (let object of objects) { //Runs comparison on "sorted" objects to search for occurrences
        if (sortedObjects.has(object[property].sort().toString())) {
            sortedObjects.set(object[property].sort().toString(), sortedObjects.get(object[property].sort().toString())+1);
        } else {
            sortedObjects.set(object[property].sort().toString(), 1);
        }
    }

    for (let object of sortedObjects) { //Pushes objects into array with date to be sorted by "popularity"
        sortedMatrix.push({
            objects: object[0].split(','),
            instances: object[1],
            date: new Date()
        });
    }

    return sortByPopularity(sortedMatrix, "instances", "date").popular; //Sorts object array
}

module.exports = {getPopularityCoefficiant, sortByPopularity, equateObjects};
