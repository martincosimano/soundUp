const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth } = require("../middleware/auth");

//Post Routes
router.get("/:id", ensureAuth, postsController.getPost);
router.post("/createPost", ensureAuth, upload.single("file"), postsController.createPost);
router.put("/likePost/:id", ensureAuth, postsController.likePost);
router.delete("/deletePost/:id", ensureAuth, postsController.deletePost);

module.exports = router;