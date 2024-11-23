import React, { FC } from 'react';

import './loader.css';

interface LoaderProps {
  message?: string;
}

export const Loader: FC<LoaderProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <div className="loading"></div>
      <div>{message}</div>
    </div>
  );
};
