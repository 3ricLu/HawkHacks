import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import("../App.css");
// Importing Pages
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ListingsPage from "../pages/ListingsPage";
import GroupPage from "../pages/GroupPage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import CreateAccountForm from "../components/CreateAccountForm";
import LoginForm from "../components/LoginForm";
import { useEffect, useState } from "react";

function AppRouter() {
  // Setting the default title
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user is authenticated
    const user = sessionStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (username: string) => {
    sessionStorage.setItem("user", username);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    setIsAuthenticated(false);
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/listing" element={<ListingsPage />} />
        <Route path="/group" element={<GroupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        <Route path="/create-account" element={<CreateAccountForm />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/profile" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
