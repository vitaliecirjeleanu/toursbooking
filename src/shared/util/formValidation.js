export const VALIDATOR_REQUIRE = () => ({ type: 'REQUIRE' });

export const VALIDATOR_MINLENGTH = val => ({
  type: 'MINLENGTH',
  val: val,
});

export const VALIDATOR_MAXLENGTH = val => ({
  type: 'MAXLENGTH',
  val: val,
});

export const VALIDATOR_EMAIL = () => ({ type: 'EMAIL' });

export const VALIDATOR_CHECK_PASSWORD = () => ({ type: 'CHECK_PASSWORD' });

export const validate = (value, validators, passValue = undefined) => {
  let isValid = true;
  validators.forEach(validator => {
    if (validator.type === 'REQUIRE') {
      isValid = isValid && value.trim().length > 0;
    }
    if (validator.type === 'MINLENGTH') {
      isValid = isValid && value.trim().length >= validator.val;
    }
    if (validator.type === 'MAXLENGTH') {
      isValid = isValid && value.trim().length <= validator.val;
    }
    if (validator.type === 'EMAIL') {
      isValid = isValid && /^\S+@\S+\.\S+$/.test(value);
    }
    if (validator.type === 'CHECK_PASSWORD') {
      isValid = isValid && value === passValue;
    }
  });

  return isValid;
};
