import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CreateAccountForm from './components/CreateAccountForm';
import LoginForm from './components/LoginForm';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user is authenticated
    const user = sessionStorage.getItem('user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (username: string) => {
    sessionStorage.setItem('user', username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/create-account" element={<CreateAccountForm />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route
            path="/profile"
            element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route path="/" element={isAuthenticated ? <Navigate to="/profile" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
