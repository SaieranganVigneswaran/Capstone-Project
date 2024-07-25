import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const navigate = useNavigate(); // Fixed typo from 'anvigate' to 'navigate'
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
      .then(result => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate('/'); // Redirect to home page after logout
        }
      });
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <Link to="/dashboard" className="logo-link">
            <span className="logo-text">EMS</span>
          </Link>
        </div>
        <ul className="nav-list">
          <li>
            <Link to="/dashboard" className="nav-link">
              <i className="fs-4 bi-speedometer2"></i>
              <span className="nav-text">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/employee" className="nav-link">
              <i className="fs-4 bi-people"></i>
              <span className="nav-text">Manage Employees</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/category" className="nav-link">
              <i className="fs-4 bi-columns"></i>
              <span className="nav-text">Projects</span>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/profile" className="nav-link">
              <i className="fs-4 bi-person"></i>
              <span className="nav-text">Tasks</span>
            </Link>
          </li>
          <li onClick={handleLogout}>
            <Link className="nav-link">
              <i className="fs-4 bi-power"></i>
              <span className="nav-text">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="main-content">
        <div className="header">
          <h4>Employee Management System</h4>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
