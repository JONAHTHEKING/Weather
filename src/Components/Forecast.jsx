// Forecast.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const Forecast = () => {
  const { lat, lon, cnt } = useParams();
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = '571c885aac00005d0b77de2837251cbf';

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=${cnt}&appid=${apiKey}&units=metric`);
        setForecastData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
        setError('Error fetching forecast data');
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [lat, lon, cnt, apiKey]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!forecastData) {
    return <div>No forecast data available for {lat}, {lon}</div>;
  }

  return (
    <div>
      <Typography variant="h4">Weather Forecast</Typography>
      {forecastData.list.map((item, index) => (
        <div key={index}>
          <Typography variant="body1">Date: {new Date(item.dt * 1000).toLocaleDateString()}</Typography>
          <Typography variant="body1">Temperature High: {item.temp.max}°C</Typography>
          <Typography variant="body1">Temperature Low: {item.temp.min}°C</Typography>
          <Typography variant="body1">Weather: {item.weather[0].description}</Typography>
          <Typography variant="body1">Humidity: {item.humidity}%</Typography>
          <Typography variant="body1">Wind Speed: {item.speed} m/s</Typography>
          <Typography variant="body1">Pressure: {item.pressure} hPa</Typography>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Forecast;
