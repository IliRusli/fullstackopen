import React from 'react';

const Notification = ({ message, hasError = false }) => {
  if (message === null) {
    return null;
  }

  return <div className={`${hasError ? 'error' : 'success'}`}>{message}</div>;
};

export default Notification;
