//LIBRARIES
const express = require('express');
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const requests = require("../controllers/requests");

//ROUTES
router.get('/newBirdList', asyncWrapper(requests.newBirdList));
router.get('/newBirdShow/:id', asyncWrapper(requests.showNew));
router.get('/acceptNew/:id', asyncWrapper(requests.acceptNew));

router.get('/rejectNew/:id', asyncWrapper(requests.rejectNew));
router.get('/updateBirdList', asyncWrapper(requests.updateBirdList));
router.get('/updateBirdShow/:id', asyncWrapper(requests.updateBirdShow));
router.get('/acceptUpdate/:id', asyncWrapper(requests.acceptUpdate));
router.get('/rejectUpdate/:id', asyncWrapper(requests.rejectUpdate));
router.get('/galleryUpdateList', asyncWrapper(requests.galleryUpdateList));
router.get('/galleryUpdateShow/:id', asyncWrapper(requests.galleryUpdateShow));
router.get('/acceptGalleryUpdate/:id', asyncWrapper(requests.acceptGalleryUpdate));
router.get('/rejectGalleryUpdate/:id', asyncWrapper(requests.rejectGalleryUpdate));

module.exports = router;
