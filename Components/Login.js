import React, { useState } from "react";
import "../Lables/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookSquare,
  faGooglePlusSquare,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";
import Swal from "sweetalert2";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.warning('Please enter both username and password!');
      return;
    }

    try {
      const { data } = await axios.post('http://localhost:8080/users/login', { username, password });
      console.log("Login successful", data);
      toast.success('Logged in successfully', {
        onClose: () => navigate("/Student"),
        autoClose: 5000,
      });
    }  catch (error) {
      console.error("Login error", error);
 
      if (error.response && error.response.data) {
  
        if (error.response.data === 400) {
          toast.error('Incorrect password!');
        } else {
         
          toast.error(error.response.data);
        }
      } else {
      
        toast.error('Login failed!');
      }
    }
  }
  
  

  return (
    <div className="login-page">
    <div className="container">
      <div className="d-flex justify-content-center h-100">
        <div className="card">
          <div className="card-header">
          <div className="d-flex justify-content-center social_icon">
              <span style={{ color: "white", margin: "0 10px" }}>
                {" "}
                <FontAwesomeIcon icon={faFacebookSquare} />
              </span>
              <span style={{ color: "white", margin: "0 10px" }}>
                <FontAwesomeIcon icon={faGooglePlusSquare} />
              </span>
              <span style={{ color: "white", margin: "0 10px" }}>
                <FontAwesomeIcon icon={faTwitterSquare} />
              </span>
            </div>
            <h3>Sign In</h3>
            
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-group form-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faKey} />
                  </span>
                </div>
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="row align-items-center remember">
                <input type="checkbox" />
                Remember Me
              </div>
              <div className="form-group">
                <input
                  type="submit"
                  value="Login"
                  className="btn float-right login_btn"
                />
              </div>
            </form>
          </div>
          <div className="card-footer">
            <div className="d-flex justify-content-center links m-30 pb-10" style={{paddingBottom:"20px"}}>
              Don't have an account?<Link to="/SignUp"><a href="#">Sign Up</a></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Login;

