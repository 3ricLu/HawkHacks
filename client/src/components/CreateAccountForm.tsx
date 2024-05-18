import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

const CreateAccountForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
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
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    try {
      const response = await fetch("/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setSuccess("Account created successfully! You can now log in.");
        setErrors({});
        navigate("/login");
      } else {
        const errorData = await response.json();
        setErrors(
          errorData.errors || {
            general: "An error occurred during account creation",
          }
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
      <div className="text-base text-white mt-1">
        Explore the world of working together.
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col w-1/3">
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
        <input
          className="rounded-xl bg-purple-100 h-9 text-white p-2 ml-2 mr-2 placeholder-white"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        {errors.username && <p className="error">{errors.username}</p>}
        {errors.password && <p className="error">{errors.password}</p>}
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}
        {errors.general && <p className="error">{errors.general}</p>}
        <button
          type="submit"
          className="rounded-xl bg-gray-200 h-9 text-white p-2 mb-2 ml-2 mr-2 placeholder-white mt-8"
        >
          Create Account
        </button>
        {success && <p className="success">{success}</p>}
        <p className="text-white text-center">
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </form>
    </div>
  );
};

export default CreateAccountForm;
