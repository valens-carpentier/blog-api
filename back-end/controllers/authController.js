const passport = require("../config/passport");
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const registerAuthor = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const author = await prisma.author.create({
        data: {
          username,
          email,
          password: hashedPassword
        }
      });
      
      // Remove password from response
      const { password: _, ...authorData } = author;
      res.status(201).json(authorData);
    } catch (error) {
      res.status(400).json({ error: "Registration failed" });
    }
  }

const loginAuthor = async (req, res) => {
    try {
      const { email, password } = req.body;
      const author = await prisma.author.findUnique({ where: { email } });
      
      if (!author || !(await bcrypt.compare(password, author.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const token = jwt.sign(
        { id: author.id, role: 'author' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({ token });
    } catch (error) {
      res.status(400).json({ error: "Login failed" });
    }
  }

module.exports = {
    registerAuthor,
    loginAuthor
}