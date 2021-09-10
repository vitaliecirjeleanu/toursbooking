import React, { useEffect, useContext, useState } from 'react';

import { useParams, useHistory } from 'react-router-dom';

import classes from '../../shared/util/Form.module.css';

import { AuthContext } from '../../shared/context/auth-context';
import { useFetch } from '../../shared/hooks/fetch-hook';
import { useForm } from '../../shared/hooks/form-hook';
import Input from '../../shared/components/FormElements/Input';
import Modal from '../../shared/components/UIElements/Modal';
import Button from '../../shared/components/UIElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE } from '../../shared/util/formValidation';

const UpdateTourPage = () => {
  const { slug } = useParams();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const [tour, setTour] = useState();
  const { isLoading, sendRequest, error, clearError } = useFetch();
  const { formState, inputHandler, setFormData } = useForm(
    {
      inputs: {
        difficulty: { value: '', isValid: false },
        maxPeople: { value: '', isValid: false },
        duration: { value: '', isValid: false },
        price: { value: '', isValid: false },
        summary: { value: '', isValid: false },
      },
    },
    false
  );

  useEffect(() => {
    (async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/tours/${slug}`
        );
        setTour(data.tour);

        setFormData(
          {
            difficulty: { value: data.tour.difficulty, isValid: true },
            maxPeople: { value: data.tour.maxPeople, isValid: true },
            duration: { value: data.tour.duration, isValid: true },
            price: { value: data.tour.price, isValid: true },
            summary: { value: data.tour.summary, isValid: true },
          },
          true
        );
      } catch (err) {
        console.error(err);
      }
    })();
  }, [slug, sendRequest, setFormData]);

  const submitHandler = async e => {
    e.preventDefault();

    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/tours/${slug}`, {
        method: 'PATCH',
        body: JSON.stringify({
          difficulty: formState.inputs.difficulty.value,
          maxPeople: formState.inputs.maxPeople.value,
          duration: formState.inputs.duration.value,
          price: formState.inputs.price.value,
          summary: formState.inputs.summary.value,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authCtx.jwt}`,
        },
      });

      history.push('/');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <React.Fragment>
      <Modal showModal={!!error} error onClear={clearError} content={error} />
      {isLoading && <LoadingSpinner />}
      {!isLoading && tour && (
        <div className={classes['form-container-small']}>
          <h2>{`Update the ${tour.name} tour`}</h2>
          <form onSubmit={submitHandler}>
            <Input
              id="difficulty"
              label="Difficulty"
              element="select"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please select a difficulty."
              onInput={inputHandler}
              options={['', 'easy', 'medium', 'difficult']}
              initialvalue={tour.difficulty}
              initialValidity={true}
            />
            <Input
              id="maxPeople"
              type="text"
              placeholder="number of people"
              label="People Number"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a number(<=15)."
              onInput={inputHandler}
              initialvalue={tour.maxPeople}
              initialValidity={true}
            />
            <Input
              id="duration"
              type="text"
              placeholder="tour duration"
              label="Duration"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a duration."
              onInput={inputHandler}
              initialvalue={tour.duration}
              initialValidity={true}
            />
            <Input
              id="price"
              type="text"
              placeholder="tour price"
              label="Price"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a price."
              onInput={inputHandler}
              initialvalue={tour.price}
              initialValidity={true}
            />
            <Input
              id="summary"
              type="text"
              placeholder="tour summary"
              element="textarea"
              label="Summary"
              rows="3"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a summary."
              onInput={inputHandler}
              initialvalue={tour.summary}
              initialValidity={true}
            />
            <Button type="submit" disabled={!formState.isValid}>
              Update
            </Button>
          </form>
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdateTourPage;
