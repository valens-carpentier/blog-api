import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/feed.css';

const API_URL = 'http://localhost:3000/api';

function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${API_URL}/posts/published`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="feed-container">
            <h1 className="feed-title">Blog Posts</h1>
            <div className="posts-grid">
                {posts.map((post, index) => (
                    <div 
                        key={post.id} 
                        onClick={() => navigate(`/post/${post.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <article className="post-card">
                            <span className="post-number">
                                {index + 1}.
                            </span>
                            <h2 className="post-title">
                                {post.title}
                            </h2>
                        </article>
                        <div className="post-meta">
                            by {post.author?.username || 'Anonymous'} {' '}
                            {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeedPage;