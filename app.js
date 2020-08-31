const express = require('express')
const app = express()
const body_parser = require('body-parser')
const cookie_parser = require('cookie-parser')
const fs = require('fs')
const mongoose = require('mongoose');
const http = require('http').createServer(app);

//Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dbUser:dbUserPassword@cluster0.h3f4r.mongodb.net/FindYourBird?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected!')
})

app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/Views');
app.set('view engine', "ejs")
app.use(body_parser.urlencoded({extended: false}))
app.use(cookie_parser())

const Bird = require('./models/bird');

app.get('/', (req, res) => {
  res.render('index', {bird_info: false})
})

//Route to search for a bird
app.post('/search', (req, res) => {

  if (req.body.button == 'Search') { //Action if 'search' button pressed

    Bird.find({}, (err, foundBirds) => {
      if (err || !foundBirds) {
        req.flash("Unable to access database")
        res.redirect('/')

      } else {
        let final = null //Search data
        for (let bird of foundBirds) {
          if (bird.name.toLowerCase() == req.body.name.toLowerCase()) {
            final = bird
          }
        }

        if (final == null) {
          res.render('index', {bird_info: false})
        } else {
          res.cookie('bird_search', final) //Cookie stores info about bird searched
          res.render('index', {bird_info: true, bird: final})
        }
      }
    })

  } else { //Action if 'edit' button pressed
    res.render('edit', {bird: req.cookies['bird_search'], sizes: ['Hummingbird Size', 'Songbird Size', 'Large Songbird Size', 'Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size'], habitats: ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']}) //Allow user to edit bird info, based on cookie data

  }
})

app.post('/edit_bird', (req, res) => {
  let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']
  let final_habitats = []
  for (let habitat of habitats) {
    if (req.body[habitats.indexOf(habitat)] == 'on') {
      final_habitats.push(habitat)
    }
  }

  Bird.findByIdAndUpdate(req.cookies['bird_search']._id, {name: req.body.name, img: req.body.img, description: req.body.description, appearance: req.body.appearance, diet: req.body.diet.split(','), habitat: final_habitats, range: req.body.range, gallery: [req.body.img], size: req.body.size, colors: req.body.colors.split(',')}, (err, bird) => {
    bird.save()
    res.render('index', {bird_info: true, bird})
  })
})

//Route to access 'add bird' page
app.get('/add', (req, res) => {
  res.render('add_bird', {sizes: ['Hummingbird Size', 'Songbird Size', 'Large Songbird Size', 'Crow Size', 'Raptor Size', 'Waterfowl Size', 'Turkey Size'], habitats: ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies'] })
})

//Route to add bird to db
app.post('/add_bird', (req, res) => {
  let habitats = ['Urban/Suburban Areas', 'Grasslands', 'Tundra', 'Forests', 'Mountains', 'Coastal Areas', 'Deserts', 'Swamps and Marshes', 'Freshwater Bodies']
  let final_habitats = []
  for (let habitat of habitats) {
    if (req.body[habitats.indexOf(habitat)] == 'on') {
      final_habitats.push(habitat)
    }
  }

  Bird.create({name: req.body.name, img: req.body.img, description: req.body.description, appearance: req.body.appearance, diet: req.body.diet.split(','), habitat: final_habitats, range: req.body.range, gallery: [req.body.img], size: req.body.size, colors: req.body.colors.split(',')}, (err, bird) => {
    bird.save()
    res.render('index', {bird_info: true, bird})
  })
})

//Runs server
let port = process.env.PORT || 3000

http.listen(port,process.env.IP, () => {
	console.log(":: App listening on port " + port + " ::");
});
