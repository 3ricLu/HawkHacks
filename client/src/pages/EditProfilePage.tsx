import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

interface ProfileData {
  name: string;
  surname: string;
  email: string;
  age: number;
  tags: string[];
  headline: string;
  bio: string;
  resume: File | null | string;
}

const categories = [
  "Front-end",
  "Back-end",
  "Full-Stack",
  "CyberSecurity",
  "UI/UX",
  "Finance",
  "Accounting",
  "HR",
  "Operations",
  "Marketing",
  "Health",
  "Physical Labour",
];

categories.sort();

const EditProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    surname: "",
    email: "",
    age: 0,
    tags: [],
    headline: "",
    bio: "",
    resume: null,
  });

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
          const tagsArray = Array.isArray(data.user.tags)
            ? data.user.tags[0].split(",")
            : [];
          const userProfileData: ProfileData = {
            ...data.user,
            tags: tagsArray,
            resume: data.user.resume || null,
          };
          setProfile(userProfileData);
        } else {
          console.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, age: Number(e.target.value) });
  };

  const handleTagChange = (tag: string) => {
    setProfile((prevState) => {
      const tags = prevState.tags.includes(tag)
        ? prevState.tags.filter((t) => t !== tag)
        : [...prevState.tags, tag];
      return { ...prevState, tags };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfile({ ...profile, resume: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObject = new FormData();
    for (const key in profile) {
      if (key !== "resume") {
        formDataObject.append(key, (profile as any)[key]);
      }
    }
    if (profile.resume && typeof profile.resume !== "string") {
      formDataObject.append("resume", profile.resume);
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: formDataObject,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Profile updated successfully:", data);
        navigate("/profile"); // Navigate back to the profile page after saving
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="App flex flex-row h-screen bg-gray-100">
      <Navigation />
      <div className="home-screen-container flex flex-col w-full h-full overflow-y-scroll p-10 text-white">
        <h1 className="text-3xl mb-5">Edit Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="border rounded p-2 mb-2 rounded-xl bg-purple-100 h-9 text-white p-2 mb-2 placeholder-white"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="surname">Surname</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={profile.surname}
              onChange={handleChange}
              className="border rounded p-2 mb-2 rounded-xl bg-purple-100 h-9 text-white p-2 mb-2 placeholder-white"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="border rounded p-2 mb-2 rounded-xl bg-purple-100 h-9 text-white p-2 mb-2 placeholder-white"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              value={profile.age}
              onChange={handleAgeChange}
              className="border rounded p-2 mb-2 rounded-xl bg-purple-100 h-9 text-white p-2 mb-2 placeholder-white"
            />
          </div>
          <div className="flex flex-col">
            <label>Tags</label>
            <div className="flex flex-wrap">
              {categories.map((category) => (
                <label key={category} className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    value={category}
                    checked={profile.tags.includes(category)}
                    onChange={() => handleTagChange(category)}
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="headline">Headline</label>
            <input
              type="text"
              id="headline"
              name="headline"
              value={profile.headline}
              onChange={handleChange}
              className="border rounded p-2 mb-2 rounded-xl bg-purple-100 h-9 text-white p-2 mb-2 placeholder-white"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="border rounded p-2 mb-2 rounded-xl bg-purple-100 h-24 text-white p-2 mb-2 placeholder-white"
            ></textarea>
          </div>
          <div className="flex flex-col">
            <label htmlFor="resume">Resume Upload</label>
            <input
              type="file"
              id="resume"
              name="resume"
              onChange={handleFileChange}
              className="border rounded p-2 mb-2 rounded-xl bg-purple-100 h-9 text-white p-2 mb-2 placeholder-white"
            />
            {profile.resume && typeof profile.resume === "string" && (
              <a
                href={`/uploads/${profile.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-blue-500 underline"
              >
                Download current resume
              </a>
            )}
          </div>
          <div className="flex flex-row justify-between">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="bg-gray-500 text-blue p-2 rounded mt-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-blue p-2 rounded mt-4"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
