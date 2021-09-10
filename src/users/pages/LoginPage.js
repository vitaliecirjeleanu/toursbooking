import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { useForm } from '../../shared/hooks/form-hook';
import { useFetch } from '../../shared/hooks/fetch-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/UIElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/util/formValidation';

import classes from '../../shared/util/Form.module.css';

const LoginPage = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, sendRequest, error, clearError } = useFetch();
  const { formState, inputHandler } = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async e => {
    e.preventDefault();

    try {
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/login`,
        {
          method: 'POST',
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          headers: { 'Content-Type': 'application/json' },
        }
      );

      authCtx.login(data.token, data.user._id, data.user.role, data.user.image);

      if (
        window.history.state.state &&
        window.history.state.state.prevPath.includes('/tour/')
      ) {
        history.replace(window.history.state.state.prevPath);
      } else {
        history.replace('/');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      <Modal showModal={!!error} error onClear={clearError} content={error} />
      {isLoading && <LoadingSpinner />}
      <div className={classes['form-container-small']}>
        <h2>Log into your account</h2>
        <form onSubmit={submitHandler}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email."
            onInput={inputHandler}
          />
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="******"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Password must have min 6 characters"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Log In
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default LoginPage;
