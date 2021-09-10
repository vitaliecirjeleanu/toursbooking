import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';

import classes from './Navigation.module.css';

const MainNavigation = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  return (
    <nav className={classes.nav}>
      <ul>
        <li>
          <NavLink to="/" exact activeClassName={classes.active}>
            All Tours
          </NavLink>
        </li>
        {authCtx.isLoggedIn &&
          (authCtx.userData.role === 'admin' ||
            authCtx.userData.role === 'lead-guide') && (
            <li>
              <NavLink to="/new-tour" exact activeClassName={classes.active}>
                New Tour
              </NavLink>
            </li>
          )}
        {!authCtx.isLoggedIn && (
          <li>
            <NavLink to="/login" activeClassName={classes.active}>
              Log In
            </NavLink>
          </li>
        )}

        {!authCtx.isLoggedIn && (
          <li>
            <NavLink to="/signup" activeClassName={classes.active}>
              Sign Up
            </NavLink>
          </li>
        )}
        {authCtx.isLoggedIn && (
          <li>
            <button
              onClick={() => {
                authCtx.logout();
                history.replace('/');
              }}
              className={classes['lg-btn']}
            >
              Log Out
            </button>
          </li>
        )}
        {authCtx.isLoggedIn && (
          <li className={classes['link-img']}>
            <NavLink to="/me">
              <img
                src={`${process.env.REACT_APP_FILES_URL}/${
                  authCtx.userData.image === 'default.jpg'
                    ? `uploads/images/users/${authCtx.userData.image}`
                    : `${authCtx.userData.image}`
                }`}
                alt="user"
              ></img>
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MainNavigation;
