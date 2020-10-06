//LIBRARIES
const express = require('express');
const app = express()
const cookieParser = require('cookie-parser')
const fs = require('fs')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
var session = require('express-session');
const flash = require('connect-flash');

//SCHEMA
const Bird = require('./models/bird');
const UpdateRequest = require('./models/updateRequest')

app.get('/', (req, res) => {
  res.redirect('back')
})

//ROUTES
app.get('/:id', (req, res) => { //Display gallery of a particular bird
  Bird.findById(req.params.id, (err, foundBird) => {
    if (err || !foundBird) {
      req.flash('error', "Unable to access bird")
      console.log(err);

    } else {
      res.render('gallery', {birdInfo: true, bird: foundBird});
    }
  })
})

app.put('/:id', (req, res) => { //Adds photo to a gallery of a particular bird
  res.redirect('/')
//   Bird.findById(req.params.id, (err, foundBird) => {
//     if (err || !foundBird) {
//       console.log(err);
//
//     } else if (foundBird.gallery.includes(req.body.newImg)) {
//       console.log('Image already in gallery');
//       res.redirect('back')
//
//     } else {
//       let overlap = false
//
//       for (let img of foundBird.gallery) {
//         if (img[0] == req.body.newImg) {
//           overlap = true;
//           break;
//         }
//       }
//
//       if (!overlap) {
//         foundBird.gallery.push([req.body.newImg, req.body.citation]);
//         foundBird.save();
//
//       } else {
//         console.log("Image already in gallery")
//       }
//
//       res.redirect(`/gallery/${foundBird._id}`);
//     }
//   })
})

app.delete('/:id', (req, res) => { //Removes photo from the gallery of a particular bird
  res.redirect('/')
//   Bird.findById(req.params.id, (err, foundBird) => {
//     if (err || !foundBird) {
//       console.log(err);
//
//     } else {
//       for (let i = 0; i < foundBird.gallery.length; i += 1) {
//         console.log(foundBird.gallery[i])
//         console.log(req.query.url)
//         if (foundBird.gallery[i][0] == req.query.url) {
//           foundBird.gallery.splice(i, 1)
//         }
//       }
//
//       foundBird.save();
//       res.redirect(`/gallery/${foundBird._id}`);
//     }
//   })
})

module.exports = app
