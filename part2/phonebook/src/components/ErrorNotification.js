import React from "react";

const ErrorNotification = ({ message }) => {
  
  
console.log({message});

  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};

export default ErrorNotification;
