module.exports = {
  getIndex: (req, res) => {
    res.render("index.ejs", { user: req.user, currentUserID: req.user ? req.user._id : null, });
  },
};
