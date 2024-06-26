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

/**
 * Encrypt password to be stored in the database
 * @param {string} password - The plain text password to be hashed
 * @returns {string} - The hashed password
 */
function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}
/**
 * GET /login
 * Route to render the login page
 * @route GET /login
 * @returns {void} - Renders the login.ejs view
 */
router.get('/login', (req, res) => {
    res.render('login.ejs');
});

/**
 * POST /login
 * Route to log the user in
 * @route POST /login
 * @body {string} email - The user's email address
 * @body {string} password - The user's password
 * @returns {void} - Redirects to profile page if login is successful, otherwise renders notLoggedIn.ejs view
 * @throws {500} - Internal Server Error if there is an issue during login
 */
router.post('/login', async (req, res) => {
    console.log('Login request received');
    try {
        // Encrypt password and the find user with email and password
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

/**
 * GET /signup
 * Route to render the signup page
 * @route GET /signup
 * @query {boolean} success - Indicates if the signup was successful
 * @returns {void} - Renders the signup.ejs view
 */
router.get('/signup', (req, res) => {
    const success = req.query.success === 'true';
    res.render('signup.ejs', { success });
});

/**
 * POST /signup
 * Route to create a new user and save to the database
 * @route POST /signup
 * @body {string} name - The user's name
 * @body {string} email - The user's email address
 * @body {string} password - The user's password
 * @body {string} city - The user's city
 * @body {string} country - The user's country
 * @body {string} captcha - The captcha value
 * @returns {void} - Redirects to the signup page with a success query parameter if successful
 * @throws {400} - Bad Request if validation fails
 * @throws {500} - Internal Server Error if there is an issue during signup
 */
router.post('/signup', async (req, res) => {
    // Validate user's credentials using signUpSchema
    const { error } = signUpSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, email, password, city, country } = req.body;
    // Encrypt the user's password
    const hashedPassword = hashPassword(password);
    try {
        // Create a new user
        const newUser = new usersModel({
            name, email, password: hashedPassword, type: 'non-administrator', elo: '400', rank: 'Aspirant'
            , sportsmanship: '500', streak: 'false', streakCount: '0', matchHistory: [], city, country
        });
        // Save new user
        await newUser.save();
        console.log('User created:', newUser);

        /**
        *  Create confirmation email
        *  Generated by AI copilot 
        *  @author https://github.com/copilot
        */
        const msg = {
            to: email,
            from: 'gamesetmatchdtcsix@gmail.com',
            subject: 'Sign-Up Confirmation',
            html: `<p>Thank you for signing up, ${name}!</p><p>Your account has been successfully created.</p>
            <br>
            <footer style="border-top: 1px solid #eaeaea; padding-top: 10px; text-align: center; font-size: 12px; color: #888;">
            <p>&copy; 2024 DTC06 Gamesetmatch. All rights reserved.</p>
            <p>Contact us at <a href="mailto:gamesetmatchdtcsix@gmail.com">gamesetmatchdtcsix@gmail.com</a></p>
            <p>Privacy Policy</p>
            </footer>`,
        };
        // Send confirmation email
        await sgMail.send(msg);
        console.log('Confirmation email sent');
        res.redirect('/signUp?success=true');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
