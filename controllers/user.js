const User = require("../models/User");

module.exports = {
  getUserBySearch: async (req, res) => {
    try {
      const { q } = req.query;
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