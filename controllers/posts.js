const Post = require("../models/Post");
const { getApiToken, searchTrack } = require("../services/spotify");


// Post controller functions
module.exports = {
  getProfile: async (req, res) => { 
    console.log(req.user)
    try {
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
      const { songName, artistName } = req.body;
  
      // Check if the required fields are filled in
      if (!songName || !artistName) {
        throw new Error('Song name and artist name are required');
      }
  
      const token = await getApiToken();
      const trackData = await searchTrack(songName, artistName, token);

      if (!trackData?.tracks?.items?.length) {
        throw new Error('No track data found for this song and artist');
      }
      
      const post = await Post.create({
        title: req.body.title,
        caption: req.body.caption,
        likes: 0,
        songName,
        artistName,
        spotifyTrackId: trackData.tracks.items[0].id,
        user: req.user?.id, // Check if req.user exists before accessing its properties
      });
  
      console.log('Post has been added!');
      res.redirect('/profile');
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message); // Send an error response to the client
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
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};