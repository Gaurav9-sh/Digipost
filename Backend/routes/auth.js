const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/User.js');

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, handle_name, password, confirm_password, profile_image } = req.body;

    // Check if passwords match
    if (password !== confirm_password) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if email or handle_name already exists
    const existingUser = await User.findOne({ $or: [{ email }, { handle_name }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or handle name already taken' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      handle_name,
      password,
      profile_image,
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    
    const { handleOrEmail, password } = req.body;

    // Find user by email or handle
    const user = await User.findOne({
      $or: [
        { email: handleOrEmail },
        { handle_name: handleOrEmail }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
        res.cookie('digitalPostboxToken', token, {
      httpOnly: true,       // Prevent access via JavaScript
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'Strict',   // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    // Respond with user details and token
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      handle: user.handle_name,
      profile_image: user.profile_image,
      bio:user.bio,
      followers:user.followers,
      following:user.following ,
      poster:user.poster,
      lettersCount:user.lettersCount 
    };

    res.status(200).json({
      message: 'Logged in successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  try {
    
    res.clearCookie('digitalPostboxToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Failed to logout' });
  }
});

module.exports = router;
