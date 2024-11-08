const express = require("express");
const router = express.Router();
const { createComment, updateComment, deleteComment, getPublishedPosts, getPublishedPostById, getPostComments } = require("../controllers/visitorController");
const { authenticateVisitor } = require("../middleware/visitor.middleware");

router.get("/posts/:postId/comments", getPostComments);
router.post("/posts/:postId/comments", createComment);
router.put("/visitors/comments/:id", authenticateVisitor, updateComment);
router.delete("/visitors/comments/:id", authenticateVisitor, deleteComment);
router.get("/posts/published", getPublishedPosts);
router.get("/posts/published/:id", getPublishedPostById);

module.exports = router;