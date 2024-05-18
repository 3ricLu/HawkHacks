import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    setFormData(userProfile);
  }, [userProfile]);

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
        const updatedProfile: UserProfile = {
          ...data.user,
          tags: data.user.tags[0].split(','), // Ensure tags are split correctly
        };
        onSave(updatedProfile); // Call onSave with the updated profile data
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: 'An error occurred during profile update' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    }
  };

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
        <label>
          <input
            type="checkbox"
            value="Front-end"
            checked={formData.tags.includes('Front-end')}
            onChange={handleCheckboxChange}
          />
          Front-end
        </label>
        <label>
          <input
            type="checkbox"
            value="Back-end"
            checked={formData.tags.includes('Back-end')}
            onChange={handleCheckboxChange}
          />
          Back-end
        </label>
        <label>
          <input
            type="checkbox"
            value="Full-Stack"
            checked={formData.tags.includes('Full-Stack')}
            onChange={handleCheckboxChange}
          />
          Full-Stack
        </label>
        <label>
          <input
            type="checkbox"
            value="CyberSecurity"
            checked={formData.tags.includes('CyberSecurity')}
            onChange={handleCheckboxChange}
          />
          CyberSecurity
        </label>
        <label>
          <input
            type="checkbox"
            value="UI/UX"
            checked={formData.tags.includes('UI/UX')}
            onChange={handleCheckboxChange}
          />
          UI/UX
        </label>
        <label>
          <input
            type="checkbox"
            value="Finance"
            checked={formData.tags.includes('Finance')}
            onChange={handleCheckboxChange}
          />
          Finance
        </label>
        <label>
          <input
            type="checkbox"
            value="Accounting"
            checked={formData.tags.includes('Accounting')}
            onChange={handleCheckboxChange}
          />
          Accounting
        </label>
        <label>
          <input
            type="checkbox"
            value="HR"
            checked={formData.tags.includes('HR')}
            onChange={handleCheckboxChange}
          />
          HR
        </label>
        <label>
          <input
            type="checkbox"
            value="Operations"
            checked={formData.tags.includes('Operations')}
            onChange={handleCheckboxChange}
          />
          Operations
        </label>
        <label>
          <input
            type="checkbox"
            value="Marketing"
            checked={formData.tags.includes('Marketing')}
            onChange={handleCheckboxChange}
          />
          Marketing
        </label>
        <label>
          <input
            type="checkbox"
            value="Health"
            checked={formData.tags.includes('Health')}
            onChange={handleCheckboxChange}
          />
          Health
        </label>
        <label>
          <input
            type="checkbox"
            value="Physical Labour"
            checked={formData.tags.includes('Physical Labour')}
            onChange={handleCheckboxChange}
          />
          Physical Labour
        </label>
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
