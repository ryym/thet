import React from 'react';

export default function Messages({ message, dismiss }) {
  if (!message) {
    return null;
  }
  return (
    <p style={{ backgroundColor: '#e99', padding: 10 }}>
      <b>{message}</b>
      {' '}
      <a onClick={dismiss} style={{ cursor: 'pointer' }}>
        Dismiss
      </a>
    </p>
  );
}
