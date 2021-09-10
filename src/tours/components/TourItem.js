import React, { useRef, useState, useEffect, useContext } from 'react';

import Map from '../../shared/components/UIElements/Map';
import Button from '../../shared/components/UIElements/Button';
import { AuthContext } from '../../shared/context/auth-context';
import {
  LocationMark,
  Calendar,
  Clock,
  User,
  Dollar,
  UpArrow,
} from '../../icons/Icons';

import classes from './TourItem.module.css';

const TourItem = props => {
  const authCtx = useContext(AuthContext);
  const sectionRef = useRef(null);
  const [showSection, setShowSection] = useState(false);

  const intersectHandler = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) return setShowSection(true);
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(intersectHandler, {
      root: null,
      threshold: 1,
    });

    observer.observe(sectionRef.current);
  }, []);

  const bookTourHandler = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/tours/checkout-session/${props.tour._id}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${authCtx.jwt}` },
        }
      );
      if (!res.ok)
        throw new Error('Booking tour failed. Please try again later.');
      const data = await res.json();
      window.location = data.session.url;
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className={classes.tour}>
      <section className={classes.title}>
        <img
          src={`${process.env.REACT_APP_FILES_URL}/${props.tour.imageCover}`}
          alt="cover"
        />
        <h1>{`${props.tour.name}`}</h1>
      </section>
      <section className={classes.space}>
        <div className={classes.left}></div>
        <div className={classes.right}></div>
      </section>
      <section className={classes.details}>
        <div className={classes.description}>
          <h2>Tour Description</h2>
          <div className={classes['description-text']}>
            {props.tour.description.map((paragraph, i) => (
              <p key={`pr${i + 1}`}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className={classes['short-ideas']}>
          <div className={classes.facts} style={{ marginBottom: '30px' }}>
            <h2>Quick Facts</h2>
            <ul>
              <li>
                <LocationMark />
                <span>
                  <b>START LOCATION</b>
                </span>
                <span>{props.tour.startLocation}</span>
              </li>
              <li>
                <Calendar />
                <span>
                  <b>NEXT DATE</b>
                </span>
                <span>{props.tour.nextStartDate}</span>
              </li>
              <li>
                <Clock />
                <span>
                  <b>DURATION</b>
                </span>
                <span>{`${props.tour.duration} days`}</span>
              </li>
              <li>
                <User />
                <span>
                  <b>PARTICIPANTS</b>
                </span>
                <span>{`${props.tour.maxPeople} people`}</span>
              </li>
              <li>
                <UpArrow />
                <span>
                  <b>DIFFICULTY</b>
                </span>
                <span>{props.tour.difficulty}</span>
              </li>
              <li>
                <Dollar />
                <span>
                  <b>PRICE</b>
                </span>
                <span>{`${props.tour.price} per person`}</span>
              </li>
            </ul>
          </div>
          <div className={classes.guides}>
            <h2 style={{ marginTop: '0px', marginBottom: '20px' }}>
              Tour Guides
            </h2>
            <ul>
              {props.tour.guides.map(guide => (
                <li key={guide._id}>
                  <img
                    src={`${process.env.REACT_APP_FILES_URL}/${
                      guide.image === 'default.jpg'
                        ? `uploads/images/users/${guide.image}`
                        : `${guide.image}`
                    }`}
                    alt="Guide"
                  />
                  <span>
                    <b>{`${guide.role.toUpperCase()}`}</b>
                  </span>
                  <span>{guide.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className={classes.images}>
        <div>
          <img
            src={`${process.env.REACT_APP_FILES_URL}/${props.tour.images[0]}`}
            alt="img1"
          />
        </div>
        <div>
          <img
            src={`${process.env.REACT_APP_FILES_URL}/${props.tour.images[1]}`}
            alt="img2"
          />
        </div>
        <div>
          <img
            src={`${process.env.REACT_APP_FILES_URL}/${props.tour.images[2]}`}
            alt="img3"
          />
        </div>
      </section>
      <section className={classes['map-container']}>
        <Map
          coords={props.tour.locationsCoordinates}
          zoom={16}
          descriptions={props.tour.days}
        />
      </section>
      <div className={classes.background}>
        <div
          className={
            showSection ? classes['book-tour'] : classes['book-tour__hidden']
          }
          ref={sectionRef}
        >
          {authCtx.isLoggedIn &&
            (authCtx.userData.role === 'admin' ||
              (authCtx.userData.role === 'lead-guide' &&
                authCtx.userData.id === props.tour.creator._id)) && (
              <React.Fragment>
                <span>
                  <h2>WANA MAKE SOME CHANGES?</h2>
                  <p>Click one of the buttons for desired action.</p>
                </span>
                <span className={classes['span-changes']}>
                  <Button
                    to={`update/${props.tour.slug}`}
                    style={{
                      position: 'relative',
                      width: 'auto',
                      height: 'auto',
                      padding: '15px 25px',
                      // top: '5%',
                      right: '-250%',
                      marginLeft: '0',
                      fontSize: 'small',
                    }}
                  >
                    <b>Update Tour</b>
                  </Button>
                </span>
                <span className={classes['span-changes']}>
                  <Button
                    type="button"
                    onClick={props.onClick}
                    style={{
                      position: 'relative',
                      top: '70%',
                      right: '-76%',
                    }}
                  >
                    <b>Delete Tour</b>
                  </Button>
                </span>
              </React.Fragment>
            )}
          {(!authCtx.isLoggedIn ||
            (authCtx.isLoggedIn &&
              (authCtx.userData.role === 'user' ||
                authCtx.userData.role === 'guide'))) && (
            <React.Fragment>
              <span>
                <h2>LOOKS GREAT, RIGHT ?</h2>
                <p>{`An amazing ${props.tour.duration} day adventure. Make some memories!`}</p>
              </span>
              <span>
                {!authCtx.isLoggedIn && (
                  <Button
                    to={{
                      pathname: '/login',
                      state: { prevPath: window.location.pathname },
                    }}
                    style={{
                      width: '200px',
                      textAlign: 'center',
                      marginTop: '15%',
                      marginLeft: '10%',
                      fontSize: 'small',
                      padding: '12px 0',
                    }}
                  >
                    <b>LOG IN TO BOOK TOUR</b>
                  </Button>
                )}
                {authCtx.isLoggedIn && (
                  <Button type="button" onClick={bookTourHandler}>
                    <b>BOOK TOUR NOW</b>
                  </Button>
                )}
              </span>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourItem;
