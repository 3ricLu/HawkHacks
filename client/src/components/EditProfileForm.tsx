import React, { useState } from 'react';

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

interface EditProfileFormProps {
  userProfile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ userProfile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setFormData({ ...formData, tags: [...formData.tags, value] });
    } else {
      setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== value) });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResume(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataObject = new FormData();
    for (const key in formData) {
      formDataObject.append(key, (formData as any)[key]);
    }
    if (resume) {
      formDataObject.append('resume', resume);
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        body: formDataObject,
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess('Profile updated successfully!');
        setErrors({});
        onSave(formData);
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: 'An error occurred during profile update' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    }
  };

  const allTags = [
    "Front-end", "Back-end", "Full-Stack", "CyberSecurity", "UI/UX", 
    "Finance", "Accounting", "HR", "Operations", "Marketing", 
    "Health", "Physical Labour"
  ];

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        type="text"
        name="surname"
        value={formData.surname}
        onChange={handleChange}
        placeholder="Surname"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
      />
      <input
        type="text"
        name="headline"
        value={formData.headline}
        onChange={handleChange}
        placeholder="Headline"
      />
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Bio"
      />
      <div>
        {allTags.map(tag => (
          <label key={tag}>
            <input
              type="checkbox"
              value={tag}
              checked={formData.tags.includes(tag)}
              onChange={handleCheckboxChange}
            />
            {tag}
          </label>
        ))}
      </div>
      <input
        type="file"
        name="resume"
        onChange={handleFileChange}
        placeholder="Resume Upload"
      />

      {errors.general && <p className="error">{errors.general}</p>}

      <button type="submit">Save</button>

      {success && <p className="success">{success}</p>}
    </form>
  );
};

export default EditProfileForm;
