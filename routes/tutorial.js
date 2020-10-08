//LIBRARIES
const express = require('express');
const app = express()
const cookieParser = require('cookie-parser')
const fs = require('fs')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
var session = require('express-session');
const flash = require('connect-flash');

app.get('/', (req, res) => {
  res.render('../Views/tutorial', {birdInfo: false, field: "none"});
})

app.get('/search', (req, res) => {
  res.render('../Views/tutorial', {birdInfo: false, field: "search"});
})

app.get('/identify', (req, res) => {
  res.render('../Views/tutorial', {birdInfo: false, field: "identify"});
})

app.get('/add', (req, res) => {
  res.render('../Views/tutorial', {birdInfo: false, field: "add"});
})

app.get('/edit', (req, res) => {
  res.render('../Views/tutorial', {birdInfo: false, field: "edit"});
})

app.get('/gallery', (req, res) => {
  res.render('../Views/tutorial', {birdInfo: false, field: "gallery"});
})

module.exports = app;
