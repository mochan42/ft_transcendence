import React from 'react';

interface AlertProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

const Alert: React.FC<AlertProps> = ({ message, type = 'info' }) => {
  return (
    <div className={`alert ${type}`}>
      {message}
    </div>
  );
};

export default Alert;