const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  songName: {
    type: String,
    required: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  spotifyTrackId: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userName: {
    type: String,
    ref: "User",
  },
  email: {
    type: String,
    ref: "User",
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  status: {
    type: Boolean,
    default: true,
  }
});

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Post", postSchema);
