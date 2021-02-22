import axios from "axios";
import React, { useEffect, useState } from "react";
import Countries from "./components/Countries";
import Filter from "./components/Filter";

function App() {
  const [countries, setCountries] = useState([]);
  const [countryFilter, setCountryFilter] = useState("");

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then(response => {
      setCountries(response.data);
      console.log({response});
      
    });
  }, []);

  const handleCountryFilter = event => {
    setCountryFilter(event.target.value);
  };

  const countriesToShow =
    countryFilter.length > 0
      ? countries.filter(country =>
          country.name.toLowerCase().includes(countryFilter)
        )
      : countries;

  return (
    <div>
      <Filter
        countryFilter={countryFilter}
        handleCountryFilter={handleCountryFilter}
      />
      <Countries countries={countriesToShow} />
    </div>
  );
}

export default App;
