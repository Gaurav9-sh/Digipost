import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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

  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],

  inbox: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Letters',
  }],

  sent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Letters',
  }],
});

// Letter Schema
const letterSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the sender's user ID
    ref: 'User',
    required: true,
  },
 recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  content: {
    type: String,
    required: true,
  },
  attachment:{
    type: String
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

// Public Letter Schema
const publicletterSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the sender's user ID
    ref: 'User',
    required: true,
  },
  subject:{
    type: String,
    required:true
  },
  content: {
    type: String,
    required: true,
  },
  attachment:{
    type: String
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

const publicFeedSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true, // Subject is mandatory
    trim: true, // Remove extra spaces
  },
  content: {
    type: String,
    required: true, // Content is mandatory
    trim: true,
  },
  sentAt: {
    type: Date,
    default: Date.now, // Automatically set to current date
  },
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: true,
    },
    name: {
      type: String, // Author's display name
      required: true,
    },
    handle: {
      type: String, // Unique username or handle
      required: true,
    },
    avatar: {
      type: String, // URL for profile picture
      default: '',
    },
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
  console.log("candidate password:",candidatePassword)  
  const res = await bcrypt.compare(candidatePassword, this.password);
  console.log("Response of compare",res);
  return res;
};

// Export models
export const User = mongoose.model('User', userSchema);
export const Letters = mongoose.model('Letters', letterSchema);
export const publicletters = mongoose.model('publicletters', publicletterSchema);
export const Post = mongoose.model('Post', postSchema);
export const publicFeed = mongoose.model('publicFeed', publicFeedSchema);
