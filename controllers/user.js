const User = require("../models/User");

module.exports = {
  getUserBySearch: async (req, res) => {
    try {
      let { q } = req.query;
      q = q.trim();
      if (q === '') {
        req.flash("error", `User search cannot be blank`);
        return res.redirect(req.header('referer'));
      }
      const user = await User.findOne({ userName: q });
      if (user) {
        return res.redirect(`/profile/${user._id}`);
      } else {
        req.flash("error", `User '${q}' not found`);
        return res.redirect(req.header('referer'));
      }
    } catch (err) {
      console.log(err);
    }
  }
};