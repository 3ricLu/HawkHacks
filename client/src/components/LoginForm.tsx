import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

interface LoginFormProps {
  onLogin: (username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setSuccess("Login successful! Redirecting to profile page...");
        setErrors({});
        onLogin(formData.username);
        navigate("/profile");
      } else {
        const errorData = await response.json();
        setErrors(
          errorData.errors || { general: "Invalid username or password" }
        );
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    }
  };

  return (
    <div className="App flex flex-col h-screen bg-gray-100 items-center pt-24">
      <img className="w-52 h-52" src={logo}></img>
      <div className="text-4xl text-white">Converge</div>
      <div className="text-base text-white mt-2">
        Explore the world of working together.
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col text-white w-1/3">
        <input
          className="rounded-xl bg-purple-100 h-9 text-white p-2 m-2 mt-5 placeholder-white"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          className="rounded-xl bg-purple-100 h-9 text-white p-2 mb-2 ml-2 mr-2 placeholder-white"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.username && <p className="error">{errors.username}</p>}
        {errors.password && <p className="error">{errors.password}</p>}
        {errors.general && <p className="error">{errors.general}</p>}
        <button
          type="submit"
          className="rounded-xl bg-gray-200 h-9 text-white p-2 mb-2 ml-2 mr-2 placeholder-white mt-2"
        >
          Login
        </button>
        {success && <p className="success">{success}</p>}
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/create-account">Create one here</Link>.
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
