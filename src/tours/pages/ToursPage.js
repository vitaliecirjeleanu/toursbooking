import React, { useState, useEffect } from 'react';

import { useFetch } from '../../shared/hooks/fetch-hook';
import ToursCardList from '../components/ToursCardList';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Modal from '../../shared/components/UIElements/Modal';

const ToursPage = () => {
  const { isLoading, error, sendRequest, clearError } = useFetch();
  const [tours, setTours] = useState();

  useEffect(() => {
    (async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/tours`
        );
        setTours(data.tours);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <Modal showModal={!!error} error onClear={clearError} content={error} />
      {isLoading && <LoadingSpinner />}
      {!isLoading && tours && <ToursCardList tours={tours} />}
    </React.Fragment>
  );
};

export default ToursPage;
