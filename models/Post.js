const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  songTitle: {
    type: String,
    required: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  trackData: {
    type: Object,
    required: true,
  },
  artistData: {
    type: Object,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

async function createPost(postData) {
  const post = new Post(postData);
  await post.save();
  return post;
}

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Post", postSchema);
