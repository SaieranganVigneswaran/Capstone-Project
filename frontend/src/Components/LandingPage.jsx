import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import ParticlesBg from 'particles-bg';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudRain, faSnowflake } from '@fortawesome/free-solid-svg-icons';

// Fetch temperature and city name from weather API
const fetchWeatherData = async () => {
  const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=YOUR_API_KEY&units=metric'); // Replace with your actual API key
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  const data = await response.json();
  console.log(data); // Log the response to debug
  return {
    temperature: data.main.temp,
    city: data.name,
    weatherCondition: data.weather[0].main // Get weather condition
  };
};

const LandingPage = () => {
  const [dateTime, setDateTime] = useState('');
  const [temperature, setTemperature] = useState('');
  const [city, setCity] = useState(''); // Add state for city
  const [weatherCondition, setWeatherCondition] = useState(''); // Add state for weather condition
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
    };

    // Fetch weather data
    const fetchWeather = async () => {
      try {
        const { temperature, city, weatherCondition } = await fetchWeatherData();
        setTemperature(`${temperature}°C`);
        setCity(city);
        setWeatherCondition(weatherCondition); // Set weather condition state
        console.log(`Temperature: ${temperature}, City: ${city}, Condition: ${weatherCondition}`); // Log the values to debug
      } catch (error) {
        console.error('Error fetching weather data:', error); // Log any errors
      }
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

  // Choose an icon based on the weather condition
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return <FontAwesomeIcon icon={faSun} className="weather-icon" />;
      case 'Clouds':
        return <FontAwesomeIcon icon={faCloud} className="weather-icon" />;
      case 'Rain':
        return <FontAwesomeIcon icon={faCloudRain} className="weather-icon" />;
      case 'Snow':
        return <FontAwesomeIcon icon={faSnowflake} className="weather-icon" />;
      default:
        return <FontAwesomeIcon icon={faCloud} className="weather-icon" />; // Default icon for unknown weather
    }
  };

  return (
    <div className="landing-page">
      <ParticlesBg type="cobweb" bg={true} />
      <div className="hero-section">
        <h1 className="neon-text">Welcome to Project Management Portal</h1>
        <p className="neon-text">One platform for all your management needs</p>
        <a href="/next" className="cta-button">Get Started</a>
      </div>
      <div className="content">
        <div className="pin-container">
          <div className="pin">
            {getWeatherIcon(weatherCondition)} {/* Display weather icon */}
            <div className="pin-content">
              <div className="pin-temperature">{temperature}</div>
              <div className="pin-city">{city}</div> {/* Display city */}
            </div>
          </div>
        </div>
        <div className="scroll-beam"></div>
      </div>
      <footer className="footer">
        <p>© 2024 CapstoneTech. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
