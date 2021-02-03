if(process.env.NODE_ENV !== "production") {
	require('dotenv').config();
}

//Libraries
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const fs = require('fs');
const methodOverride = require('method-override');
const session = require('express-session');
const http = require('http').createServer(app);
const fillers = require('./fillerWords');

//Access gallery, request and tutorial routes
const indexRoutes = require('./routes/index');
const requestRoutes = require('./routes/requests');
const galleryRoutes = require('./routes/gallery');
const tutorialRoutes = require('./routes/tutorial');

//Connect to database
mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//Set up libraries
app.use(express.static(__dirname + "/public")); //Sets all styles/js/media to /public
app.set('view engine', "ejs"); //Sets view engine to EJS
app.set('views', __dirname + '/Views');
app.use(bodyParser.urlencoded({extended: true})); //Allows us to read info from EJS pages
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

//Import other route files
app.use(indexRoutes);
app.use('/request', requestRoutes);
app.use('/gallery', galleryRoutes);
app.use('/tutorial', tutorialRoutes);

// Catch-all route.
app.get('*', (req, res) => {
	res.redirect('/');
});

//Runs server
let port = process.env.PORT || 8000;

http.listen(port,process.env.IP, () => {
	console.log(":: App listening on port " + port + " ::");
});
