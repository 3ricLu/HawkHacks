// src/AppRouter.tsx
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../App.css";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ListingsPage from "../pages/ListingsPage";
import GroupPage from "../pages/GroupPage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import { WalletProvider } from '../walletContext'; // Ensure this matches the actual filename
import '@near-wallet-selector/modal-ui/styles.css'; // Add this line to include the required CSS
import WalletButton from '../components/WalletButton'; // Import the WalletButton component

const AppRouter: React.FC = () => {
  return (
    <WalletProvider>
      <BrowserRouter>
        <div className="wallet-button-container">
          <WalletButton /> {/* Add the WalletButton component */}
        </div>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/listing" element={<ListingsPage />} />
          <Route path="/group" element={<GroupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default AppRouter;
