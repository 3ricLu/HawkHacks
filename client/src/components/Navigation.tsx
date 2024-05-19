import React from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faUserGroup, faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "../App.css";

const Navigation = () => {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const handleHomeClick = () => {
    navigate("/home");
  };

  const handleGroupClick = () => {
    navigate("/group");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleListingClick = () => {
    navigate("/listing");
  };

  const handleLogoutClick = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        sessionStorage.removeItem('user');
        navigate("/login");
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="nav-bar-container bg-gray-200 h-screen w-96 xl:w-1/4 md:w-80 sm:w-64 flex flex-col">
      <div className="nav-bar-top">
        <div className="logo-title flex flex-row object-contain mb-8 hover:cursor-pointer" onClick={handleHomeClick}>
          <img className="logo object-scale-down w-1/3 pl-2 pt-2 pr-3" src={logo} alt="Converge Logo" />
          <p className="text-base sm:text-2xl md:text-3xl lg:text-2xl xl:text-3xl text-white w-2/3 font-bold text-left flex items-center pt-1">
            CONVERGE
          </p>
        </div>
        <div className="nav-bar-middle flex flex-col items-center">
          <button
            className={`btn-default h-9 flex rounded-xl w-4/5 items-left mb-5 ${
              currentPath === "/listing"
                ? "bg-purple-100 hover:bg-purple-200"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={handleListingClick}
          >
            <div className="flex flex-row justify-center items-center h-full">
              <FontAwesomeIcon icon={faList} className="object-contain h-2/4 w-5 text-white p-4" />
              <div className="flex btn-text text-white h-8 font-bold items-center text-base lg:text-xl sm:text-sm">
                Listing
              </div>
            </div>
          </button>
          <button
            className={`btn-default h-9 flex rounded-xl w-4/5 items-left mb-5 ${
              currentPath === "/group"
                ? "bg-purple-100 hover:bg-purple-200"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={handleGroupClick}
          >
            <div className="flex flex-row justify-center items-center h-full">
              <FontAwesomeIcon icon={faUserGroup} className="object-contain h-2/4 w-5 text-white p-4" />
              <div className="flex btn-text text-white h-8 font-bold items-center text-base lg:text-xl sm:text-sm">
                Group
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className="nav-bar-middle-space grow"></div>
      <div className="bg-gray-100 h-1 w-fill mb-5"></div>
      <div className="nav-bar-bottom flex flex-col items-center">
        <button
          className={`btn-default h-9 flex rounded-xl w-4/5 items-left mb-5 ${
            currentPath === "/profile"
              ? "bg-purple-100 hover:bg-purple-200"
              : "bg-gray-100 hover:bg-gray-300"
          }`}
          onClick={handleProfileClick}
        >
          <div className="flex flex-row justify-center items-center h-full">
            <FontAwesomeIcon icon={faUser} className="object-contain h-2/4 w-5 text-white p-4" />
            <div className="flex btn-text text-white h-8 font-bold items-center text-base lg:text-xl sm:text-sm">
              PROFILE
            </div>
          </div>
        </button>
        <div className="logout-container flex flex-row h-9 flex rounded-xl w-4/5 items-left mb-12">
          <button className="btn-default h-9 flex rounded-xl w-full items-left" onClick={handleLogoutClick}>
            <div className="flex flex-row justify-center items-center h-full">
              <FontAwesomeIcon icon={faRightFromBracket} className="object-contain h-2/4 w-5 text-white p-4" />
              <div className="flex btn-text text-white h-8 font-bold items-center text-base sm:text-sm lg:text-xl">
                LOGOUT
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
