import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function WeatherApi() {
    const [location, setLocation] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    const fetchWeather = async (location) => {
        try {
            let city;

            // Check if the input is an IP address
            const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

            if (ipPattern.test(location)) {
                // Fetch location details by IP
                const locationResponse = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=d5ae2508c47845e8815f9eb8d4e0419c&ip=${location}`);
                city = locationResponse.data.city;
            } else {
                // Assume the input is a city name
                city = location;
            }

            // Fetch weather details using city name
            const weatherResponse = await axios.get(`https://api.weatherapi.com/v1/current.json?key=8f99b1edf8324f9f89b175827243107&q=${city}`);
            setWeather(weatherResponse.data);
            setError(null);
        } catch (err) {
            setError('Error fetching weather data');
            console.error(err);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchWeather(location);
    };

    return (
        <div className="container mt-5">
            <h2>Weather Information</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Enter Location (IP or City):</label>
                    <input
                        type="text"
                        className="form-control"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Get Weather</button>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>}
            {weather && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h4 className="card-title">{weather.location.name}, {weather.location.country}</h4>
                        <p className="card-text">Temperature: {weather.current.temp_c}°C</p>
                        <p className="card-text">Condition: {weather.current.condition.text}</p>
                        <img src={weather.current.condition.icon} alt="Weather condition icon" />
                    </div>
                </div>
            )}
        </div>
    );
}



