// Actions for the comment (for visitors)
    // Create a comment
    // Update a comment
    // Delete a comment

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createComment = async (req, res) => {
    try {
        const { content, username, email } = req.body;
        const postId = parseInt(req.params.postId);

        if (!content || !username || !email) {
            return res.status(400).json({ 
                error: "Content, username, and email are required" 
            });
        }

        // First, find or create the visitor
        let visitor = await prisma.visitor.findUnique({
            where: { email }
        });

        if (!visitor) {
            visitor = await prisma.visitor.create({
                data: {
                    username,
                    email
                }
            });
        }

        // Create the comment
        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                visitorId: visitor.id
            },
            include: {
                visitor: true
            }
        });
        
        res.status(201).json(comment);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to create comment" });
    }
};

const updateComment = async (req, res) => {
    try {
        const { content, email } = req.body;
        const commentId = parseInt(req.params.id);

        if (!content || !email) {
            return res.status(400).json({ 
                error: "Content and email are required" 
            });
        }

        // Find the comment and include visitor information
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: { visitor: true }
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // Check if the email matches the original commenter's email
        if (comment.visitor.email !== email) {
            return res.status(403).json({ 
                error: "Not authorized to update this comment" 
            });
        }

        // Update the comment
        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { content },
            include: {
                visitor: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to update comment" });
    }
}

const deleteComment = async (req, res) => {
    try {
        const commentId = parseInt(req.params.id);
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                error: "Email is required" 
            });
        }

        // Find the comment and include visitor information
        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            include: { visitor: true }
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // Check if the email matches the original commenter's email
        if (comment.visitor.email !== email) {
            return res.status(403).json({ 
                error: "Not authorized to delete this comment" 
            });
        }

        // Delete the comment
        await prisma.comment.delete({
            where: { id: commentId }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Failed to delete comment" });
    }
}

module.exports = {
    createComment,
    updateComment,
    deleteComment
}