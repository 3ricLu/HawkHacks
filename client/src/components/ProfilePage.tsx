import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditProfileForm from './EditProfileForm';

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

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched profile data:', data);

          // Ensure tags is an array of strings
          const tagsArray = Array.isArray(data.user.tags) ? data.user.tags[0].split(',') : [];

          const userProfileData: UserProfile = {
            ...data.user,
            tags: tagsArray, // Split the tags string into an array
          };
          console.log('Processed profile data:', userProfileData);
          setUserProfile(userProfileData);
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Network error:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedProfile: UserProfile) => {
    const processedProfile: UserProfile = {
      ...updatedProfile,
      tags: Array.isArray(updatedProfile.tags) ? updatedProfile.tags : (updatedProfile.tags[0] as string).split(','),
    };
    setUserProfile(processedProfile);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        sessionStorage.removeItem('user');
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  if (isEditing) {
    console.log('Editing profile with data:', userProfile);
    return <EditProfileForm userProfile={userProfile} onSave={handleSave} />;
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
      <p>Tags: {userProfile.tags.join(', ')}</p>
      <p>
        Resume: {userProfile.resume ? (
          <a href={`/uploads/${userProfile.resume}`} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        ) : (
          'No resume uploaded'
        )}
      </p>
      <button onClick={handleEditClick}>Edit Profile</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;