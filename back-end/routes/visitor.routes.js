const express = require("express");
const router = express.Router();
const { createComment, updateComment, deleteComment } = require("../controllers/visitorController");
const { authenticateVisitor } = require("../middleware/visitor.middleware");

router.post("/posts/:postId/comments", createComment);
router.put("/visitors/comments/:id", authenticateVisitor, updateComment);
router.delete("/visitors/comments/:id", authenticateVisitor, deleteComment);

module.exports = router;