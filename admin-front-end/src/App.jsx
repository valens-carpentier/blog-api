import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminPage from './components/AdminPage';
import CreatePostPage from './components/CreatePostPage';
import UpdatePostPage from './components/UpdatePostPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        <Route path="/update-post/:id" element={<UpdatePostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
