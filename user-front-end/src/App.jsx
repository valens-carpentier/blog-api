import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedPage from './components/FeedPage';
import PostPage from './components/PostPage';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/post/:id" element={<PostPage />} />
            </Routes>
        </Router>
    );
}

export default App;
