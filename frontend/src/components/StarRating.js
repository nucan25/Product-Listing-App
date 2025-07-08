// src/components/StarRating.js

import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, outOf = 5 }) => {
  const percentage = (rating / outOf) * 100;

  return (
    <div className="rating">
      <div className="stars-outer">
        <div className="stars-inner" style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="rating-score">{rating.toFixed(1)} / {outOf}</div>
    </div>
  );
};

export default StarRating;
