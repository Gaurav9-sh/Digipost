import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import upload from '../middlewares/upload.js';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

router.get('/verify', async (req, res) => {
  // console.log(req.cookies); // Log all cookies to verify their presence
  const token = req.cookies?.digitalPostboxToken; // Optional chaining to prevent errors
  
  if (!token) {
    console.log("No token found in cookies");
    return res.status(401).json({ message: 'Access denied. No toaken provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using the secret
    const user = await User.findById(decoded.id);
    // console.log("user details",user)
    res.status(200).json({ user:user }); // Send the decoded user data
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
});

router.post('/signup', upload.single('profile_image'), async (req, res) => {
  try {
    console.log("Hello from backend");
    const { name, email, handle_name, password, confirm_password } = req.body;

    if (!name || !email || !handle_name || !password || !confirm_password) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== confirm_password) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Email already registered' });
    }

    // REMOVED: This line is no longer needed as hashing is handled by the pre-save middleware
    // const hashedPassword = await bcrypt.hash(password, 10);

    let profile_image_url = null;
    
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'profile_images',
        // transformation: [{ width: 500, height: 500, crop: 'limit' }]
      });
      profile_image_url = uploadResult.secure_url;
      
      fs.unlinkSync(req.file.path);
    }

    const newUser = new User({
      name,
      email,
      handle_name,
      password: password, // Store the plaintext password to be hashed by the middleware
      profile_image: profile_image_url
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        handle_name: newUser.handle_name,
        profile_image: newUser.profile_image
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    
    const { handleOrEmail, password } = req.body;
    console.log("user credentials:",req.body)
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
      handle_name: user.handle_name,
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

router.get('/user-info', async (req, res) => {
  console.log("Basic info called")
  try {
    const users = await User.find({}, '_id handle_name profile_image');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching basic user info:', error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
});

export default router;
