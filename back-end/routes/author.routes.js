const express = require("express");
const router = express.Router();
const { createPost, updatePost, deletePost, getPosts, getPostById } = require("../controllers/authorController");
const { authenticateToken, isAuthor } = require("../middleware/auth.middleware");

// Protect all routes with authentication
router.use(authenticateToken);
router.use(isAuthor);

// Post management routes
router.post("/posts", createPost);
router.get("/posts", getPosts);
router.put("/posts/:id", updatePost);
router.delete("/posts/:id", deletePost);
router.get("/posts/:id", getPostById);

module.exports = router;
