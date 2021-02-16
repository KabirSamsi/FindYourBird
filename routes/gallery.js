//LIBRARIES
const express = require('express');
const router = express.Router();
const asyncWrapper = require('../utils/asyncWrapper');
const gallery = require('../controllers/gallery');

//ROUTES
router.get('/', gallery.index); //Index page (redirects automatically)

//Bird-specific routes
router.route('/:id')
  .get(asyncWrapper(gallery.showGallery)) //Display gallery of a particular bird
  .put(asyncWrapper(gallery.updateGallery)) //Update bird's gallery
  .delete(asyncWrapper(gallery.removeGallery)); //Removes photo from the gallery of a particular bird

module.exports = router;
