const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth } = require("../middleware/auth");

// Comment Routes
router.get("/post/:id/comments", ensureAuth, commentsController.getComments);
router.post("/createComment/:id", ensureAuth, commentsController.createComment);
router.delete("/deleteComment/:id", ensureAuth, commentsController.deleteComment);

module.exports = router;