import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchCities = () => {
  const [query, setQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (query.length >= 3) {
        try {
          const response = await axios.get(`https://autocomplete.travelpayouts.com/places2?locale=en&types[]=city&term=${query}`);
          const cities = response.data.map(place => place.name);
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

  const dropdownStyles = `
    .dropdown {
      position: absolute;
      z-index: 1;
      background-color: #fff;
      border: 1px solid #ccc;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      list-style-type: none;
      padding: 0;
      margin: 0;
      width: calc(100% - 2px); /* Adjust width to match input */
    }

    .dropdown li {
      padding: 8px 16px;
      cursor: pointer;
    }

    .dropdown li:hover {
      background-color: #f0f0f0;
    }
  `;

  return (
    <div>
      <style>{dropdownStyles}</style>
      <input 
        type="text" 
        value={query} 
        onChange={handleInputChange} 
        placeholder="Search cities..." 
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
