const User = require("../models/User");

module.exports = {
  getUserBySearch: async (req, res) => {
    try {
      let { q } = req.query;
      q = q.trim();
      const user = await User.findOne({ userName: q });
      if (user) {
        return res.redirect(`/profile/${user._id}`);
      } else {
        console.log(`User ${q} not found`);
        req.flash("error", `User '${q}' not found.`);
        return res.redirect("/feed");
      }
    } catch (err) {
      console.log(err);
    }
  }
};