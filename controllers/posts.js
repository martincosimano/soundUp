const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { getApiToken, searchTrack } = require("../services/spotify");
const User = require("../models/User");
const moment = require('moment');


// Post controller functions
module.exports = {
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const limit = 3;
      const posts = await Post.find({ user: req.params.id }).sort({ createdAt: "desc" }).limit(limit).lean();
  
      // Check if the authenticated user is viewing their own profile
      const isCurrentUser = req.user && req.user._id.toString() === req.params.id;
  
      res.render("profile.ejs", {
        posts: posts,
        user: user,
        currentUserID: req.user ? req.user._id : null,
        flash: req.flash(),
        isCurrentUser: isCurrentUser // Pass the boolean to the view
      });
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
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts, user: req.user, currentUserID: req.user ? req.user._id : null });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "desc"}).lean();
      const relatedPosts = await Post.find({
        $or: [
          { songName: post.songName },
          { artistName: post.artistName },
        ],
      }).sort({ createdAt: "desc"}).limit(3);
      
      // Calculate the time since the post was created
      const timeSincePost = moment(post.createdAt).fromNow();
      
      res.render("post.ejs", {
        post: post,
        user: req.user,
        relatedPosts: relatedPosts,
        comments: comments,
        currentUserID: req.user ? req.user._id : null,
        timeSincePost: timeSincePost
      });
    } catch (err) {
      console.log(err);
    }
  },
  getUserFeed: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.params.id }).sort({ createdAt: "desc" }).lean();
      res.render('profile/userfeed.ejs', { posts: posts, user: req.user, currentUserID: req.user ? req.user._id : null });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
        const { songName, artistName, title, caption } = req.body;

        // Check if the required fields are filled in
        if (!title) {
            throw new Error('Title is required');
        }else if(!caption) {
          throw new Error('Caption is required')
        }else if(!songName) {
          throw new Error('Song name is required')
        }else if(!artistName){
          throw new Error('Artist name is required')
        }

        const token = await getApiToken();
        const trackData = await searchTrack(songName, artistName, token);

        if (!trackData?.tracks?.items?.length) {
            throw new Error('No track data found for this song and artist');
        }

        const post = await Post.create({
            title,
            caption,
            likes: 0,
            songName,
            artistName,
            spotifyTrackId: trackData.tracks.items[0].id,
            user: req.user?.id,
            userName: req.user?.userName,
            email: req.user?.email,
        });

        console.log('Post has been added!');
        res.redirect(`/profile/${req.user._id}`);
    } catch (err) {
        console.log(err);

        // Set a flash message to display the error on the profile page
        req.flash('error', err.message);

        // Redirect to the profile page
        res.redirect(`/profile/${req.user._id}`);
    }
},
likePost: async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = req.user;

    if (post.likedBy.includes(user._id)) {
      await Post.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: -1 },
          $pull: { likedBy: user._id }
        }
      );
      console.log("Down liked");
    } else {
      await Post.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { likedBy: user._id }
        }
      );
      console.log("Liked");
    }

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
      res.redirect(`/profile/${req.user._id}`);
    } catch (err) {
      res.redirect(`/profile/${req.user._id}`);
    }
  }
};