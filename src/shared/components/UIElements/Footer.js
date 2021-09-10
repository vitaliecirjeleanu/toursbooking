import React from 'react';
import { Link } from 'react-router-dom';

import { Identification, Mobile, Phone } from '../../../icons/Icons';

import classes from './Footer.module.css';

const Footer = props => {
  return (
    <footer className={classes.main}>
      <div>
        <ul>
          <li>
            <Identification />
            <span>
              <Link to="#about">About Us</Link>
            </span>
          </li>
          <li>
            <Mobile />
            <span>
              <Link to="#apps">Apps</Link>
            </span>
          </li>
          <li>
            <Phone />
            <span>
              <Link to="#contact">Contact</Link>
            </span>
          </li>
        </ul>
      </div>

      <p>© by Vitalie Cirjeleanu. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
