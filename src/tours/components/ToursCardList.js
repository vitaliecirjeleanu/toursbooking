import React from 'react';

import TourCard from './TourCard';

import classes from './ToursCardList.module.css';

const ToursCardList = props => {
  if (props.tours.length === 0) {
    return <p>No tours yet.</p>;
  }
  return (
    <ul className={classes.tours}>
      {props.tours.map(tour => {
        return (
          <TourCard
            key={tour._id}
            name={tour.name}
            summary={tour.summary}
            startLocation={tour.startLocation}
            startDate={tour.nextStartDate}
            price={tour.price}
            maxPeople={tour.maxPeople}
            duration={tour.duration}
            difficulty={tour.difficulty}
            imageCover={tour.imageCover}
            slug={tour.slug}
          />
        );
      })}
    </ul>
  );
};

export default ToursCardList;
