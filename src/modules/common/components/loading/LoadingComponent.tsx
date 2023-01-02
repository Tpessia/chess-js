import React from 'react';
import './LoadingComponent.scss';

const LoadingComponent: React.FC = () => {
  return (
    <div className="loading">
      <span>Carregando</span>
      <i className="fa fa-spinner fa-spin" />
    </div>
  );
};

export default LoadingComponent;
