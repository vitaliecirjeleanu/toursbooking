import { useReducer, useCallback } from 'react';

const elementsReducer = (curState, action) => {
  switch (action.type) {
    case 'ELEMENT_ADDED':
      let newElementsOnAdd;

      if (action.elementType === 'DATE') {
        newElementsOnAdd = {
          ...curState,
          dateElements: [
            ...curState.dateElements,
            curState.dateElements.slice(-1)[0] + 1,
          ],
        };
      }

      if (action.elementType === 'ADDRESS') {
        newElementsOnAdd = {
          ...curState,
          addressElements: [
            ...curState.addressElements,
            curState.addressElements.slice(-1)[0] + 1,
          ],
        };
      }

      if (action.elementType === 'GUIDE') {
        newElementsOnAdd = {
          ...curState,
          guideElements: [
            ...curState.guideElements,
            curState.guideElements.slice(-1)[0] + 1,
          ],
        };
      }

      return newElementsOnAdd;

    case 'ELEMENT_REMOVED':
      let newElementsOnRemove;

      if (action.elementType === 'DATE') {
        const newNrElements = [...curState.dateElements];
        newNrElements.splice(action.index, 1);
        action.removeElementData(action.id, action.fieldName);

        newElementsOnRemove = {
          ...curState,
          dateElements: newNrElements,
        };
      }

      if (action.elementType === 'ADDRESS') {
        const newNrElements = [...curState.addressElements];
        newNrElements.splice(action.index, 1);
        action.removeElementData(action.id, action.fieldName);

        newElementsOnRemove = {
          ...curState,
          addressElements: newNrElements,
        };
      }

      if (action.elementType === 'GUIDE') {
        const newNrElements = [...curState.guideElements];
        newNrElements.splice(action.index, 1);
        action.removeElementData(action.id, action.fieldName);

        newElementsOnRemove = {
          ...curState,
          guideElements: newNrElements,
        };
      }
      return newElementsOnRemove;

    default:
      return curState;
  }
};

export const useChangeElementsNumber = () => {
  const [elementsNumber, dispatch] = useReducer(elementsReducer, {
    dateElements: [1],
    guideElements: [1],
    addressElements: [1],
  });

  const addElementHandler = useCallback(elementType => {
    dispatch({ type: 'ELEMENT_ADDED', elementType });
  }, []);

  const removeElementHandler = useCallback(
    (elementType, fieldName, index, id, removeElementData) => {
      dispatch({
        type: 'ELEMENT_REMOVED',
        elementType,
        fieldName,
        index,
        id,
        removeElementData,
      });
    },
    []
  );

  return { elementsNumber, addElementHandler, removeElementHandler };
};
