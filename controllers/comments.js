const Comment = require("../models/Comment");
const moment = require('moment');

module.exports = {
      getComments: async (req, res) => {
      try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId, status: true }).sort({ createdAt: -1 });
        res.render("post", { comments });
      } catch (err) {
        console.log(err);
      }
    },
    createComment: async (req, res) => {
      try {
        if (!req.body.comment) {
          throw new Error('Comment cannot be empty.');
        }
        const comment = await Comment.create({
          comment: req.body.comment,
          likes: 0,
          post: req.params.id,
          user: req.user?.id,
          userName: req.user?.userName,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
          status: true
        });
        res.redirect('/post/' + req.params.id);
      } catch (err) {
        console.log(err);
        req.flash('error', err.message);
        res.redirect('/post/' + req.params.id);
      }
    },
    deleteComment: async (req, res) => {
      try {
        let comment = await Comment.findById({ _id: req.params.id });
        comment.status = false;
        await comment.save();
        res.redirect("/post/" + comment.post);
      } catch (err) {
          res.redirect("/profile");
      }
    }
};