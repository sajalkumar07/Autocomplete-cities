import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const SearchCities = () => {
  const [query, setQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const filterCities = (cities, query) => {
    const regex = new RegExp(`^${query}`, 'i'); 
    const filtered = cities.filter(city => regex.test(city));

    if (filtered.length < 10) {
      const regexEnd = new RegExp(`${query}$`, 'i');
      const endFiltered = cities.filter(city => regexEnd.test(city) && !filtered.includes(city));
      filtered.push(...endFiltered.slice(0, 10 - filtered.length));
    }

    if (filtered.length < 10) {
      const regexMiddle = new RegExp(query, 'i'); 
      const middleFiltered = cities.filter(city => regexMiddle.test(city) && !filtered.includes(city));
      filtered.push(...middleFiltered.slice(0, 10 - filtered.length));
    }

    return filtered.slice(0, 10);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (query.length >= 3) {
        try {
          const response = await axios.get(`https://countriesnow.space/api/v0.1/countries/population/cities`);
          const cities = response.data.data.map(place => place.city); // Correct data extraction
          const filtered = filterCities(cities, query);
          setFilteredCities(filtered);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error fetching city data:', error);
          setFilteredCities([]);
          setShowDropdown(false);
        }
      } else {
        setFilteredCities([]);
        setShowDropdown(false);
      }
    };

    fetchData();
  }, [query]);

  const handleInputChange = (event) => {
    const userInput = event.target.value;
    setQuery(userInput);
  };

  const handleSelectCity = (city) => {
    setQuery(city);
    setShowDropdown(false);
  };

  return (
    <div className="search-container">
      <input 
        type="text" 
        value={query} 
        onChange={handleInputChange} 
        placeholder="Search cities..." 
        className="search-input"
      />
      {showDropdown && (
        <ul className="dropdown">
          {filteredCities.map((city, index) => (
            <li key={index} onClick={() => handleSelectCity(city)}>{city}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchCities;
