import React from 'react';
import { Link } from 'react-router-dom';

import Navigation from './Navigation';

import classes from './MainHeader.module.css';

const MainHeader = props => {
  return (
    <header className={classes['main-header']}>
      <h2>
        <Link to="/">ToursBooking</Link>
      </h2>
      <Navigation />
    </header>
  );
};

export default MainHeader;
