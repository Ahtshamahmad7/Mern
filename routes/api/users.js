const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/Users');

// @route    GET api/user 
// @desc     Register User
// @access   Public

router.post('/', [
    check('name', 'Name is Required')
    .not()
    .isEmpty(),
    check('email', 'Please Enter a valid email')
    .isEmail(),
    check('password', 'Please enter a password of 6 digits or more')
    .isLength({ min: 6})
],
async (req, res) => {

    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        // See if User exist

        let user = await User.findOne({ email });

        if(user){
            return res.status(400).json({ errors: [{ msg: 'User already exist' }] });
        }

        // Get User Gavatar

        const avatar = gravatar.url(email, {
            s: '20',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });

        // Encrypt password

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Return jsonwebtoken

        const payload = {
            user: {
                id: user.id,
                name: user.name
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 360000}, 
            (err, token) => {
                if(err) throw error;
                res.json({ token });
            });

    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router;