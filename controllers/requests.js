//SCHEMA
const Bird = require('../models/bird');
const AddRequest = require('../models/addRequest');
const UpdateRequest = require('../models/updateRequest');
const GalleryUpdateRequest = require('../models/galleryUpdateRequest');

if (process.env.NODE_ENV !== "production") {
 require('dotenv').config();
}

module.exports.newBirdList = async function(req, res) {
  if (req.query.pwd == process.env.QUERY_PASSWORD) {
    const requests = await AddRequest.find({});
    if (!requests) {
      req.flash('error', "Unable to access requests");
      return res.redirect('back');
    }

    return res.render('requests', {requests, birdInfo: false, action: 'new'});
  }

  req.flash('error', 'Invalid password');
  return res.redirect('back');
}

module.exports.showNew = async function(req, res) {
  const request = await AddRequest.findById(req.params.id);
  if (!request) {
    req.flash('error', "Unable to access request");
    return res.redirect('back');
  }

  return res.render('showRequest', {birdInfo: true, bird: request, action: 'new'});
}

module.exports.acceptNew = async function(req, res) {
  const request = await AddRequest.findByIdAndDelete(req.params.id);
  if (!request) {
    req.flash('error', "Unable to access request");
    return res.redirect('back');
  }

  const bird = await Bird.create({name: request.name, scientificName: request.scientificName, img: request.img, description: request.description, appearance: request.appearance, diet: request.diet, habitat: request.habitat, range: request.range, gallery: [request.img], size: request.size, colors: request.colors});
  if (!bird) {
    req.flash('error', "Unable to access request");
    return res.redirect('back');
  }

  req.flash('success', "New bird accepted! All users can now see this bird");
  return res.redirect('/');
}

module.exports.rejectNew = async function(req, res) {
  const request = await AddRequest.findByIdAndDelete(req.params.id);
  if (!request) {
    req.flash('error', "Unable to access request");
    return res.redirect('back');
  }

  req.flash('success', "New bird rejected!");
  return res.redirect('/');
}

module.exports.updateBirdList = async function(req, res) {
  if (req.query.pwd == process.env.QUERY_PASSWORD) {
    const requests = await UpdateRequest.find({}).populate('bird');
    if (!requests) {
      req.flash('error', "Unable to access requests");
      return res.redirect('back');
    }

    return res.render('requests', {requests, birdInfo: false, action: 'update'});
  }

  req.flash('error', "Invalid password");
  return res.redirect('back');
}

module.exports.updateBirdShow = async function(req, res) {
  const request = await UpdateRequest.findById(req.params.id).populate('bird');
  if (!request) {
    req.flash('error', "Unable to access request");
    return res.redirect('back');
  }

  return res.render('showRequest', {birdInfo: true, bird: request, action: 'update'});
}

module.exports.acceptUpdate = async function(req, res) {
  let overlap = [];
  const currentReq = await UpdateRequest.findByIdAndDelete(req.params.id).populate('bird');

  let tempBirdData = { //Object stores the bird's info, before it was updated
    description: currentReq.bird.description,
    appearance: currentReq.bird.appearance,
    diet: currentReq.bird.diet,
    habitat: currentReq.bird.habitat,
    range: currentReq.bird.range,
    size: currentReq.bird.size,
    colors: currentReq.bird.colors,
  };

  const bird = await Bird.findByIdAndUpdate(currentReq.bird._id, {description: currentReq.description, appearance: currentReq.appearance, diet: currentReq.diet, habitat: currentReq.habitat, range: currentReq.range, size: currentReq.size, colors: currentReq.colors});
  if (!bird) {
    req.flash('error', "Unable to apply updates to bird");
    return res.redirect('back');
  }

  const requests = await UpdateRequest.find({}).populate('bird');
  if (!requests) {
    req.flash('error', "Unable to find requests");
    return res.redirect('back');
  }

  for (let request of requests) {
    if (request.bird.name == currentReq.bird.name) {
      overlap.push(request);
    }
  }

  for (let request of overlap) {
    for (let attr of ['description', 'appearance', 'diet', 'habitat', 'range', 'size', 'colors']) {

      if (tempBirdData[attr].toString() == request[attr].toString()) {
        request[attr] = currentReq[attr];
      }
    }
    await request.save();
  }

  req.flash('success', "Bird updated! These changes can now be seen by all users");
  return res.redirect('/');
}

module.exports.rejectUpdate = async function(req, res) {
  const request = await UpdateRequest.findByIdAndDelete(req.params.id);
  if (!request) {
    req.flash('error', "Unable to delete update");
    return res.redirect('back');
  }

  req.flash('success', "Update rejected!");
  return res.redirect('/');
}

module.exports.galleryUpdateList = async function(req, res) {
  if (req.query.pwd == process.env.QUERY_PASSWORD) {
    const requests = await GalleryUpdateRequest.find({}).populate('bird');
    if (!requests) {
      req.flash('error', "Unable to access requests");
      return res.redirect('back');
    }

    return res.render('requests', {requests, birdInfo: false, action: 'galleryUpdate'});
  }

  req.flash('error', "Invalid password");
  return res.redirect('back');
}

module.exports.galleryUpdateShow = async function(req, res) {
  const request = await GalleryUpdateRequest.findById(req.params.id).populate('bird');
  if (!request) {
    req.flash('error', "Unable to access request");
    return res.redirect('back');
  }

  return res.render('showGalleryRequest', {birdInfo: false, bird: request});
}

module.exports.acceptGalleryUpdate = async function(req, res) {
  const request = await GalleryUpdateRequest.findByIdAndDelete(req.params.id).populate('bird');

  if (!request) {
    req.flash('error', "Error accessing request");
    return res.redirect('back');
  }

  if (request.action == "add") {
    request.bird.gallery.push(request.img);
    await request.bird.save();
    req.flash('success', "Image added to bird gallery!");

  } else if (request.action == "delete") {
    request.bird.gallery.splice(request.imgIndex, 1);
    await request.bird.save();

    const laterRequests = await GalleryUpdateRequest.find({action: "delete"});//Delete requests with a higher index than ours

    if (!laterRequests) {
      req.flash('error', "Error accessing requests");
      return res.redirect('back');
    }

    for (let r of laterRequests) {
      if (r.imgIndex > request.imgIndex) {
        r.imgIndex -= 1;
        await r.save();
      }
    }
    req.flash('success', "Image deleted from bird gallery!");
  }

  return res.redirect('/');
}

const rejectGalleryUpdate = async function(req, res) {
  const request = await GalleryUpdateRequest.findByIdAndDelete(req.params.id);
  if (!request) {
    req.flash('error', "Unable to delete gallery update");
    return res.redirect('back');
  }

  req.flash('success', "Gallery Update rejected!");
  return res.redirect('/');
}
