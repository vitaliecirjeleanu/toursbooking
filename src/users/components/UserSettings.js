import React, { useEffect, useContext, useState } from 'react';

import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Button from '../../shared/components/UIElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from '../../shared/util/formValidation';

import classes from './UserSettings.module.css';

const UserSettings = props => {
  const { jwt, userData, login } = useContext(AuthContext);
  const { sendRequest } = props;
  const [user, setUser] = useState();
  const { formState, inputHandler, setFormData } = useForm(
    {
      name: { value: '', isValid: false },
      email: { value: '', isValid: false },
      image: { value: null, isValid: false },
    },
    false
  );

  useEffect(() => {
    (async () => {
      try {
        if (jwt && userData.id) {
          const data = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/users/${userData.id}`,
            {
              headers: { Authorization: `Bearer ${jwt}` },
            }
          );
          setUser(data.user);
          setFormData(
            {
              name: { value: data.user.name, isValid: true },
              email: { value: data.user.email, isValid: true },
              image: { value: data.user.image, isValid: true },
            },
            true
          );
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [sendRequest, userData.id, jwt, setFormData]);

  const submitHandler = async e => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', formState.inputs.name.value);
      formData.append('email', formState.inputs.email.value);
      formData.append('image', formState.inputs.image.value);

      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/updateMe`,
        {
          method: 'PATCH',
          body: formData,
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      const storedJWT = JSON.parse(localStorage.getItem('userData')).jwt;
      if (storedJWT) {
        login(storedJWT, data.user._id, data.user.role, data.user.image);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      {user && (
        <div>
          <h2>Your account settings</h2>
          <form className={classes.form} onSubmit={submitHandler}>
            <ImageUpload
              id="image"
              textBtn="Pick Image"
              onInput={inputHandler}
              image={user.image}
              style={{ backgroundColor: 'transparent', marginLeft: '10%' }}
              imgStyle={{ left: '35%' }}
            />
            <div className={classes['name-email']}>
              <Input
                id="name"
                type="text"
                placeholder="your name"
                label="Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name."
                onInput={inputHandler}
                initialvalue={user.name}
                initialValidity={true}
              />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                label="Email"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid email."
                onInput={inputHandler}
                initialvalue={user.email}
                initialValidity={true}
              />
            </div>
            <Button
              type="submit"
              style={{
                position: 'relative',
                width: '130px',
                left: '85%',
                top: '-200%',
                fontWeight: 'bold',
              }}
              disabled={!formState.isValid}
            >
              Save Settings
            </Button>
            <Button
              type="button"
              onClick={props.onCloseAccount}
              style={{
                position: 'relative',
                width: '130px',
                left: '20%',
                top: '-195%',
                fontWeight: 'bold',
              }}
            >
              Close Account
            </Button>
          </form>
        </div>
      )}
    </React.Fragment>
  );
};

export default UserSettings;
