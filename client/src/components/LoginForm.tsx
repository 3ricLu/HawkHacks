import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface LoginFormProps {
  onLogin: (username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password }),
      });

      if (response.ok) {
        setSuccess('Login successful! Redirecting to profile page...');
        setErrors({});
        onLogin(formData.username);
        navigate('/profile');
      } else {
        const errorData = await response.json();
        setErrors(errorData.errors || { general: 'Invalid username or password' });
      }
    } catch (error) {
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
      {errors.username && <p className="error">{errors.username}</p>}
      {errors.password && <p className="error">{errors.password}</p>}
      {errors.general && <p className="error">{errors.general}</p>}
      <button type="submit">Login</button>
      {success && <p className="success">{success}</p>}
      <p>
        Don't have an account? <Link to="/create-account">Create one here</Link>.
      </p>
    </form>
  );
};

export default LoginForm;
