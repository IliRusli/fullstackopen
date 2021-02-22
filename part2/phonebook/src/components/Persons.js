import React from "react";

const Persons = props => {
  return props.persons.map(person => (
    <div>
      {person.name} {person.number}{" "}
      <button onClick={() => props.handleDelete(person.id)}>delete</button>
    </div>
  ));
};

export default Persons;
