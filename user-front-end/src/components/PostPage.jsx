import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/styles/post.css';

const API_URL = 'http://localhost:3000/api';

function PostPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState({
        content: '',
        username: '',
        email: ''
    });
    const [editingComment, setEditingComment] = useState(null);
    const [editEmail, setEditEmail] = useState('');
    const [editContent, setEditContent] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`${API_URL}/posts/published/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch post');
                }
                const data = await response.json();
                setPost(data);
                
                // Fetch comments after post is loaded
                const commentsResponse = await fetch(`${API_URL}/posts/${id}/comments`);
                if (!commentsResponse.ok) {
                    throw new Error('Failed to fetch comments');
                }
                const commentsData = await commentsResponse.json();
                setComments(commentsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/posts/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newComment)
            });

            if (!response.ok) {
                throw new Error('Failed to post comment');
            }

            const data = await response.json();
            setComments([...comments, data]);
            setNewComment({ content: '', username: '', email: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCommentUpdate = async (commentId, updatedContent) => {
        try {
            if (!editEmail) {
                setError('Email is required to edit comment');
                return;
            }

            if (!updatedContent || updatedContent.trim() === '') {
                setError('Comment content cannot be empty');
                return;
            }

            const response = await fetch(`${API_URL}/visitors/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: updatedContent,
                    email: editEmail
                })
            });

            const data = await response.json();

            if (response.status === 403) {
                setError('The provided email does not match the original commenter\'s email');
                setShowErrorModal(true);
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update comment');
            }

            setComments(comments.map(c => 
                c.id === commentId ? data : c
            ));
            setEditingComment(null);
            setEditEmail('');
            setEditContent('');
            setError(null);
        } catch (err) {
            setError(err.message);
            setShowErrorModal(true);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!post) return <p>Post not found</p>;

    return (
        <div className="post-container">
            <button 
                className="back-button" 
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <article className="post-content">
                <h1 className="post-title">{post.title}</h1>
                <div className="post-meta">
                    by {post.author?.username || 'Anonymous'} • 
                    {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="post-body">
                    {post.content}
                </div>
            </article>
            <form onSubmit={handleCommentSubmit} className="comment-form">
                    <h3>Add a Comment</h3>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Your name"
                            value={newComment.username}
                            onChange={(e) => setNewComment({
                                ...newComment,
                                username: e.target.value
                            })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Your email"
                            value={newComment.email}
                            onChange={(e) => setNewComment({
                                ...newComment,
                                email: e.target.value
                            })}
                        />
                    </div>
                    <div className="form-group">
                        <textarea
                            placeholder="Your comment"
                            value={newComment.content}
                            onChange={(e) => setNewComment({
                                ...newComment,
                                content: e.target.value
                            })}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>

            <section className="comments-section">
                <h2>Comments</h2>
                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment.id} className="comment">
                            <div className="comment-meta">
                                <strong>{comment.visitor.username}</strong> • 
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </div>
                            {editingComment === comment.id ? (
                                <div className="comment-edit-form">
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            placeholder="Enter the email used for the original comment"
                                            value={editEmail}
                                            onChange={(e) => {
                                                setEditEmail(e.target.value);
                                                setError(null); // Clear error when user starts typing
                                            }}
                                            className={error && (error.includes('email') || error.includes('Email')) ? 'input-error' : ''}
                                            required
                                        />
                                        {error && (error.includes('email') || error.includes('Email')) && (
                                            <span className="error-message">{error}</span>
                                        )}
                                    </div>
                                    <textarea
                                        defaultValue={comment.content}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className={error && !editContent ? 'input-error' : ''}
                                        required
                                    />
                                    {error && (
                                        <div className="error-message">{error}</div>
                                    )}
                                    <div className="edit-buttons">
                                        <button 
                                            type="button" 
                                            onClick={() => handleCommentUpdate(comment.id, editContent)}
                                            disabled={!editEmail || !editContent}
                                        >
                                            Update
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                setEditingComment(null);
                                                setEditEmail('');
                                                setEditContent('');
                                                setError(null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="comment-content-wrapper">
                                    <p className="comment-content">{comment.content}</p>
                                    <button 
                                        className="edit-button"
                                        onClick={() => {
                                            setEditingComment(comment.id);
                                            setEditContent(comment.content);
                                            setError(null);
                                        }}
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default PostPage;