const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel');
const cloudinary = require('../public/scripts/cloudinary')
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profilePicturesforCOMP2800',// folder where teh pfp is stored
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif']// allowed pfp formats

  },
});

const parser = multer({ storage: storage });// middleware for parsing the pfp


router.post('/updateProfile', parser.single('profilePicture'), async (req, res) => {
  const { name, bio } = req.body;
  const update = { name, bio };

  if (req.file) {
    update.profilePicture = req.file.path;// updates pfp 
  }

  try {
    await usersModel.updateOne({ email: req.session.email }, update);
    // Update session data
    req.session.name = name;
    req.session.bio = bio;
    if (req.file) {
      req.session.profilePicture = req.file.path;// updates pfp in session
    }
    res.redirect('/profile?profileUpdated=true');
  } catch (error) {
    console.error('Error during profile update:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;