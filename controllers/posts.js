const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Post = require("../models/Post");
const { getApiToken } = require('../services/spotify.js');

module.exports = {
  getProfile: async (req, res) => { 
    console.log(req.user)
    try {
      // Call getApiToken() to get the token
      const myToken = await getApiToken();
      console.log(myToken);

      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const posts = await Post.find({ user: req.user.id });
      //Sending post data from mongodb and user data to ejs template
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
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Call getApiToken() to get the token
      const myToken = await getApiToken();
      console.log(myToken);
      
      // Construct the search query using the artist name and song title from the request body
      const query = `${req.body.artist} ${req.body.songTitle}`;
      
      // Use the Spotify API to search for the song
      const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
        headers: {
          'Authorization': `Bearer ${myToken}`,
        }
      });
      
      // Parse the response as JSON
      const data = await response.json();
      
      // Get the first result from the search
      const song = data.tracks.items[0];
      
      // Create a new post with the song information
      await Post.create({
        title: req.body.songTitle,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
        image: song.album.images[0].url,
        artist: song.artists[0].name,
        songUri: song.uri,
      });
      
      console.log("Post has been added!");
      res.redirect("/profile");
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
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
