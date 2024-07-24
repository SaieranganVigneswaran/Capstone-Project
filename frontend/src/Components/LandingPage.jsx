import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import ParticlesBg from 'particles-bg';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Fetch temperature from weather API
const fetchTemperature = async () => {
  const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=YOUR_API_KEY&units=metric');
  const data = await response.json();
  return data.main.temp;
};

const LandingPage = () => {
  const [dateTime, setDateTime] = useState('');
  const [temperature, setTemperature] = useState('');
  const [clock, setClock] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Handle mouse movement for 3D card effect
    const handleMouseMove = (event) => {
      const card = document.querySelector('.card');
      if (card) {
        const x = (window.innerWidth - event.pageX * 2) / 100;
        const y = (window.innerHeight - event.pageY * 2) / 100;
        card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
      }
    };

    // Update date and time
    const updateDateTime = () => {
      const now = new Date();
      setDateTime(format(now, 'MMMM dd, yyyy HH:mm:ss'));
      setClock(format(now, 'HH:mm:ss'));
    };

    // Fetch weather data
    const fetchWeather = async () => {
      const temp = await fetchTemperature();
      setTemperature(`${temp}°C`);
    };

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    updateDateTime();
    fetchWeather();

    // Update date and time every second
    const interval = setInterval(() => {
      updateDateTime();
    }, 1000); // Update every second

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="landing-page">
      <ParticlesBg type="cobweb" bg={true} />
      <div className="hero-section">
        <h1 className="neon-text">Welcome to Employee Management Platform</h1>
        <p className="neon-text">One platform for all your management needs</p>
        <a href="/next" className="cta-button">Get Started</a>
      </div>
      <div className="content">
        <div className="card-container">
          <div className="card">
            <div className="card-content">
              <h2 className="neon-text">Innovative Features</h2>
              <p>Explore the cutting-edge tools that make managing employees a breeze.</p>
            </div>
            <div className="card-back">
              <h2 className="neon-text">More Info</h2>
              <p>Discover additional features and benefits of our platform.</p>
            </div>
          </div>
        </div>
        <div className="pin-container">
          <div className="pin">
            <div className="pin-content">
              <div className="pin-date-time">{dateTime}</div>
              <div className="pin-temperature">{temperature}</div>
            </div>
          </div>
        </div>
        <div className="scroll-beam"></div>
      </div>
      <footer className="footer">
        <p>© 2024 CapstoneTech. All rights reserved.</p>
      </footer>
      <div className="clock-container">
        <div className="clock">{clock}</div>
      </div>
    </div>
  );
};

export default LandingPage;
