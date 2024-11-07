const express = require("express");
const router = express.Router();
const { createComment, updateComment, deleteComment } = require("../controllers/commentController");
const { authenticateToken } = require("../middleware/auth.middleware");

router.use(authenticateToken);

router.post("/posts/:postId/comments", createComment);
router.put("/comments/:id", updateComment);
router.delete("/comments/:id", deleteComment);

module.exports = router;