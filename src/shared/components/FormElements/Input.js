import React, { useReducer, useEffect, useCallback } from 'react';

import { validate } from '../../util/formValidation';

import classes from './Input.module.css';

const inputReducer = (curState, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...curState,
        value: action.val,
        isValid:
          action.id === 'passwordConfirm'
            ? validate(action.val, action.validators, action.passVal)
            : validate(action.val, action.validators),
      };

    case 'CLEAR':
      return {
        value: '',
        isValid: false,
      };

    case 'TOUCH':
      return {
        ...curState,
        isTouched: true,
      };

    default:
      return curState;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialvalue || '',
    isValid: props.initialValidity || false,
    isTouched: false,
  });

  const { id, onInput, passVal, fieldName, clearStatus } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid, fieldName);
  }, [id, onInput, value, isValid, fieldName]);

  const changeHandler = e => {
    dispatch({
      type: 'CHANGE',
      val: e.target.value,
      id: id,
      passVal: passVal || undefined,
      validators: props.validators,
    });
  };

  const clearHandler = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  useEffect(() => {
    if (clearStatus === true) {
      clearHandler();
    }
  }, [clearStatus, clearHandler]);

  const touchHandler = () => dispatch({ type: 'TOUCH' });

  let element = (
    <input
      id={props.id}
      type={props.type}
      placeholder={props.placeholder}
      onChange={changeHandler}
      onBlur={touchHandler}
      value={inputState.value}
    />
  );

  if (props.element === 'textarea') {
    element = (
      <textarea
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        rows={props.rows || 1}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );
  }

  if (props.element === 'select') {
    element = (
      <select
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      >
        {props.options.map((option, i) => (
          <option value={option} key={`${id}${i}`}>
            {option.split('-').join(' ')}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div
      className={`${
        props.large ? classes['input-form-large'] : classes['input-form-small']
      } ${
        props.large &&
        !inputState.isValid &&
        inputState.isTouched &&
        classes['input-form-large--invalid']
      }
      ${
        !props.large &&
        !inputState.isValid &&
        inputState.isTouched &&
        classes['input-form-small--invalid']
      }
      `}
      style={props.style}
    >
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
      {element}

      {props.btnPlus && (
        <button
          type="button"
          onClick={props.onAddElement}
          className={
            props.btnPlus && props.btnMinus
              ? classes['btn-plus']
              : classes['btn-plus-minus']
          }
        >
          +
        </button>
      )}

      {props.btnMinus && (
        <button
          type="button"
          onClick={props.onRemoveElement}
          className={
            props.btnMinus && props.btnPlus
              ? classes['btn-minus']
              : classes['btn-plus-minus']
          }
        >
          -
        </button>
      )}

      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
