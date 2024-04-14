import React, { useState, useEffect } from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, CircularProgress, TableSortLabel, TextField } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import "./Home.css"

const Home = () => {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    axios.get('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20')
      .then(response => {
        setCities(response.data.results);
        setFilteredCities(response.data.results);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching city data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.body.classList.add('home');
  
    return () => {
      document.body.classList.remove('home');
    };
  }, []);

  const handleSearchChange = (event, value) => {
    if (!value) {
      setFilteredCities(cities); // If no search term, display all cities
    } else {
      const filtered = cities.filter(city =>
        city.name.toLowerCase() === value.toLowerCase() // Filter by exact match of city name
      );
      setFilteredCities(filtered);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    if (sortConfig.key !== null) {
      const sortedCities = [...filteredCities].sort((a, b) => {
        if (sortConfig.key === 'Day High/Low') {
          const aTemp = a.temp_max;
          const bTemp = b.temp_max;
          return sortConfig.direction === 'asc' ? aTemp - bTemp : bTemp - aTemp;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        }
      });
      setFilteredCities(sortedCities);
    }
  }, [sortConfig, filteredCities]);

  const getWeatherInfo = async (city) => {
    try {
      const apiKey = '571c885aac00005d0b77de2837251cbf'; 
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=${apiKey}&units=metric`);
      return {
        ...city,
        temp_max: response.data.main.temp_max,
        temp_min: response.data.main.temp_min,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return city;
    }
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const citiesWithWeather = await Promise.all(cities.map(city => getWeatherInfo(city)));
        setCities(citiesWithWeather);
        if (selectedCity) {
          const selectedWeather = citiesWithWeather.find(city => city.name === selectedCity);
          setFilteredCities([selectedWeather]);
        } else {
          setFilteredCities(citiesWithWeather);
        }
        setLoading(false);
      } catch (error) {
        setError('Error fetching weather data:', error);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [cities, selectedCity]);

  const handleSelect = (event, value) => {
    setSelectedCity(value);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='background'>
      <div className="search-input">
        <Autocomplete
          className="sear"
          options={cities.map(city => city.name)}
          onChange={handleSearchChange}
          onSelect={handleSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search For a City"
              variant="outlined"
            />
          )}
        />
        <i className="search-icon">🔍</i>
      </div>
      <div className='headings'> 
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="highlight-column">
                  <TableSortLabel
                    className="bold-heading"
                    active={sortConfig.key === 'name'}
                    direction={sortConfig.key === 'name' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('name')}
                  >
                    City Name
                  </TableSortLabel>
                </TableCell>
                <TableCell className="highlight-column">
                  <TableSortLabel
                    className="bold-heading"
                    active={sortConfig.key === 'cou_name_en'}
                    direction={sortConfig.key === 'cou_name_en' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('cou_name_en')}
                  >
                    Country
                  </TableSortLabel>
                </TableCell>
                <TableCell className="highlight-column">
                  <TableSortLabel
                    className="bold-heading"
                    active={sortConfig.key === 'timezone'}
                    direction={sortConfig.key === 'timezone' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('timezone')}
                  >
                    Timezone
                  </TableSortLabel>
                </TableCell>
                <TableCell className="highlight-column">
                  <TableSortLabel
                    className="bold-heading"
                    active={sortConfig.key === 'population'}
                    direction={sortConfig.key === 'population' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('population')}
                  >
                    Population
                  </TableSortLabel>
                </TableCell>
                <TableCell className="highlight-column">
                  <TableSortLabel
                    className="bold-heading"
                    active={sortConfig.key === 'Day High/Low'}
                    direction={sortConfig.key === 'Day High/Low' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('Day High/Low')}
                  >
                    Day High/Low
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCities.map(city => (
                <TableRow key={city.geoname_id}>
                  <TableCell>
                    <Link to={`/weather/${city.name}`} target="_blank">{city.name}</Link>
                  </TableCell>
                  <TableCell>{city.cou_name_en}</TableCell>
                  <TableCell>{city.timezone}</TableCell>
                  <TableCell>{city.population}</TableCell>
                  <TableCell>{city.temp_max > 25 ? 'High' : 'Low'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Home;
