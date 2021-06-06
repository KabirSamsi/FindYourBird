//LIBRARIES
const express = require('express');
const router = express.Router();
const tutorial = require("../controllers/tutorial");

//ROUTES
router.get('/home', tutorial.home);
router.get('/search', tutorial.search);
router.get('/identify', tutorial.identify);
router.get('/add', tutorial.add);
router.get('/edit', tutorial.edit);
router.get('/gallery', tutorial.gallery);

module.exports = router;
