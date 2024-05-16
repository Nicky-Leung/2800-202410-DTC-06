const express = require('express');
const router = express.Router();
const usersModel = require('../models/userModel'); // adjust the path as needed
const Joi = require('joi');
const { type } = require('os');

const crypto = require('crypto');

// enforce requirements for name password and email
const signUpSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': `Name is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
        'any.required': `Name is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`
    }),
    email: Joi.string().email().required().messages({
        'string.email': `Email must be a valid email address. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
        'string.empty': `Email is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
        'any.required': `Email is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`
    }),
    password: Joi.string().min(8).max(12).required().messages({
        'string.min': `Password must be at least 8 characters long. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
        'string.max': `Password must less than 13 characters long. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
        'string.empty': `Password is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`,
        'any.required': `Password is required. Please try again. <button onclick="location.href='/signup'" type="button">Sign Up</button>`
    })
});
// encrypt password to be stored in the database
function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

router.get('/login', (req, res) => {
    res.render('login.ejs')
});

// log the user in
router.post('/login', async (req, res) => {
    console.log('Login request received');
    try {
        const hashedPassword = hashPassword(req.body.password);
        const result = await usersModel.findOne({ email: req.body.email, password: hashedPassword });
        console.log('Query result:', result);
        if (result) {
            req.session.authenticated = true;
            req.session.type = result.type;
            req.session.name = result.name;
            req.session.email = result.email;
            return res.redirect('/protectedRoute');
        }
        console.log('Access denied');
        res.render('notLoggedIn.ejs', { message: 'Email and/or password not found. Please try again or sign up.' })
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/signup', (req, res) => {
    res.render('signup.ejs')
});




// create a new user and save to the database
router.post('/signup', async (req, res) => {
    const { error } = signUpSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, email, password } = req.body;
    const hashedPassword = hashPassword(password);
    try {
        const newUser = new usersModel({ name, email, password: hashedPassword, type: 'non-administrator' });
        await newUser.save();
        console.log('User created:', newUser);
        res.redirect('/login');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal Server Error');
    }
});



// reset password with email if user has forgotten password but remembers their email
router.get('/resetPasswordWithEmail', (req, res) => {
    res.render('resetPasswordWithEmail.ejs');
}
);
// find a user by email and let them reset their password 
// TODO: send an email to the user with a link to reset their password
router.post('/resetPasswordWithEmail', async (req, res) => {
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    try {
        const hashedPassword = hashPassword(newPassword);
        await usersModel.updateOne({ email: email }, { password: hashedPassword });
        res.redirect('/?passwordUpdated=true');
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/resetPassword', isUserAuthenticated, (req, res) => {
    res.render('resetPassword.ejs');
});

// find user via email and then reset their password
router.post('/resetPassword', isUserAuthenticated, async (req, res) => {
    const newPassword = req.body.newPassword;
    const email = req.session.email;

    try {
        const user = await usersModel.findOne({ email: email });
        const hashedPassword = hashPassword(newPassword);
        await usersModel.updateOne({ email: email }, { password: hashedPassword });
        res.redirect('/?passwordUpdated=true');
    } catch (error) {
        console.error('Error during password reset:', error);
    }
});

router.get('/logout', isUserAuthenticated, (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/');
}
);

module.exports = router;

