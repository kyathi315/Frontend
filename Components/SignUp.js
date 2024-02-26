import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import "../Lables/SignUp.css"
import "../Lables/SignUp.css";

function SignUp() {
   const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      image: e.target.files[0], // Directly store the file
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };



  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!formData.username) {
      formIsValid = false;
      toast.error("Username is required.");
    }

    if (!formData.email) {
      formIsValid = false;
      toast.error("Email is required.");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formIsValid = false;
      toast.error("Email is not valid.");
    }

    if (!formData.password) {
      formIsValid = false;
      toast.error("Password is required.");
    } else if (formData.password.length < 8) {
      formIsValid = false;
      toast.error("Password must be at least 8 characters long.");
    } else if (!/[A-Z]/.test(formData.password)) {
      formIsValid = false;
      toast.error("Password must contain at least one uppercase letter.");
    } else if (!/[a-z]/.test(formData.password)) {
      formIsValid = false;
      toast.error("Password must contain at least one lowercase letter.");
    } else if (!/[0-9]/.test(formData.password)) {
      formIsValid = false;
      toast.error("Password must contain at least one number.");
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      formIsValid = false;
      toast.error("Password must contain at least one special character.");
    }

    setErrorMessages(errors);
    return formIsValid;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("password", formData.password);
    data.append("email", formData.email);
    if (formData.image) {
      data.append("image", formData.image); // Append the file
    }

    try {
      await axios.post("http://localhost:8080/users/register", data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      toast.success("Registration successful!", {
        onClose: () => navigate("/"),
        autoClose: 5000,
      });
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div id="signup-login-box" className="signup-page">
      <ToastContainer position="top-center" />
      <form className="signup-left" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            value={formData.username}
            className="signup-input"
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            onChange={handleChange}
            value={formData.email}
            className="signup-input"
          />
        </div>
        <div className="input-group password-input-group">
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              className="signup-input password-input"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="password-eye-icon"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <div className="input-group">
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="signup-input"
          />
        </div>
        <input
          type="submit"
          value="Sign me up"
          className="signup-submit"
        />
      </form>
      <div className="signup-right">
        <span className="signup-loginwith">
          Sign in with
          <br />
          social network
        </span>
        <button className="signup-social-signin" style={{ backgroundColor: "#32508E" }}>
          Log in with Facebook
        </button>
        <button className="signup-social-signin" style={{ backgroundColor: "#55ACEE" }}>
          Log in with Twitter
        </button>
        <button className="signup-social-signin" style={{ backgroundColor: "#DD4B39" }}>
          Log in with Google+
        </button>
      </div>
      <div className="signup-or">OR</div>
    </div>
 
  );
}

export default SignUp;