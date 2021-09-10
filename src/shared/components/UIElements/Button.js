import React from 'react';
import { Link } from 'react-router-dom';

import classes from './Button.module.css';

const Button = props => {
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={classes['link-btn']}
        style={props.style}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      type={props.type}
      className={`${classes[props.className] || classes.btn}`}
      style={props.style}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
