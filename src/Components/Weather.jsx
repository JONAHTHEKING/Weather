import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import './weather.css';

const Weather = () => {
  const { cityName } = useParams();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = '571c885aac00005d0b77de2837251cbf'; 

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
        setWeatherData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Error fetching weather data');
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [cityName, apiKey]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weatherData) {
    return <div>No weather data available for {cityName}</div>;
  }

  let weatherImageSrc = '';
  switch (weatherData.weather[0].main.toLowerCase()) {
    case 'clear':
      weatherImageSrc = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwJoNZc_2JM5BNDKpNg4YlL4Yf504TU_Fd64JsfY3yEQ&s'; // Replace with actual sunny weather image URL
      break;
    case 'clouds':
      weatherImageSrc = 'https://t4.ftcdn.net/jpg/05/13/26/73/360_F_513267391_QEmNGeOFLLqrILTnoq21dReUPp5UsoNr.jpg'; // Replace with actual cloudy weather image URL
      break;
    case 'rain':
      weatherImageSrc = 'https://media.istockphoto.com/id/1257951336/photo/transparent-umbrella-under-rain-against-water-drops-splash-background-rainy-weather-concept.jpg?s=612x612&w=0&k=20&c=lNvbIw1wReb-owe7_rMgW8lZz1zElqs5BOY1AZhyRXs='; // Replace with actual rainy weather image URL
      break;
    default:
      weatherImageSrc = 'https://www.shutterstock.com/image-photo/clear-skies-no-monsoons-normal-260nw-2093120500.jpg'; // Replace with a default image URL
      break;
  }

  return (
    <div className="weather-container">
      
    <img className="weather-image" src={weatherImageSrc} alt="Weather" />
    <div className="weather-info">
      <Typography variant="h4">Weather in {weatherData.name}</Typography>
      <Typography variant="body1">Temperature: {weatherData.main.temp}°C</Typography>
      <Typography variant="body1">Weather: {weatherData.weather[0].description}</Typography>
      <Typography variant="body1">Humidity: {weatherData.main.humidity}%</Typography>
      <Typography variant="body1">Wind Speed: {weatherData.wind.speed} m/s</Typography>
      {typeof weatherData.main.temp_max !== 'undefined' && typeof weatherData.main.temp_min !== 'undefined' && (
        <Typography variant="body1">Day High/Low: {weatherData.main.temp_max}°C/{weatherData.main.temp_min}°C</Typography>
      )}
    </div>
  </div>
  
  );
};

export default Weather;
