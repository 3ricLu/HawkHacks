import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileForm from './ProfileForm';
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
          setUserProfile(data.user);
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
    setUserProfile(updatedProfile);
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

  

  if (!userProfile || !userProfile.name || !userProfile.surname || !userProfile.email || !userProfile.age || !userProfile.headline || !userProfile.bio) {
    return (
      <div>
        <h1>Complete Your Profile</h1>
        <ProfileForm onLogout={handleLogout} />
      </div>
    );
  }

  if (isEditing) {
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
