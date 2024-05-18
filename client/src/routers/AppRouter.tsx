import { BrowserRouter, Route, Routes } from "react-router-dom";

// Importing Pages
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ListingsPage from "../pages/ListingsPage";
import GroupPage from "../pages/GroupPage";
import ProfilePage from "../pages/ProfilePage";

function AppRouter() {
  // Setting the default title
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/listing" element={<ListingsPage />} />
        <Route path="/group" element={<GroupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
