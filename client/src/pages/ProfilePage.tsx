import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

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
          const tagsArray = Array.isArray(data.user.tags) ? data.user.tags[0].split(',') : [];
          const userProfileData: UserProfile = { ...data.user, tags: tagsArray };
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

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App flex flex-row h-screen">
      <Navigation />
      <div className="home-screen-container flex flex-col w-full h-full overflow-y-scroll p-10">
        <h1 className="text-3xl mb-5">Profile Page</h1>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <strong>Name:</strong> {userProfile.name}
          </div>
          <div className="flex flex-col">
            <strong>Surname:</strong> {userProfile.surname}
          </div>
          <div className="flex flex-col">
            <strong>Email:</strong> {userProfile.email}
          </div>
          <div className="flex flex-col">
            <strong>Age:</strong> {userProfile.age}
          </div>
          <div className="flex flex-col">
            <strong>Tags:</strong> {userProfile.tags.join(', ')}
          </div>
          <div className="flex flex-col">
            <strong>Headline:</strong> {userProfile.headline}
          </div>
          <div className="flex flex-col">
            <strong>Bio:</strong> {userProfile.bio}
          </div>
          <div className="flex flex-col">
            <strong>Resume:</strong>
            <div className="mt-1 ">
              {userProfile.resume ? (
                <a
                  href={`/uploads/${userProfile.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Download
                </a>
              ) : (
                'No resume uploaded'
              )}
            </div>
          </div>
          <Link
            to="/edit-profile"
            className="bg-blue-500 text-blue p-2 rounded mt-4 text-center"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
