const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const authorRoutes = require('./routes/author.routes');
const commentRoutes = require('./routes/comment.routes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes); 
app.use('/api/author', authorRoutes);
app.use('/api', commentRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
