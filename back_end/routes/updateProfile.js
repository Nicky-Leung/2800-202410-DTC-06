const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');
const cloudinary = require('../public/scripts/cloudinary')
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

/**
 * @description This storage object is used to store the profile picture in the cloudinary storage.
 * @param {object} cloudinary - The cloudinary object.
 * @param {object} params - The parameters for the storage.
 * @author github copilot
 * Github Copilot generated the code for the storage object. Developer modifiled the folder and allowed formats.
 * 
 */
const storage = new CloudinaryStorage({
  // cloudinary object
  cloudinary: cloudinary,
  params: {
    // The folder where the profile picture is stored. This folder is found in the cloudinary storage.
    folder: 'profilePicturesforCOMP2800',
    // The allowed formats for the profile picture.
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif']

  },
});

// middleware for multer to parse the profile picture
const parser = multer({ storage: storage });

/**
 * @description This route updates the user's profile with the new profile picture, name, and bio.
 * @body {string} name - The name of the user.
 * @body {string} bio - The bio of the user.
 * @body {string} profilePicture - The url of the profile picture.
 */
router.post('/updateProfile', parser.single('profilePicture'), async (req, res) => {
  // get the name and bio from the request body
  const { name, bio } = req.body;
  // create an update object with the name and bio
  const update = { name, bio };

  // condition to check if the profile picture is in the request
  if (req.file) {
    update.profilePicture = req.file.path;// updates pfp 
  }

  try {
    // update the user with the email in the session with the update object
    await usersModel.updateOne({ email: req.session.email }, update);
    // update the session with the new name and bio
    req.session.name = name;
    req.session.bio = bio;
    // condition to check if the profile picture is in the request
    if (req.file) {
      req.session.profilePicture = req.file.path;// updates pfp in session
    }
    // redirect to the profile page with a query parameter to indicate that the profile was updated
    res.redirect('/profile?profileUpdated=true');
  } catch (error) {
    // catch any errors and log them
    console.error('Error during profile update:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;