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
      const posts = await Post.find({ user: req.params.id, status: true }).sort({ createdAt: "desc" }).limit(limit).lean();
  
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
    const perPage = 9;
    const page = Math.max(0, req.query.page - 1);
    const count = await Post.countDocuments( { status: true });
    const posts = await Post.find( { status: true })
      .sort({ createdAt: "desc" })
      .skip(perPage * page)
      .limit(perPage)
      .lean();

    res.render("feed.ejs", { 
      posts: posts, 
      user: req.user, 
      currentUserID: req.user ? req.user._id : null,
      userName: req.user?.userName,
      pageCount: Math.ceil(count / perPage),
      currentPage: page + 1
    });
  } catch (err) {
    console.log(err);
  }
},
getPost: async (req, res) => {
  try {
      const post = await Post.findById(req.params.id);

      // check if the post exists and is not deleted
      if (!post || !post.status) {
        return res.status(404).send("Post not found");
      }

      const comments = await Comment.find({ post: req.params.id, status: true }).sort({ createdAt: "desc" }).lean();

      // Calculate the time since the post was created
      const timeSincePost = moment(post.createdAt).fromNow();

      // Calculate the time since each comment was created
      const commentsWithTimeSince = comments.map((comment) => {
          const timeSinceComment = moment(comment.createdAt).fromNow();
          return { ...comment, timeSinceComment };
      });

      res.render("post.ejs", {
          post: post,
          user: req.user,
          comments: commentsWithTimeSince,
          currentUserID: req.user ? req.user._id : null,
          timeSincePost: timeSincePost,
          flash: req.flash() 
      });
  } catch (err) {
      console.log(err);
  }
},
  getUserFeed: async (req, res) => {
    try {
      const perPage = 9;
      const page = Math.max(0, req.query.page - 1);
      const count = await Post.countDocuments( { user: req.params.id, status: true } );
      const posts = await Post.find( { user: req.params.id, status: true } )
        .sort({ createdAt: "desc" })
        .skip(perPage * page)
        .limit(perPage)
        .lean();
  
      res.render("profile/userfeed.ejs", { 
        posts: posts, 
        user: req.user, 
        currentUserID: req.user ? req.user._id : null,
        userName: req.user?.userName,
        pageCount: Math.ceil(count / perPage),
        currentPage: page + 1,
      });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
        const { songName, artistName, caption } = req.body;

        // Check if the required fields are filled in
        if(!caption) {
          throw new Error('Caption is required.')
        }else if(!songName) {
          throw new Error('Song name is required.')
        }else if(!artistName){
          throw new Error('Artist name is required.')
        }

        const token = await getApiToken();
        const trackData = await searchTrack(songName, artistName, token);

        if (!trackData?.tracks?.items?.length) {
            throw new Error('No track data found for this song and artist.');
        }

        const post = await Post.create({
            caption,
            likes: 0,
            songName,
            artistName,
            spotifyTrackId: trackData.tracks.items[0].id,
            user: req.user?.id,
            userName: req.user?.userName,
            email: req.user?.email,
            status: true
        });

        console.log('Post has been added!');
        res.redirect(`/profile/${req.user._id}`);
    } catch (err) {
        console.log(err);
        req.flash('error', err.message);
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
      post.status = false;
      await post.save();
      console.log("Deleted Post");
      res.redirect(`/profile/${req.user._id}`);
    } catch (err) {
      res.redirect(`/profile/${req.user._id}`);
    }
  }
};