import React from "react";

const Filter = props => (
  <div>
    find countries:{" "}
    <input value={props.countryFilter} onChange={props.handleCountryFilter} />
  </div>
);

export default Filter;
