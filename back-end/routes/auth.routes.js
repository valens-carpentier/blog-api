const express = require("express");
const router = express.Router();
const { registerAuthor, loginAuthor } = require("../controllers/authController");

router.post("/register", registerAuthor);
router.post("/login", loginAuthor);

module.exports = router;