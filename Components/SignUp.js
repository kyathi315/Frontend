import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";
import "../Lables/SignUp.css";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;
  
      // Assuming you want to keep the other validations
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
      }

    setErrorMessages(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Object.values(errorMessages).forEach((msg) => toast.error(msg));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/users/register",
        formData
      );
      toast.success('registration is successfully', {
        onClose: () => navigate("/"),
        autoClose: 5000,
      });
    } catch (error) {
      console.error("Registration error", error);
 
      if (error.response && error.response.data) {
  
        if (error.response.data === 400) {
          toast.error('user already exsist');
        } else {
         
          toast.error(error.response.data);
        }
      } else {
      
        toast.error('registration error');
      }
    }
  }

  return (
    <div id="signup-login-box" className="signup-page">
      <ToastContainer position="top-center" />
      <form className="signup-left" onSubmit={handleSubmit}>
        <h1>Sign up</h1>
        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            value={formData.username}
            className="signup-input"
          />
          {errorMessages.username && (
            <div className="error">{errorMessages.username}</div>
          )}
        </div>
        <div className="input-group">
          <input
            type="text"
            name="email"
            placeholder="E-mail"
            onChange={handleChange}
            value={formData.email}
            className="signup-input"
          />
          {errorMessages.email && (
            <div className="error">{errorMessages.email}</div>
          )}
        </div>
        <div className="input-group password-input-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className={`signup-input password-input ${
              errorMessages.password ? "input-error" : ""
            }`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="password-eye-icon"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
          {errorMessages.password && (
            <div className="error">{errorMessages.password}</div>
          )}
        </div>
        <input
          type="submit"
          name="signup_submit"
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

        <button
          className="signup-social-signin signup-facebook"
          style={{ backgroundColor: "#32508E" }}
        >
          Log in with facebook
        </button>
        <button
          className="signup-social-signin signup-twitter"
          style={{ backgroundColor: "#55ACEE" }}
        >
          Log in with Twitter
        </button>
        <button
          className="signup-social-signin signup-google"
          style={{ backgroundColor: "#DD4B39" }}
        >
          Log in with Google+
        </button>
      </div>
      <div className="signup-or">OR</div>
    </div>
  );
}

export default SignUp;
