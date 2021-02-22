import "./index.css";
import React, { useEffect, useState } from "react";

import PersonForm from "../src/components/PersonForm";

import Filter from "./components/Filter";
import Persons from "./components/Persons";
import SuccessNotification from "./components/SuccessNotification";
import PhonebookServices from "./services/phonebook";
import ErrorNotification from "./components/ErrorNotification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    PhonebookServices.getAll().then(response => {
      setPersons(response);
    });
  }, []);

  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handlePhoneChange = event => {
    setNewPhone(event.target.value);
  };

  const handleNameFilter = event => {
    setNameFilter(event.target.value);
  };

  const addPerson = event => {
    event.preventDefault();
    let hasName = persons.some(
      person => person["name"].toLowerCase() === newName.toLowerCase()
    );

    if (hasName) {
      const selectedPerson = persons.find(
        person => person["name"].toLowerCase() === newName.toLowerCase()
      );
      const result = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      const changedPerson = { ...selectedPerson, number: newPhone };
      const id = selectedPerson.id;
      if (result) {
        PhonebookServices.update(id, changedPerson)
          .then(response => {
            setPersons(
              persons.map(person => (person.id !== id ? person : response))
            );
            setNewName("");
            setNewPhone("");
            setSuccessMessage(`Updated ${response.name}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch(error => {
            setErrorMessage(
              `Information of ${selectedPerson.name} has already been removed from the server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
    } else {
      const personObject = { name: newName, number: newPhone };

      PhonebookServices.create(personObject).then(response => {
        setPersons(persons.concat(response));
        setNewName("");
        setNewPhone("");
        setSuccessMessage(`Added ${response.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      });
    }
  };

  const deletePerson = id => {
    const selectedPerson = persons.find(person => person.id == id);
    const result = window.confirm(`Delete ${selectedPerson.name}?`);

    if (result) {
      PhonebookServices.deletePerson(id)
        .then(response => {
          setPersons(persons.filter(n => n.id !== id));
        })
        .catch(error => {
          setErrorMessage(
            `Information of ${selectedPerson.name} has already been removed from the server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const personsToShow =
    nameFilter.length > 0
      ? persons.filter(person => person.name.includes(nameFilter))
      : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter nameFilter={nameFilter} handleNameFilter={handleNameFilter} />
      <h2>Add a new person</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newPhone={newPhone}
        handlePhoneChange={handlePhoneChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} handleDelete={id => deletePerson(id)} />
    </div>
  );
};

export default App;
