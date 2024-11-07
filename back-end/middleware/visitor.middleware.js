const visitorMiddleware = {
  authenticateVisitor(req, res, next) {
    const { email } = req.body;
    
    if (!email) {
      return res.status(401).json({ error: 'Email is required for authentication' });
    }

    // Add email to request object for later use
    req.visitorEmail = email;
    next();
  }
};

module.exports = visitorMiddleware; 