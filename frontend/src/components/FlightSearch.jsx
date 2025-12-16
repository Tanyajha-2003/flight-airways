import React, { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';

const FlightSearch = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    departure_city: '',
    arrival_city: '',
    sort: 'departure_time',
    minPrice: '',
    maxPrice: ''
  });
  
  const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Jaipur', 'Ahmedabad', 'Goa'];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };
  
  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <div className="card mb-8">
      <div className="flex items-center gap-3 mb-6">
        <FiSearch className="text-2xl text-purple-600" />
        <h2 className="text-2xl font-bold text-purple-900">Search Flights</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium mb-2">Departure City</label>
      <select
        name="departure_city"
        value={searchParams.departure_city}
        onChange={handleChange}
        className="input-field"
      >
        <option value="">Select Departure City</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
    
    <div>
      <label className="block text-sm font-medium mb-2">Arrival City</label>
      <select
        name="arrival_city"
        value={searchParams.arrival_city}
        onChange={handleChange}
        className="input-field"
      >
        <option value="">Select Arrival City</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
    </div>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <label className="block text-sm font-medium mb-2">Min Price (₹)</label>
      <input
        type="number"
        name="minPrice"
        value={searchParams.minPrice}
        onChange={handleChange}
        placeholder="2000"
        className="input-field"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium mb-2">Max Price (₹)</label>
      <input
        type="number"
        name="maxPrice"
        value={searchParams.maxPrice}
        onChange={handleChange}
        placeholder="3000"
        className="input-field"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium mb-2">Sort By</label>
      <select
        name="sort"
        value={searchParams.sort}
        onChange={handleChange}
        className="input-field"
      >
        <option value="departure_time">Departure Time</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  </div>
  
  <div className="flex justify-center">
    <button type="submit" className="btn-primary">
      <FiSearch className="inline mr-2" />
      Search Flights
    </button>
  </div>
</form>

    </div>
  );
};

export default FlightSearch;