const Comment = require("../models/Comment");
const moment = require('moment');

module.exports = {
    createComment: async (req, res) => {
        try {
      //           // Calculate the time since the post was created
      // const timeSincePost = moment(comment.createdAt).fromNow();
          const comment = await Comment.create({
            comment: req.body.comment,
            likes: 0,
            post: req.params.id,
            user: req.user?.id,
            userName: req.user?.userName,
            createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
          });
          console.log('Comment has been added!');
          res.redirect('/post/' + req.params.id);
        } catch (err) {
          console.log(err);
        }
      },
    deleteComment: async (req, res) => {
        try {
          let comment = await Comment.findById({ _id: req.params.id });
          await Comment.remove({ _id: req.params.id });
          console.log("Deleted Comment");
          res.redirect("/post/" + comment.post);
        } catch (err) {
            res.redirect("/profile");
        }
      }
};