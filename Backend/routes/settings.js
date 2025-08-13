const express = require('express')
const router = express.Router()
const {User} = require('../models/User.js');

router.put('/profile/:id', async (req, res) => {
  try {
    const { name, bio, profile_image } = req.body;
    console.log("Updated details:",req.body)
    const {id} = req.params
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        bio: bio || '',
        profile_image: profile_image || null
      },
      { new: true, runValidators: true } 
    ).select('-password'); 

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router
