import React, { useState, useEffect } from "react";
import Country from "./Country";

const Countries = props => {
  const [showCountry, setShowCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState([]);

  const onClickShowCountry = country => {
    setSelectedCountry(country);
    setShowCountry(true);
  };

  useEffect(() => {
    setShowCountry(false);
  }, [props.countries]);

  if (showCountry) {
    return <Country country={selectedCountry} />;
  }

  if (props.countries && props.countries.length <= 10) {
    if (props.countries.length == 1) {
      return <Country country={props.countries[0]} />;
    } else {
      return props.countries.map(country => (
        <div>
          {country.name}{" "}
          <button onClick={() => onClickShowCountry(country)}>show</button>
        </div>
      ));
    }
  } else {
    return <div>Too many matches, specify another filter</div>;
  }
};

export default Countries;
