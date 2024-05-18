import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
  const navigate = useNavigate();
  // Finds the current path, make button component, render depending on page
  // Do this in btn component, pass in "Home" as props, if home == pathname /home, render
  // Otherwise render default unclicked button
  const currentPath = window.location.pathname;

  function handleHomeClick() {
    navigate("/home");
  }

  function handleGroupClick() {
    navigate("/group");
  }

  function handleProfileClick() {
    navigate("/profile");
  }

  function handleListingClick() {
    navigate("/listing");
  }

  function handleLogoutClick() {
    navigate("/");
  }

  return (
    <div className="nav-bar-container bg-gray-200 h-screen w-96 xl:w-1/6 md:w-80 sm:w-64 flex flex-col">
      <div className="nav-bar-top">
        <div className="logo-title flex flex-row object-contain mb-8 hover:cursor-pointer">
          <img
            className="logo object-scale-down w-1/3"
            src={logo}
            onClick={handleHomeClick}
          ></img>
          <p
            className="text-base sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-white w-2/3 font-bold text-left flex items-center"
            onClick={handleHomeClick}
          >
            SYNKER
          </p>
        </div>
        <div className="nav-bar-middle flex flex-col items-center">
          <button
            className={`btn-default h-9 flex rounded-xl w-4/5 items-left mb-5 ${
              currentPath == "/live"
                ? "bg-purple-100 hover:bg-purple-200"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={handleListingClick}
          >
            <div className="flex flex-row justify-center items-center h-full">
              <FontAwesomeIcon
                icon={faCirclePlay}
                className="object-contain h-2/4 w-5 text-white p-4"
              />
              <div className="flex btn-text text-white h-8 font-bold items-center text-base lg:text-xl sm:text-sm">
                Listing
              </div>
            </div>
          </button>
          <button
            className={`btn-default h-9 flex rounded-xl w-4/5 items-left mb-5 ${
              currentPath == "/live"
                ? "bg-purple-100 hover:bg-purple-200"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={handleGroupClick}
          >
            <div className="flex flex-row justify-center items-center h-full">
              <FontAwesomeIcon
                icon={faCirclePlay}
                className="object-contain h-2/4 w-5 text-white p-4"
              />
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
            currentPath == "/profile"
              ? "bg-purple-100 hover:bg-purple-200"
              : "bg-gray-100 hover:bg-gray-300"
          }`}
          onClick={handleProfileClick}
        >
          <div className="flex flex-row justify-center items-center h-full">
            <FontAwesomeIcon
              icon={faUser}
              className="object-contain h-2/4 w-5 text-white p-4"
            />
            <div className="flex btn-text text-white h-8 font-bold items-center text-base lg:text-xl sm:text-sm">
              PROFILE
            </div>
          </div>
        </button>
        <div className="logout-container flex flex-row h-9 flex rounded-xl w-4/5 items-left mb-12">
          <button
            className={`btn-default h-9 flex rounded-xl w-2/3 items-left ${
              currentPath == "/profile" ? "" : ""
            }`}
            onClick={handleLogoutClick}
          >
            <div className="flex flex-row justify-center items-center h-full">
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="object-contain h-2/4 w-5 text-white p-4"
              />
              <div className="flex btn-text text-white h-8 font-bold items-center text-base sm:text-sm lg:text-xl">
                LOGOUT
              </div>
            </div>
          </button>
          <div className="space w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
