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
import { WalletProvider } from "../walletContext"; // Ensure this matches the actual filename
import '@near-wallet-selector/modal-ui/styles.css'; // Add this line to include the required CSS
import WalletButton from '../components/WalletButton'; // Import the WalletButton component
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
    <WalletProvider>
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
    </WalletProvider>
  );
}

export default AppRouter;
