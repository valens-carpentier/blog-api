// controllers/authorController.js

// Actions for the author
    // Create a post
    // Update a post
    // Delete a post
    // Get a single post

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }
        
        const authorId = req.user.id;
        const post = await prisma.post.create({ 
            data: { 
                title, 
                content,
                authorId 
            } 
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: "Failed to create post" });
    }
};

const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const postId = parseInt(req.params.id);
        
        if (!title && !content) {
            return res.status(400).json({ error: "At least one field to update is required" });
        }

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.authorId !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to update this post" });
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { 
                ...(title && { title }),
                ...(content && { content })
            }
        });
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: "Failed to update post" });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = parseInt(req.params.id);
        
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.authorId !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to delete this post" });
        }

        await prisma.post.delete({ where: { id: postId } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: "Failed to delete post" });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            where: { authorId: req.user.id },
            include: { author: true }
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ error: "Failed to fetch posts" });
    }
};

module.exports = {
    createPost,
    updatePost,
    deletePost,
    getPosts
};