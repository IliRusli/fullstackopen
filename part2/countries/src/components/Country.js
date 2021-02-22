import React, { useEffect, useState } from "react";
import axios from "axios";

const Country = ({ country }) => {
  const api_key = process.env.REACT_APP_API_KEY;
  const [currentWeather, setCurrentWeather] = useState([]);

  useEffect(() => {
    const city = country.capital;

    axios
      .get(
        `http://api.weatherstack.com/current?access_key=${api_key}&query=${city}`
      )
      .then(response => {
        setCurrentWeather(response.data.current);
        console.log(response.data);
      });
  }, [country]);

  return (
    <div>
      <h2>{country.name}</h2>
      <div>capital {country.capital}</div>
      <div>population {country.population}</div>
      <h3>Spoken languages</h3>
      <ul>
        {country.languages.map((item, i) => (
          <li key={i}>{item.name}</li>
        ))}
      </ul>
      <img src={country.flag} width={150} height={150} />
      <h3>Weather in {country.capital}</h3>
      <div>
        <b>temperature:</b> {currentWeather.temperature} Celcius
        <div>
          <img
            src={
              currentWeather.weather_icons && currentWeather.weather_icons[0]
            }
            width={80}
            height={80}
          />
        </div>
        <b>wind:</b> {currentWeather.wind_speed} mph direction{" "}
        {currentWeather.wind_dir}
      </div>
    </div>
  );
};

export default Country;
