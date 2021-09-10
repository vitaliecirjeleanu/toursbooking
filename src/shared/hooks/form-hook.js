import { useReducer, useCallback } from 'react';

const formReducer = (curState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      let newData;
      const inputArray = ['date', 'address', 'guide'];
      for (const inputId in curState.inputs) {
        if (!curState.inputs[inputId]) continue;

        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && curState.inputs[inputId].isValid;
        }

        if (
          inputId === 'startDates' ||
          inputId === 'locationsAddress' ||
          inputId === 'guides'
        ) {
          for (const item in curState.inputs[inputId].value) {
            if (item === action.inputId) {
              formIsValid = formIsValid && action.isValid;
            } else {
              formIsValid =
                formIsValid && curState.inputs[inputId].value[item].isValid;
            }
          }
        }
      }

      if (inputArray.some(val => action.inputId.includes(val))) {
        formIsValid = formIsValid && action.isValid;

        newData = {
          ...curState.inputs,
          [action.fieldName]: {
            value: {
              ...curState.inputs[action.fieldName].value,

              [action.inputId]: {
                value: action.value,
                isValid: action.isValid,
              },
            },
            isValid: true,
          },
        };
      } else {
        newData = {
          ...curState.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        };
      }

      return {
        ...curState,
        inputs: newData,
        isValid: formIsValid,
      };

    case 'ELEMENT_REMOVED':
      const fieldName = action.fieldName;

      delete curState.inputs[fieldName].value[action.inputId];

      let inputName;
      if (fieldName === 'startDates') inputName = 'date';

      if (fieldName === 'guides') inputName = 'guide';

      if (fieldName === 'locationsAddress') inputName = 'address';

      let formOnDeleteIsValid = true;
      const dynamicElementsValues = [];
      let newNameInputsElements = {};

      for (const inputId in curState.inputs) {
        if (!curState.inputs[inputId]) continue;

        if (inputId === action.inputId) {
          formOnDeleteIsValid = formOnDeleteIsValid && action.isValid;
        } else {
          formOnDeleteIsValid =
            formOnDeleteIsValid && curState.inputs[inputId].isValid;
        }
      }

      for (const item in curState.inputs[fieldName].value) {
        dynamicElementsValues.push({
          value: curState.inputs[fieldName].value[item].value,
          isValid: curState.inputs[fieldName].value[item].isValid,
        });
      }
      const validityArray = dynamicElementsValues.map(item => item.isValid);
      const dynamicElementsValidity = validityArray.every(val => val === true);

      dynamicElementsValues.forEach((item, i) => {
        newNameInputsElements[`${inputName}${i + 1}`] = {
          value: item.value,
          isValid: item.isValid,
        };
      });

      return {
        ...curState,
        inputs: {
          ...curState.inputs,
          [fieldName]: {
            value: {
              ...newNameInputsElements,
            },
            isValid: true,
          },
        },
        isValid: formOnDeleteIsValid && dynamicElementsValidity,
      };

    case 'SET_FORM_DATA':
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };

    default:
      return curState;
  }
};

export const useForm = (initInputs, initValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initInputs,
    isValid: initValidity,
  });

  const inputHandler = useCallback((id, value, isValid, fieldName) => {
    dispatch({ type: 'INPUT_CHANGE', value, isValid, inputId: id, fieldName });
  }, []);

  const removeElementData = useCallback((id, fieldName) => {
    dispatch({ type: 'ELEMENT_REMOVED', inputId: id, fieldName });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_FORM_DATA',
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  return { formState, inputHandler, removeElementData, setFormData };
};
