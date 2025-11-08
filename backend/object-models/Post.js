const mongoose = require('mongoose');

// Schema for different content chunks within a recipe
const contentChunkSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['media', 'ingredients', 'instructions', 'nutrition'],
    required: true
  },
  displayOrder: {
    type: Number,
    required: true
  },
  data: {
    // type = media: url string
    url: String,
    // type = ingredients: servingSize + array of strings
    servingSize: Number,
    ingredients: [{ type: String }],
    // type = nutrition: key/value pairs provided by user (this will be gathered through the user filling out a form when creating a recipe)
      // kinda just a placeholder rn
    nutrition: mongoose.Schema.Types.Mixed,
    // type = instructions: plain string whose formatting will be handled on frontend
    instructions: String
  }
}, { _id: false });

// Main Post schema
const postSchema = new mongoose.Schema({
  poster: {
    // This will refer to the handle of the user who made the post
    type: String,
    required: true,
    index: true
  },
  media: [{
    url:String,
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    order: Number,
    required: true
  }],
  text: {
    type: String,
    maxLength: 2000,
    required: true
  },
  recipe: {
    // recipe is optional; when present it is made up of contentChunks
    contentChunks: {
      type: [contentChunkSchema],
      default: undefined
    }
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply'
  }],
  datePosted: {
    type: Date,
    default: Date.now
  },
  dateUpdated: {
    type: Date,
    default: Date.now
  }
});

// Indexes
postSchema.index({ poster: 1, datePosted: -1 });

postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Post', postSchema);