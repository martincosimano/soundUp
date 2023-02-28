const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Post = require("../models/Post");
const axios = require('axios');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const { getApiToken } = require('../services/spotify.js');
const { getArtistData } = require('./spotify');

// Function to search for tracks and artists using the Spotify API
const searchSpotify = async (query, type) => {
  // Get access token from Spotify API
  const token = await getApiToken();
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=${type}&limit=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};

// Post controller functions
module.exports = {
  getProfile: async (req, res) => { 
    console.log(req.user)
    try {
      const myToken = await getApiToken();
      console.log(myToken);
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      Post.create({
        title: req.body.title,
        caption: req.body.caption,
        likes: 0,
        songName: req.body.songName,
        artistName: req.body.artistName,
        user: req.user.id,
      });
      console.log('Post has been added!');
      res.redirect('/profile');
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      let post = await Post.findById({ _id: req.params.id });
      await cloudinary.uploader.destroy(post.cloudinaryId);
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};