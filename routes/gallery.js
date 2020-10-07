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
const Bird = require('../models/bird');
const GalleryUpdateRequest = require('../models/galleryUpdateRequest');

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
      res.render('../Views/gallery', {birdInfo: true, bird: foundBird});
    }
  })
})

app.put('/:id', (req, res) => { //Adds photo to a gallery of a particular bird
  (async() => {
    const bird = await Bird.findById(req.params.id);

    if (!bird) {
      req.flash('error', "Error accessing bird")
      return res.redirect('back')
    }

    const request = await GalleryUpdateRequest.create({bird: bird, img: [req.body.newImg, req.body.citation], imgIndex: null, action: "add"});

    if (!request) {
      req.flash('error', "Error creating add request");
      return res.redirect('back')
    }

    req.flash('success', "Add Request Sent! Please wait a few days for the admin to verify and add image ")
    res.redirect(`/gallery/${bird._id}`)

  })().catch(err => {
    console.log(err)
    req.flash('error', "Unable to access database")
    res.redirect('back')
  })
})

app.delete('/:id', (req, res) => { //Removes photo from the gallery of a particular bird
  // res.redirect('/')

  (async() => {
    const bird = await Bird.findById(req.params.id);

    if (!bird) {
      req.flash('error', "Error accessing bird")
      return res.redirect('back')
    }

    const overlap = await GalleryUpdateRequest.find({action: "delete", imgIndex: req.query.index});

    if (!overlap) {
      req.flash('error', "Error accessing delete requests");
      return res.redirect('back')

    } else if (overlap.length > 0) {
      req.flash('error', "A request to delete this image has already been sent");
      return res.redirect('back')
    }

    const request = await GalleryUpdateRequest.create({bird: bird, img: null, imgIndex: req.query.index, action: "delete"});

    if (!request) {
      req.flash('error', "Error creating delete request");
      return res.redirect('back')
    }

    req.flash('success', "Delete Request Sent! Please wait a few days for the admin to verify and delete image ")
    res.redirect(`/gallery/${bird._id}`)

  })().catch(err => {
    console.log(err)
    req.flash('error', "Unable to access database")
    res.redirect('back')
  })
})

module.exports = app
