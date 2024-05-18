import { BrowserRouter, Route, Routes } from "react-router-dom";
import("../App.css");
// Importing Pages
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ListingsPage from "../pages/ListingsPage";
import GroupPage from "../pages/GroupPage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";

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
        <Route path="/edit-profile" element={<EditProfilePage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
