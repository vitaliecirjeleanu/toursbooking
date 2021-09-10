import React, { useMemo, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useFetch } from '../../shared/hooks/fetch-hook';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/UIElements/Button';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Modal from '../../shared/components/UIElements/Modal';

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_CHECK_PASSWORD,
} from '../../shared/util/formValidation';

import classes from '../../shared/util/Form.module.css';

const SignupPage = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, error, sendRequest, clearError } = useFetch();
  const { formState, inputHandler } = useForm(
    {
      name: {
        value: '',
        isValid: false,
      },
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
      passwordConfirm: {
        value: '',
        isValid: false,
      },
      role: {
        value: '',
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const password = useMemo(
    () => formState.inputs.password.value,
    [formState.inputs.password.value]
  );

  const submitHandler = async e => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', formState.inputs.name.value);
      formData.append('email', formState.inputs.email.value);
      formData.append('password', formState.inputs.password.value);
      formData.append(
        'passwordConfirm',
        formState.inputs.passwordConfirm.value
      );
      formData.append('role', formState.inputs.role.value);
      formData.append('image', formState.inputs.image.value);

      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
        {
          method: 'POST',
          body: formData,
        }
      );

      authCtx.login(data.token, data.user._id, data.user.role, data.user.image);
      history.replace('/');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <React.Fragment>
      <Modal showModal={!!error} error onClear={clearError} content={error} />
      {isLoading && <LoadingSpinner />}
      <div className={classes['form-container-small']}>
        <h2>Create your account</h2>
        <form onSubmit={submitHandler}>
          <Input
            id="name"
            type="text"
            placeholder="your name"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
          />
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
          <Input
            id="passwordConfirm"
            type="password"
            label="Confirm password"
            placeholder="******"
            validators={[VALIDATOR_CHECK_PASSWORD()]}
            errorText="Passwords don't match."
            onInput={inputHandler}
            passVal={password}
          />
          <Input
            id="role"
            label="Role"
            element="select"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please select an role."
            onInput={inputHandler}
            options={['', 'user', 'guide', 'lead-guide', 'admin']}
          />
          <ImageUpload
            id="image"
            label="Image"
            message="Pick an image if you want."
            textBtn="Pick Image"
            onInput={inputHandler}
            small
          />
          <Button type="submit" disabled={!formState.isValid}>
            Sign Up
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default SignupPage;
