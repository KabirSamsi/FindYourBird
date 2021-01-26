//LIBRARIES
const express = require('express');
const router = express.Router();

router.get('/search', (req, res) => {
  res.render('tutorial', {birdInfo: false, field: "search"});
});

router.get('/identify', (req, res) => {
  res.render('tutorial', {birdInfo: false, field: "identify"});
});

router.get('/add', (req, res) => {
  res.render('tutorial', {birdInfo: false, field: "add"});
});

router.get('/edit', (req, res) => {
  res.render('tutorial', {birdInfo: false, field: "edit"});
});

router.get('/gallery', (req, res) => {
  res.render('tutorial', {birdInfo: false, field: "gallery"});
});

module.exports = router;
