import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const ProfilePage: React.FC = () => {
  const profile: ProfileData = {
    name: 'John',
    surname: 'Doe',
    email: 'john.doe@example.com',
    age: 30,
    tags: ["Front-end", "UI/UX"],
    headline: "Senior Front-end Developer",
    bio: "Experienced developer specializing in React and TypeScript.",
  };

  return (
    <div className="App flex flex-row h-screen">
      <Navigation />
      <div className="home-screen-container flex flex-col w-full h-full overflow-y-scroll p-10">
        <h1 className="text-3xl mb-5">Profile Page</h1>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <strong>Name:</strong> {profile.name}
          </div>
          <div className="flex flex-col">
            <strong>Surname:</strong> {profile.surname}
          </div>
          <div className="flex flex-col">
            <strong>Email:</strong> {profile.email}
          </div>
          <div className="flex flex-col">
            <strong>Age:</strong> {profile.age}
          </div>
          <div className="flex flex-col">
            <strong>Tags:</strong> {profile.tags.join(", ")}
          </div>
          <div className="flex flex-col">
            <strong>Headline:</strong> {profile.headline}
          </div>
          <div className="flex flex-col">
            <strong>Bio:</strong> {profile.bio}
          </div>
          <Link to="/edit-profile" className="bg-blue-500 text-blue p-2 rounded mt-4 text-center">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
