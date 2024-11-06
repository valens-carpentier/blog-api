const jwt = require('jsonwebtoken');

const authMiddleware = {
  authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied' });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(403).json({ error: 'Invalid token' });
    }
  },

  isAuthor(req, res, next) {
    if (req.user.role !== 'author') {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  }
};

module.exports = authMiddleware;