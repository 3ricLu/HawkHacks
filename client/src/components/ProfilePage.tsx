import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "./ProfileForm";
import EditProfileForm from "./EditProfileForm";
import CreateListingForm from "./CreateListingForm";
import ListingsPage from "./ListingsPage";
import logo from "../assets/logo.png";

interface UserProfile {
  username: string;
  name: string;
  surname: string;
  email: string;
  age: number;
  tags: string[];
  headline: string;
  bio: string;
  resume: string;
}

interface Listing {
  title: string;
  description: string;
  people_needed: number;
  price: number;
  elo: number;
}

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCreatingListing, setIsCreatingListing] = useState<boolean>(false);
  const [viewListings, setViewListings] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched profile data:", data);

          // Ensure tags is an array of strings
          const tagsArray = Array.isArray(data.user.tags)
            ? data.user.tags[0].split(",")
            : [];

          const userProfileData: UserProfile = {
            ...data.user,
            tags: tagsArray, // Split the tags string into an array
          };
          console.log("Processed profile data:", userProfileData);
          setUserProfile(userProfileData);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    const processedProfile: UserProfile = {
      ...updatedProfile,
      tags: Array.isArray(updatedProfile.tags)
        ? updatedProfile.tags
        : (updatedProfile.tags[0] as string).split(","),
    };
    setUserProfile(processedProfile);
    setIsEditing(false);
  };

  const handleSaveListing = (newListing: Listing) => {
    // Handle saving the new listing
    setIsCreatingListing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCreateListingClick = () => {
    setIsCreatingListing(true);
  };

  const handleViewListingsClick = () => {
    setViewListings(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        sessionStorage.removeItem("user");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  if (!userProfile) {
    return (
      <div className="loading-screen-container w-screen h-screen bg-purple-200 items-center">
        <img
          className="logo object-scale-down w-1/3 pt-10"
          src={logo}
          alt="Converge Logo"
        />
      </div>
    );
  }

  const isProfileComplete =
    userProfile.name &&
    userProfile.surname &&
    userProfile.email &&
    userProfile.age;

  if (!isProfileComplete) {
    return (
      <ProfileForm
        userProfile={userProfile}
        onSave={handleSaveProfile}
        onLogout={handleLogout}
      />
    );
  }

  if (isEditing) {
    return (
      <EditProfileForm userProfile={userProfile} onSave={handleSaveProfile} />
    );
  }

  if (isCreatingListing) {
    return <CreateListingForm onSave={handleSaveListing} />;
  }

  if (viewListings) {
    return <ListingsPage />;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Username: {userProfile.username}</p>
      <p>Name: {userProfile.name}</p>
      <p>Surname: {userProfile.surname}</p>
      <p>Email: {userProfile.email}</p>
      <p>Age: {userProfile.age}</p>
      <p>Headline: {userProfile.headline}</p>
      <p>Bio: {userProfile.bio}</p>
      <p>Tags: {userProfile.tags.join(", ")}</p>
      <p>
        Resume:{" "}
        {userProfile.resume ? (
          <a
            href={`/uploads/${userProfile.resume}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        ) : (
          "No resume uploaded"
        )}
      </p>
      <button onClick={handleEditClick}>Edit Profile</button>
      <button onClick={handleCreateListingClick}>Create Listing</button>
      <button onClick={handleViewListingsClick}>View Listings</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
