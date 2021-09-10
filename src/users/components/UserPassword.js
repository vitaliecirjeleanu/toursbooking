import React, { useMemo, useContext, useState } from 'react';

import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/UIElements/Button';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_CHECK_PASSWORD,
} from '../../shared/util/formValidation';

import classes from './UserPassword.module.css';

const UserPassword = React.memo(props => {
  const { jwt, login } = useContext(AuthContext);
  const { sendRequest } = props;
  const [clear, setClear] = useState(false);
  const { formState, inputHandler, setFormData } = useForm(
    {
      passwordCurrent: { value: '', isValid: false },
      passwordNew: { value: '', isValid: false },
      passwordConfirm: { value: '', isValid: false },
    },
    false
  );

  const password = useMemo(
    () => formState.inputs.passwordNew.value,
    [formState.inputs.passwordNew.value]
  );

  const submitHandler = async e => {
    e.preventDefault();

    try {
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/changePassword`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            passwordCurrent: formState.inputs.passwordCurrent.value,
            passwordNew: formState.inputs.passwordNew.value,
            passwordConfirm: formState.inputs.passwordConfirm.value,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      login(data.token, data.user._id, data.user.role, data.user.image);

      setFormData(
        {
          passwordCurrent: { value: '', isValid: false },
          passwordNew: { value: '', isValid: false },
          passwordConfirm: { value: '', isValid: false },
        },
        false
      );
      setClear(true);
    } catch (err) {
      setClear(false);
      console.log(err);
    }
  };
  return (
    <React.Fragment>
      <div>
        <h2>Change password</h2>
        <form className={classes.form} onSubmit={submitHandler}>
          <div className={classes['password-inputs']}>
            <Input
              id="passwordCurrent"
              type="password"
              label="Current password"
              placeholder="******"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Enter min 6 characters"
              onInput={inputHandler}
              clearStatus={clear}
            />
            <Input
              id="passwordNew"
              type="password"
              label="New password"
              placeholder="******"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Enter min 6 characters"
              onInput={inputHandler}
              clearStatus={clear}
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
              clearStatus={clear}
            />
          </div>
          <Button type="submit" disabled={!formState.isValid}>
            Change Password
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
});

export default UserPassword;
