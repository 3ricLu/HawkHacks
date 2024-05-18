import * as React from 'react';
import { useState } from 'react';

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        name: '',
        age: '',
        tags: '',
        bio: '',
    });

    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const adjustedFormData = {
            ...formData,
            age: parseInt(formData.age, 10),  // Ensure age is an integer
            tags: formData.tags.split(',').map(tag => tag.trim()),  // Adjust tags to be an array
        };
        console.log('Submitting data:', adjustedFormData); // Log the data being submitted

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adjustedFormData),
            });

            if (response.ok) {
                console.log('Registration successful');
                setSuccess('Registration successful! You can now log in.');
                setErrors({});
                // Optionally redirect to login or another page
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
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
            />
            <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Tags (comma-separated)"
            />
            <input
                type="text"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Bio"
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
