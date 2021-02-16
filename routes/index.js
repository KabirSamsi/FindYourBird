const express = require('express');
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const index = require("../controllers/index");

//ROUTES
router.get('/', index.index); //Render index page
router.get('/new', asyncWrapper(index.new)); //Route to access 'new bird' page
router.get('/edit/:id', asyncWrapper(index.edit)); //Edit bird info
router.get('/identify', index.identifyForm); //Route to render bird identification page
router.get('/contact', index.contact); //Contact info
router.get('/:id', index.showBird);

router.post('/search', asyncWrapper(index.search)); //Route to search for a bird
router.post('/', asyncWrapper(index.create)); //Create new bird
router.post('/identify', asyncWrapper(index.identify)); //Calculate birds which match identification
router.put('/:id', asyncWrapper(index.updateBird)); //Update bird info

module.exports = router;
