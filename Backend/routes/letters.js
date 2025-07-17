const express = require('express');
const router = express.Router();
const { Letters, publicletters } = require('../models/User.js');
const {User} = require('../models/User.js');

// Middleware for error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};



// Send a private letter
router.post(
  '/private-letters/send',
  asyncHandler(async (req, res) => {
    const { sender, subject, content, attachment, recipients } = req.body;

    if (!sender || !recipients || !content) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Create the letter
    const letter = new Letters({
      sender,
      recipients,
      content,
      subject,
      attachment,
    });

    await letter.save();

    // Update sender's sent array
    await User.findByIdAndUpdate(sender, {
      $push: { sent: letter._id },
    });

    // Update recipients' inbox array
    await User.updateMany(
      { _id: { $in: recipients } },
      { $push: { inbox: letter._id } }
    );

    res.status(201).json({ message: 'Letter sent successfully.', letter });
  })
);

// Fetch received letters
router.get(
  '/letters/inbox/:userId',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const inbox = await Letters.find({ recipient: userId })
      .populate('sender', 'name email') // Populate sender details
      .sort({ sentAt: -1 });

    res.status(200).json(inbox);
  })
);


// GET /api/users/:id/inbox
router.get(
  '/users/:id/inbox',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).populate({
      path:'inbox',
      populate: [
          { path: 'sender', select: 'handle_name profile_image' },
          { path: 'recipients', select: 'handle_name profile_image' }
        ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ inbox: user.inbox });
  })
);

// GET /api/users/:id/sent
router.get(
  '/users/:id/sent',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'sent',
        populate: [
          { path: 'sender', select: 'handle_name profile_image' },
          { path: 'recipients', select: 'handle_name profile_image' }
        ]
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ sent: user.sent });
  })
);

// Public Letter Routes

// Send a public letter
router.post(
  '/public-letters/send',
  asyncHandler(async (req, res) => {
    const { sender,subject, content, attachment } = req.body;

    if (!sender || !content || !subject) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const publicLetter = new publicletters({
      sender,
      subject,
      content,
      attachment,
    });

    await publicLetter.save();
    res.status(201).json({ message: 'Public letter posted successfully.', publicLetter });
  })
);

// Fetch all public letters
router.get(
  '/public-letters',
  asyncHandler(async (req, res) => {
    console.log("Hello from backend public letters")
    const allPublicLetters = await publicletters
      .find()
      .populate('sender', 'name handle_name profile_image') // Populate sender details
      .sort({ sentAt: -1 });

    res.status(200).json(allPublicLetters);
  })
);


module.exports = router;
