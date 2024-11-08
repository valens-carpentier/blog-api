import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/admin.css';

const API_URL = import.meta.env.VITE_API_URL;

function AdminPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${API_URL}/author/posts`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
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

    const togglePublished = async (postId, currentStatus) => {
        try {
            const response = await fetch(`${API_URL}/author/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ published: !currentStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            const updatedPost = await response.json();
            setPosts(posts.map(post => post.id === postId ? updatedPost : post));
        } catch (err) {
            setError(err.message);
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await fetch(`${API_URL}/author/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            setPosts(posts.filter(post => post.id !== postId));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="hn-container">
            <div className="hn-header">
                <h1 className="hn-title">Admin Page</h1>
                <button className="hn-button hn-logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <p className="hn-welcome">Welcome to the admin dashboard!</p>
            <button className="hn-button" onClick={() => navigate('/create-post')}>Create New Post</button>
            <ul className="hn-post-list">
                {posts.map(post => (
                    <li key={post.id} className="hn-post-item">
                        <h2 className="hn-post-title">{post.title}</h2>
                        <p className="hn-post-content">{post.content}</p>
                        <p className="hn-post-date">Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
                        <button className="hn-button" onClick={() => navigate(`/update-post/${post.id}`)}>Update</button>
                        <button className="hn-button" onClick={() => togglePublished(post.id, post.published)}>
                            {post.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <button className="hn-button" onClick={() => deletePost(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AdminPage;