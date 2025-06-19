const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
  profile_image: {
    type: String, // URL of the profile image
    default: null,
  },
  poster:{
    type: String,
    default:null
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  handle_name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default:"",
  },
  followers:{
    type:Number,
    default:0
  },
  following:{
    type:Number,
    default:0
  },
  lettersCount:{
    type:Number,
    default:0
  }
});

// Letter Schema
const letterSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the sender's user ID
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the recipient's user ID
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean, // Whether the letter is public or private
    default: false,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});


const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user who created the post
    ref: 'User',
    required: true,
  },
  content: {
    type: String, // Text content of the post
    required: true,
  },
  image: {
    type: String, // URL of the image (if any)
    default: null,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId, // References to user IDs who liked the post
      ref: 'User',
    },
  ],
  comments: [
    {
      commenter: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the commenter's user ID
        ref: 'User',
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export models
module.exports = {
  User: mongoose.model('User', userSchema),
  Post: mongoose.model('Post', postSchema),
  Letters: mongoose.model('Letters',letterSchema)
};
