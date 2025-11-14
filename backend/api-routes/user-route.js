const express = require('express');
const router = express.Router();
const User = require('../object-models/User');
const verifyToken = require('../middleware/auth');

// Function to clean the handle by removing whitespace and converting to lowercase (just in case the frontend misses it)
function cleanHandle(handle) {
  if (!handle && handle !== '') return handle; // preserve undefined/null
  const cleansedHandle = String(handle)
    // removes zero-width characters (U+200B, U+200C, U+200D, U+FEFF)
    .replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
    return cleansedHandle.replace(/\s+/g, '').toLowerCase();
}

// Registers a new user after they sign up through Firebase
router.post('/register', verifyToken, async (req, res) => {
  try {
    const { handle, displayName } = req.body;
    const handleTLC = cleanHandle(handle);

    // Checks if the handle the user is requesting already exists
    const handleExists = await User.findOne({ handle: handleTLC });
    if (handleExists){
      return res.status(400).json({ error: 'This handle is already taken' });
    }

    // Checks if the user has already registered
    const userExists = await User.findOne({ firebaseUid: req.user.uid });
    if (userExists){
      return res.status(400).json({ error: 'This user is already registered' });
    }

    // Handles creating a new user
    const newUser = new User({
      firebaseUid: req.user.uid,
      handle: handleTLC,
      displayName
    });
    await newUser.save();

    // Prevents the firebaseUid from being sent back in the response
    const publicUser = newUser.toObject();
    delete publicUser.firebaseUid;
    
    res.status(201).json({ message: 'User has been registered successfully', user: publicUser });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({ error: 'Duplicate key error' });
    }
    console.error('Failed to register user: ', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

// Gets the user profile via their handle
  // NOTE: ':handle' functions as a URL parameter
router.get('/profile/:handle', async (req, res) => {
  try {
    const user = await User.findOne({ handle: req.params.handle })
    // Excludes firebaseUid from the response
    .select('-firebaseUid')
    .populate('followers', 'handle displayName')
    .populate('following', 'handle displayName');

    if (!user){
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });

  } catch (error) {
    console.error('Failed to get user\'s profile: ', error);
    res.status(500).json({ error: 'Failed to get user\'s profile' });
  }
});

// Handling for getting the currently logged in user's profile
router.get('/profile/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid })
    .populate('followers', 'handle displayName')
    .populate('following', 'handle displayName');

    if (!user){
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Failed to get logged in user\'s profile: ', error);
    res.status(500).json({ error: 'Failed to get logged in user\'s profile' });
  }
});

// Handles updating the user's profile
  // NOTE: The user must be logged in to update their profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    // Pulls the data from the request that will be used to update the profile & finds the user that's currently logged in
    const { displayName, description, profilePicture } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user){
      return res.status(404).json({ error: 'User not found' });
    }

    // Updates any of the following parameters if they are provided:
    if (displayName){
      user.displayName = displayName;
    }
    if (description !== undefined){
      user.description = description;
    }
    if (profilePicture){
      user.profilePicture = profilePicture;
    }

    // Saves to MongoDB
    await user.save();
    res.json({ message: "Profile updated successfully", user });

  } catch (error) {
    console.error('Failed to update user profile: ', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Handling for following a user
router.post('/follow/:handle', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findOne({ firebaseUid: req.user.uid });
    const targetUser = await User.findOne({ handle: req.params.handle });

    if (!currentUser || !targetUser){
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevents users from following themselves
    if (currentUser.id === targetUser.id){
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    // Prevents users from following someone they already follow
    if (currentUser.following.includes(targetUser.id)){
      return res.status(400).json({ error: 'You are already following this user' });
    }

    // Adds the target user to the current user's following list & vice versa for followers
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { following: targetUser._id }
    });
    await User.findByIdAndUpdate(targetUser._id, {
      $addToSet: { followers: currentUser._id }
    });
    res.json({ message: `You are now following & a follower of ${targetUser.handle}`});
  } catch (error) {
    console.error('Failed to follow user: ', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Handling for unfollowing a user (basically the reverse of following)
router.post('/unfollow/:handle', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findOne({ firebaseUid: req.user.uid });
    const targetUser = await User.findOne({ handle: req.params.handle });
    if (!currentUser || !targetUser){
      return res.status(404).json({ error: 'User not found' });
    }

    if (!currentUser.following.includes(targetUser.id)){
      return res.status(400).json({ error: 'You are not following this user' });
    }

    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUser._id }
    });
    await User.findByIdAndUpdate(targetUser._id, {
      $pull: { followers: currentUser._id }
    });
    res.json({ message: `You have unfollowed & been removed as a follower of ${targetUser.handle}`});
  } catch (error) {
    console.error('Failed to unfollow user: ', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});


module.exports = router;