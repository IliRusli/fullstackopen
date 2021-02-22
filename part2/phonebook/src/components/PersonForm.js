import React from "react";

const Input = props => (
  <div>
    {props.title}
    <input value={props.value} onChange={props.onChange} />
  </div>
);

const PersonForm = props => (
  <form onSubmit={props.addPerson}>
    <Input
      title={"name: "}
      value={props.newName}
      onChange={props.handleNameChange}
    />
    <Input
      title={"number: "}
      value={props.newPhone}
      onChange={props.handlePhoneChange}
    />
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

export default PersonForm;
