//SCHEMA
const Bird = require('../models/bird');
const GalleryUpdateRequest = require('../models/galleryUpdateRequest');

module.exports.index = function(req, res) {
	return res.redirect('back');
}

module.exports.showGallery = async function(req, res) {
	const bird = await Bird.findById(req.params.id);
	if (!bird) {
    	req.flash('error', "Unable to access bird");
		return res.redirect("back")
	}
	return res.render('gallery', {birdInfo: true, bird});
}

module.exports.updateGallery = async function(req, res) {
	const bird = await Bird.findById(req.params.id);
	if (!bird) {
		req.flash('error', "Error accessing bird");
		return res.redirect('back');
	}
	
	let imageObject = {
		url: req.body.newImg,
		citation: req.body.citation
	};
	
	const request = await GalleryUpdateRequest.create({bird, img: imageObject, imgIndex: null, action: "add"});
	if (!request) {
		req.flash('error', "Error creating add request");
		return res.redirect('back');
	}
	
	req.flash('success', "Add Request Sent! Please wait a few days for the admin to verify and add image ");
	return res.redirect(`/gallery/${bird._id}`);
}

module.exports.removeGallery = async function(req, res) {
	const bird = await Bird.findById(req.params.id);
	if (!bird) {
		req.flash('error', "Error accessing bird");
		return res.redirect('back');
	}
	
	const overlap = await GalleryUpdateRequest.find({action: "delete", imgIndex: req.query.index});
	if (!overlap) {
		req.flash('error', "Error accessing delete requests");
		return res.redirect('back');
	
	} else if (overlap.length > 0) {
		req.flash('error', "A request to delete this image has already been sent");
		return res.redirect('back');
	}
	
	const request = await GalleryUpdateRequest.create({
		bird, img: null,
		imgIndex: req.query.index,
		action: "delete"
	});
	if (!request) {
		req.flash('error', "Error creating delete request");
		return res.redirect('back');
	}
	
	req.flash('success', "Delete Request Sent! Please wait a few days for the admin to verify and delete image ");
	return res.redirect(`/gallery/${bird._id}`);
}
