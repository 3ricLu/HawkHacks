import * as React from 'react';
import { useState } from 'react';

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        surname: '',
        email: '',
        age: '',
        headline: '',
        bio: '',
    });
    const [tags, setTags] = useState<string[]>([]);
    const [resume, setResume] = useState<File | null>(null);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setTags([...tags, value]);
        } else {
            setTags(tags.filter(tag => tag !== value));
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setResume(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const adjustedFormData = {
            ...formData,
            age: parseInt(formData.age, 10),
            tags: tags,  // Use the tags array
        };

        const formDataObject = new FormData();
        for (const key in adjustedFormData) {
            formDataObject.append(key, (adjustedFormData as any)[key]);
        }
        if (resume) {
            formDataObject.append('resume', resume);
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                body: formDataObject,
            });

            if (response.ok) {
                console.log('Registration successful');
                setSuccess('Registration successful! You can now log in.');
                setErrors({});
            } else {
                const errorData = await response.json();
                console.log('Error data:', errorData); // Log the error data for debugging
                setErrors(errorData.errors || { general: 'An error occurred during registration' });
            }
        } catch (error) {
            console.error('Network error:', error);
            setErrors({ general: 'Network error. Please try again.' });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
            />
            <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
            />
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
                        onChange={handleCheckboxChange}
                    />
                    Front-end
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Back-end"
                        onChange={handleCheckboxChange}
                    />
                    Back-end
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Full-Stack"
                        onChange={handleCheckboxChange}
                    />
                    Full-Stack
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="CyberSecurity"
                        onChange={handleCheckboxChange}
                    />
                    CyberSecurity
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="UI/UX"
                        onChange={handleCheckboxChange}
                    />
                    UI/UX
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Finance"
                        onChange={handleCheckboxChange}
                    />
                    Finance
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Accounting"
                        onChange={handleCheckboxChange}
                    />
                    Accounting
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="HR"
                        onChange={handleCheckboxChange}
                    />
                    HR
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Operations"
                        onChange={handleCheckboxChange}
                    />
                    Operations
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Marketing"
                        onChange={handleCheckboxChange}
                    />
                    Marketing
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Health"
                        onChange={handleCheckboxChange}
                    />
                    Health
                </label>
                <label>
                    <input
                        type="checkbox"
                        value="Physical Labour"
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

            {errors.username && <p className="error">{errors.username}</p>}
            {errors.password && <p className="error">{errors.password}</p>}
            {errors.general && <p className="error">{errors.general}</p>}

            <button type="submit">Register</button>

            {success && <p className="success">{success}</p>}
        </form>
    );
};

export default RegistrationForm;
