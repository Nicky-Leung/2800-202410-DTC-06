const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel'); // Adjust the path as needed
const Joi = require('joi');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

// SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_DEV_PASSWORD_RESET_KEY);

// Enforce requirements for name, password, and email
const signUpSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>',
        'any.required': 'Name is required. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email address. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>',
        'string.empty': 'Email is required. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>',
        'any.required': 'Email is required. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>'
    }),
    password: Joi.string().min(8).max(16).required().messages({
        'string.min': 'Password must be at least 8 characters long. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>',
        'string.max': 'Password must be less than 17 characters long. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>',
        'string.empty': 'Password is required. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>',
        'any.required': 'Password is required. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>'
    }),
    city: Joi.string().required().messages({
        'string.empty': 'City is required. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>',
        'any.required': 'City is required. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>'
    }),
    country: Joi.string().required().messages({
        'string.empty': 'Country is required. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>',
        'any.required': 'Country is required. Please try again. <button onclick="location.href=\'/signup\'" type="button">Sign Up</button>'
    }),
    captcha: Joi.string().required().messages({
        'string.empty': 'Captcha is required. Please try again.',
        'any.required': 'Captcha is required. Please try again.'
    })
});

// Encrypt password to be stored in the database
function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

// Log the user in
router.post('/login', async (req, res) => {
    console.log('Login request received');
    try {
        const hashedPassword = hashPassword(req.body.password);
        const result = await usersModel.findOne({ email: req.body.email, password: hashedPassword });
        console.log('Query result:', result);
        if (result) {
            // Set the current user in the session
            req.session.currentUser = result;
            req.session.authenticated = true;
            req.session.type = result.type;
            req.session.name = result.name;
            req.session.email = result.email;
            req.session.bio = result.bio;
            req.session.friends = result.friends
            return res.redirect('/profile');
        }
        console.log('Access denied');
        res.render('notLoggedIn.ejs', { message: 'Email and/or password not found. Please try again or sign up.' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

// Create a new user and save to the database
router.post('/signup', async (req, res) => {
    const { error } = signUpSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, email, password, city, country } = req.body;
    const hashedPassword = hashPassword(password);
    try {
        const newUser = new usersModel({
            name, email, password: hashedPassword, type: 'non-administrator', elo: '400', rank: 'Aspirant'
            , sportsmanship: '500', streak: 'false', streakCount: '0', matchHistory: [], city, country
        });
        await newUser.save();
        console.log('User created:', newUser);

        // Send confirmation email
        const msg = {
            to: email,
            from: 'gamesetmatchdtcsix@gmail.com',
            subject: 'Sign-Up Confirmation',
            html: `<p>Thank you for signing up, ${name}!</p><p>Your account has been successfully created.</p>`,
        };
        await sgMail.send(msg);
        console.log('Confirmation email sent');

        res.redirect('/login');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
