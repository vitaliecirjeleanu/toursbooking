import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { useFetch } from '../../shared/hooks/fetch-hook';
import { AuthContext } from '../../shared/context/auth-context';
import TourItem from '../components/TourItem';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Modal from '../../shared/components/UIElements/Modal';

const TourPage = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useFetch();
  const { slug } = useParams();
  const [tour, setTour] = useState();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/tours/${slug}`
        );
        setTour(data.tour);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [slug, sendRequest]);

  const showWarningHandler = () => setShowWarning(true);
  const hideWarningHandler = () => setShowWarning(false);

  const deleteHandler = async () => {
    try {
      setTour();
      setShowWarning(false);
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/tours/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authCtx.jwt}` },
      });

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
        deleteWarning
        onCancel={hideWarningHandler}
        onDelete={deleteHandler}
        content="Are you sure that you want to delete the tour?"
      />
      {isLoading && <LoadingSpinner />}
      {!isLoading && tour && (
        <TourItem
          tour={tour}
          onClick={showWarningHandler}
          sendRequest={sendRequest}
        />
      )}
    </React.Fragment>
  );
};

export default TourPage;
