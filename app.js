//Libraries
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const flash = require('connect-flash');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const fs = require('fs')
const methodOverride = require('method-override');
const session = require('express-session');

const http = require('http').createServer(app);

//Schema
const Bird = require('./models/bird');
const AddRequest = require('./models/addRequest');
const DeleteRequest = require('./models/deleteRequest');
const UpdateRequest = require('./models/updateRequest');

//Access gallery and Request Routes
const galleryRoutes = require('./routes/gallery');
const requestRoutes = require('./routes/requests');

//Connect to database
// mongoose.connect('mongodb+srv://dbUser:dbUserPassword@cluster0.h3f4r.mongodb.net/FindYourBirdDemo?retryWrites=true&w=majority', {
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dbUser:dbUserPassword@cluster0.h3f4r.mongodb.net/FindYourBirdDemo?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected!')
})

//Set up libraries
app.use(express.static(__dirname + "/public")); //Sets all styles/js/media to /public
app.set('views', __dirname + '/Views'); //Sets all html(EJS) files to Views
app.set('view engine', "ejs") //Sets view engine to EJS
app.use(bodyParser.urlencoded({extended: true})) //Allows us to read info from EJS pages
app.use(cookieParser()) //Read cookie data
app.use(methodOverride('_method')); //Allows us to use PUT and DELETE
app.use(flash()); //Flash messages to the screen

app.use(session({ //Set up req flashing
  cookie: {
    maxAge: 86400000
  },
  secret: "Birding is awesome",
  resave: false,
  saveUninitialized: false
}));

app.use(function(req, res, next) { //Setting up flash messages
  // flash message stuff
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

//Initalize Gallery and Request Routes

app.use('/gallery', galleryRoutes);
app.use('/request', requestRoutes);

//ROUTES
app.get('/', (req, res) => { //Render index page
  res.render('index', {birdInfo: false, search: null});
})

app.post('/search', (req, res) => { //Route to search for a bird

  if (req.body.name != '') {

    let resultMatrix = [] //Hold info about each bird that matches search, and the number of times the search shows up in its info
    let results = []; //Hold info about each matching bird
    let searchRegExp = new RegExp(req.body.name.toLowerCase().replace(/[^a-zA-z0-9]/g, ""), 'g'); //Stores user search as a regular expression

    Bird.find({}, (err, foundBirds) => {
      if (err || !foundBirds) {
        console.log(err)
        req.flash('error', "Unable to access database");
        res.redirect('back')

      } else {

        let dataString; //temporary data string for each bird

        for (let bird of foundBirds) {
          dataString = ""
          for (let attr of ['name', 'description', 'appearance', 'diet', 'habitat', 'range', 'size', 'colors']) {
            if (typeof bird[attr] == 'string') { //If the attribute is a string, add the value directly to the 'data String'
              dataString += bird[attr].toLowerCase()
              dataString += " "

            } else { //If the attribute is an array, add each value inside the array to the data String
              for (let i of bird[attr]) {
                dataString += i.toLowerCase()
                dataString += " "
              }
            }
          }

          if( ((dataString.replace(/[^a-zA-z0-9]/g, "").match(searchRegExp) || []).length) > 0) { //If we can find the search inside any bird's info, add it to the list
            resultMatrix.push([bird, ((dataString.replace(/[^a-zA-z0-9]/g, "").match(searchRegExp) || []).length)])
          }
        }

        //Sort matrix through iteration (by having the most occurring search)

        let temp;
        for (let i = 0; i < resultMatrix.length; i +=1) {
          for (let j = 0; j < resultMatrix.length - 1; j += 1) {
            if (resultMatrix[j][1] > resultMatrix[j+1][1]) {
              temp = resultMatrix[j+1]
              resultMatrix[j+1] = resultMatrix[j]
              resultMatrix[j] = temp
            }
          }
        }

        for (let r of resultMatrix) { //Push birds of sorted matrix to results list, without corresponding regex values
          results.push(r[0])
        }

        res.render('results', {birdInfo: false, birds: results.reverse(), from: 'search'})

      }
    })

  } else {
    res.render('results', {birdInfo: false, birds: [], from: 'search'})
  }
})

app.get('/new', (req, res) => { //Route to access 'new bird' page
  // res.redirect('/')
  res.render('new', {birdInfo: false, colors:['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink'], sizes: ['Hummingbird Size (2-4 inches)', 'Songbird Size (5-9 inches)', 'Large Songbird Size (10-13 inches)', 'Crow Size (1-1.5 feet)', 'Raptor Size (1.5-2.5 feet)', 'Waterfowl Size (2-4 feet)'], habitats: ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies'] });
})

app.post('/', (req, res) => { //Create new bird

  (async() => {

    let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']; //Find out list of habitats based on what was checked
    let finalHabitats = [];
    for (let habitat of habitats) {
      if (req.body[habitat] == 'on') {
        finalHabitats.push(habitat);
      }
    }

    let colors = ['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink']; //Find out list of colors based on what was checked
    let finalColors = [];
    for (let color of colors) {
      if (req.body[color] == 'on') {
        finalColors.push(color);
      }
    }

    const requestOverlap = await AddRequest.find({name: req.body.name});
    if (!requestOverlap) {
      console.log('error');
      req.flash('error', "Unable to access database");
      return res.redirect('back');
    }

    if (requestOverlap.length > 0) {
      req.flash('error', "Bird is already a pending add request")
      return res.redirect('back')

    }

    const birdOverlap = await Bird.find({name: req.body.name});

    if (!birdOverlap) {
      console.log('error')
      req.flash('error', "Error accessing list of birds");
      return res.redirect('back')
    }

    if (birdOverlap.length > 0) {
      req.flash('error', "Bird is already in database")
      return res.redirect('back')
    }

    const request = await AddRequest.create({name: req.body.name, img: [req.body.img, req.body.citation], description: req.body.description, appearance: req.body.appearance, diet: req.body.diet.split(','), habitat: finalHabitats, range: req.body.range, gallery: [req.body.img, req.body.citation], size: req.body.size, colors: finalColors});

    if (!request) {
      console.log('error')
      req.flash('error', "Error accessing your request");
      return res.redirect('back')
    }

    req.flash('success', "Thank you for adding a bird! Please wait a few days for the admin to verify and accept bird")
    res.redirect('/');

  })().catch(err => {
    console.log(err)
    req.flash('error', "Unable to access database");
    res.redirect('back')
  })
})

app.get('/edit/:id', (req, res) => { //Edit bird info
  Bird.findById(req.params.id, (err, foundBird) => {
    if (err || !foundBird) {
      console.log(err);
      req.flash('error', "Unable to find bird");
    } else {
      res.render('edit', {birdInfo: false, bird: foundBird, colors:['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink'], sizes: ['Hummingbird Size (2-4 inches)', 'Songbird Size (5-9 inches)', 'Large Songbird Size (10-13 inches)', 'Crow Size (1-1.5 feet)', 'Raptor Size (1.5-2.5 feet)', 'Waterfowl Size (2-4 feet)'], habitats: ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']});
    }
  })
})

app.get('/identify', (req, res) => { //Route to render bird identification page
  let colors = ['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink'];
  let habitats = ['Urban/Suburban Area', 'Grassland', 'Tundra', 'Forest', 'Mountain', 'Coastal Area', 'Desert', 'Swamp/Marsh', 'Freshwater Body'];
  let sizes = ['Hummingbird Size (2-4 inches)', 'Songbird Size (5-9 inches)', 'Large Songbird Size (10-13 inches)', 'Crow Size (1-1.5 feet)', 'Raptor Size (1.5-2.5 feet)', 'Waterfowl Size (2-4 feet)'];
  res.render('identify', {birdInfo: false, colors, habitats, sizes});
})

app.post('/identify', (req, res) => { //Calculate birds which match identification
  let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies'];

  Bird.find({size: req.body.size}, (err, foundBirds) => {
    let birdList = [];
    let final = [];

    for (let bird of foundBirds) {
      if (bird.habitat.includes(habitats[req.body.habitat])) {
        birdList.push(bird);
      }
    }

    if (req.body.color) { //A color is selected
      for (let bird of birdList) {
        let include = true; //Whether to be included or not

        if (typeof req.body.color == 'string') {
          if (!bird.colors.includes(req.body.color)) {
            include = false;
          }

        } else {
          for (let color of req.body.color) {
            if (!bird.colors.includes(color)) {
              include = false;
              break;
            }
          }
        }

        if (include) {
          final.push(bird);
        }
      }

      res.render('results', {birdInfo: false, birds: final, from: 'data'});

    } else { //No color is selected
        res.render('results', {birdInfo: false, birds: birdList, from: 'data'});
    }
  })
})

app.get('/contact', (req, res) => { //Contact info
  res.render('contact', {birdInfo: false})
})

app.get('/:id', (req, res) => { //Display bird based on ID
  Bird.findById(req.params.id, (err, foundBird) => {
    if (err || !foundBird) {
      req.flash('error', "Unable to find bird");
      console.log(err);

    } else {
      res.render('index', {birdInfo: true, bird: foundBird});
    }
  })
})

app.put('/:id', (req, res) => { //Update bird info

  (async() => {
    let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies'];

    let finalHabitats = [];
    for (let habitat of habitats) {
      if (req.body[habitat] == 'on') {
        finalHabitats.push(habitat);
      }
    }

    let colors = ['Black', 'White', 'Brown', 'Grey', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink']; //Find out list of colors based on what was checked

    let finalColors = [];
    for (let color of colors) {
      if (req.body[color] == 'on') {
        finalColors.push(color);
      }
    }

    const bird = await Bird.findById(req.params.id);

    if (!bird) {
      req.flash('error', "Unable to find bird");
      return res.redirect('back')
    }

    const request = await UpdateRequest.create({bird: bird, description: req.body.description, appearance: req.body.appearance, diet: req.body.diet.split(', '), habitat: finalHabitats, range: req.body.range, size: req.body.size, colors: finalColors, version: 'bird'});

    if (!request) {
      req.flash('error', "Unable to create update request");
      return res.redirect('back');
    }
    // Bird.findByIdAndUpdate(req.params.id, {name: req.body.name, description: req.body.description, appearance: req.body.appearance, diet: req.body.diet.split(', '), habitat: finalHabitats, range: req.body.range, size: req.body.size, colors: finalColors}, (err, bird) => {

      // if (err || !bird) {
      //   console.log(err)
      //   req.flash('error', "Unable to find bird");
      //   res.redirect('back')
      //
      // } else {

    let overlap = false

    for (let img of bird.gallery) {
      if (img[0] == req.body.img && img[0] != bird.img[0]) {
        overlap = true;
        break;
      }
    }

    if (overlap) {
      req.flash('error', "Image already in bird gallery. Either delete image from gallery or choose a different image")
      res.redirect('back')


    } else {
      request.img = [req.body.img, req.body.citation]
      let tempGall = [] //Cannot modify specific aspects of the array by itself, need to modify the entire array, so using temporary Gallery
      tempGall.push([req.body.img, req.body.citation])


      for (let img of bird.gallery.slice(1)) {
        tempGall.push(img)
      }

      request.gallery = tempGall
      request.save();
      req.flash('success', "Bird Updates Sent to Admin! Please wait a few days for the admin to verify and accept changes")
      res.redirect(`/${bird._id}`);

    }

  })().catch(err => {
    console.log(err)
    req.flash('error', "Unable to access database")
    res.redirect('back')
  })
})

// app.delete('/:id', (req, res) => {
//   (async() => {
//     const bird = await Bird.findById(req.params.id);
//     if (!bird)  {
//       console.log('error')
//       req.flash('error', "Unable to access bird")
//       return res.redirect('back')
//     }
//
//     const request = await DeleteRequest.create({bird: bird});
//
//     if (!request) {
//       console.log('error')
//       req.flash('error', "Unable to access bird")
//       return res.redirect('back')
//     }
//
//     res.redirect('/')
//
//   })().catch(err => {
//     console.log(err)
//     req.flash('error', "Unable to access bird")
//     res.redirect('back')
//   });
// })

//Runs server
let port = process.env.PORT || 3000;

http.listen(port,process.env.IP, () => {
	console.log(":: App listening on port " + port + " ::");
});

module.exports = app;
