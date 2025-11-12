const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true
  },
  parentReplyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply',
    default: null,
    index: true
  },
  replier: {
    // This will refer to the handle of the user who made the reply
    type: String,
    required: true,
    index: true
  },
  text: {
    type: String,
    maxLength: 2000,
    required: true
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply'
  }],
  dateReplied: {
    type: Date,
    default: Date.now
  },
  dateUpdated: {
    type: Date,
    default: Date.now
  }
});

replySchema.pre('save', function(next) {
  this.dateUpdated = Date.now();
  next();
});

modeule.exports = mongoose.model('Reply', replySchema);