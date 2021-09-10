import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { useFetch } from '../../shared/hooks/fetch-hook';

import { AuthContext } from '../../shared/context/auth-context';
import Modal from '../../shared/components/UIElements/Modal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import UserSettings from '../components/UserSettings';
import UserPassword from '../components/UserPassword';

import classes from './UserPage.module.css';

const UserPage = () => {
  const { jwt, login } = useContext(AuthContext);
  const history = useHistory();
  const [showWarning, setShowWarning] = useState(false);
  const { isLoading, sendRequest, error, clearError } = useFetch();

  const closeAccountHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/closeAccount`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      login();

      history.replace('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      <Modal showModal={!!error} error onClear={clearError} content={error} />
      <Modal
        showModal={showWarning}
        closeAccountWarning
        onCancel={() => setShowWarning(false)}
        onClose={closeAccountHandler}
        content="Are you sure that you want to close your account?"
      />
      {isLoading && <LoadingSpinner />}
      <div className={classes.user}>
        <section className={classes.settings}>
          <UserSettings
            sendRequest={sendRequest}
            onCloseAccount={() => setShowWarning(true)}
          />
        </section>
        <section className={classes.password}>
          <UserPassword sendRequest={sendRequest} />
        </section>
      </div>
    </React.Fragment>
  );
};

export default UserPage;
