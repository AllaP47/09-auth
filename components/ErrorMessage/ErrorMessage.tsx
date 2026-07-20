import React from 'react';


interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message = 'Something went wrong.' 
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px', color: '#dc3545' }}>
      <p style={{ fontSize: '16px', fontWeight: '500' }}>⚠️ {message}</p>
    </div>
  );
};
