module.exports = {
    attrs: ['name', 'description', 'scientificName', 'appearance', 'diet', 'habitat', 'size', 'range', 'colors'],
    colors: ['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink'],
    sizes: ['Hummingbird Size (2-4 inches)', 'Songbird Size (5-9 inches)', 'Large Songbird Size (10-13 inches)', 'Crow Size (1-1.5 feet)', 'Raptor Size (1.5-2.5 feet)', 'Small Waterfowl Size (2.5-4 feet)', 'Large Waterfowl Size (4-5.5 feet)'],
    habitats: ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies'],
    values: new Map([
        ['name', 5],
        ['scientificName', 5],
        ['colors', 4],
        ['size', 4],
        ['appearance', 3],
        ['description', 3],
        ['habitat', 2],
        ['range', 2],
        ['diet', 1]
    ])
};
