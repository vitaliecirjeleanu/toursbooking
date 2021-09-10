import React from 'react';

import Button from '../../shared/components/UIElements/Button';

import {
  LocationMark,
  Calendar,
  Clock,
  User,
  Dollar,
  UpArrow,
} from '../../icons/Icons';

import classes from './TourCard.module.css';

const TourCard = props => {
  return (
    <li>
      <div className={classes.card}>
        <div className={classes.cover}>
          <img
            src={`${process.env.REACT_APP_FILES_URL}/${props.imageCover}`}
            alt="cover"
          />
          <h2>{`${props.name}`}</h2>
        </div>
        <div className={classes.summary}>
          <p>{props.summary}</p>
        </div>
        <div className={classes.details}>
          <ul>
            <li>
              <LocationMark />
              <span>{props.startLocation}</span>
            </li>
            <li>
              <Calendar />
              <span>{props.startDate}</span>
            </li>
            <li>
              <Clock />
              <span>{`${props.duration} days`}</span>
            </li>
            <li>
              <User />
              <span>{`${props.maxPeople} people`}</span>
            </li>
            <li>
              <UpArrow />
              <span>{props.difficulty}</span>
            </li>
            <li>
              <Dollar />
              <span>{`${props.price} per person`}</span>
            </li>
          </ul>
        </div>
        <Button to={`tour/${props.slug}`}>Details</Button>
      </div>
    </li>
  );
};

export default TourCard;
