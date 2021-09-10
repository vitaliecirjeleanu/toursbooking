import React, { useContext } from 'react';
import { useHistory } from 'react-router';

import classes from '../../shared/util/Form.module.css';

import { useFetch } from '../../shared/hooks/fetch-hook';
import { useForm } from '../../shared/hooks/form-hook';
import { useChangeElementsNumber } from '../../shared/hooks/change-elements-number';
import { AuthContext } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Button from '../../shared/components/UIElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE } from '../../shared/util/formValidation';

const NewTourPage = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const { elementsNumber, addElementHandler, removeElementHandler } =
    useChangeElementsNumber();
  const { isLoading, sendRequest, error, clearError } = useFetch();
  const { formState, inputHandler, removeElementData } = useForm(
    {
      name: { value: '', isValid: false },
      duration: { value: '', isValid: false },
      maxPeople: { value: '', isValid: false },
      price: { value: '', isValid: false },
      difficulty: { value: '', isValid: false },
      summary: { value: '', isValid: false },
      startDates: { value: {}, isValid: false },
      guides: { value: {}, isValid: false },
      locationsAddress: { value: {}, isValid: false },
      description: { value: '', isValid: false },
      imageCover: { value: null, isValid: false },
      images: { value: null, isValid: false },
    },
    false
  );

  const submitHandler = async e => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', formState.inputs.name.value);
      formData.append('duration', formState.inputs.duration.value);
      formData.append('maxPeople', formState.inputs.maxPeople.value);
      formData.append('price', formState.inputs.price.value);
      formData.append('difficulty', formState.inputs.difficulty.value);
      formData.append('summary', formState.inputs.summary.value);
      Object.keys(formState.inputs.startDates.value).forEach(date =>
        formData.append(
          'startDates',
          formState.inputs.startDates.value[date].value
        )
      );
      Object.keys(formState.inputs.guides.value).forEach(guide =>
        formData.append('guides', formState.inputs.guides.value[guide].value)
      );
      Object.keys(formState.inputs.locationsAddress.value).forEach(address =>
        formData.append(
          'locationsAddress',
          formState.inputs.locationsAddress.value[address].value
        )
      );
      formData.append('description', formState.inputs.description.value);
      formData.append('imageCover', formState.inputs.imageCover.value);
      Object.keys(formState.inputs.images.value).forEach(image =>
        formData.append('images', formState.inputs.images.value[image])
      );

      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/tours`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${authCtx.jwt}`,
        },
      });

      history.replace('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      <Modal showModal={!!error} error onClear={clearError} content={error} />
      {isLoading && <LoadingSpinner />}
      <div className={classes['form-container-large']}>
        <h2>Create new tour</h2>
        <form onSubmit={submitHandler} className={classes['form-large']}>
          <Input
            id="name"
            type="text"
            placeholder="tour name"
            label="Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
            large
          />
          <Input
            id="duration"
            type="text"
            placeholder="tour duration (days)"
            label="Duration"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a duration."
            onInput={inputHandler}
            large
          />

          <Input
            id="maxPeople"
            type="text"
            placeholder="number of people"
            label="People Number"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Enter a number(<=15)."
            onInput={inputHandler}
            large
          />
          <Input
            id="price"
            type="text"
            placeholder="tour price"
            label="Price"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a price."
            onInput={inputHandler}
            large
          />
          <Input
            id="difficulty"
            label="Difficulty"
            element="select"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Select a difficulty."
            onInput={inputHandler}
            options={['', 'easy', 'medium', 'difficult']}
            large
          />
          <Input
            id="summary"
            type="text"
            placeholder="tour summary"
            element="textarea"
            label="Summary"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="enter a summary."
            onInput={inputHandler}
            large
          />
          <div className={classes['dinamic-input']}>
            <label>Start Dates</label>
            {elementsNumber.dateElements.map((nrDate, index) => {
              const id = `date${index + 1}`;
              return (
                <Input
                  key={`date${nrDate}`}
                  id={id}
                  type="text"
                  placeholder="dd/mm/yyyy"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Enter a date."
                  fieldName="startDates"
                  onInput={inputHandler}
                  onAddElement={addElementHandler.bind(null, 'DATE')}
                  onRemoveElement={removeElementHandler.bind(
                    null,
                    'DATE',
                    'startDates',
                    index,
                    id,
                    removeElementData
                  )}
                  large
                  btnPlus={elementsNumber.dateElements.length - 1 === index}
                  btnMinus={elementsNumber.dateElements.length !== 1}
                />
              );
            })}
          </div>
          <div className={classes['dinamic-input']}>
            <label>Guides</label>
            {elementsNumber.guideElements.map((nrGuide, index) => {
              const id = `guide${index + 1}`;
              return (
                <Input
                  key={`guide${nrGuide}`}
                  id={id}
                  type="text"
                  placeholder="guide name"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Enter a guide name."
                  fieldName="guides"
                  onInput={inputHandler}
                  onAddElement={addElementHandler.bind(null, 'GUIDE')}
                  onRemoveElement={removeElementHandler.bind(
                    null,
                    'GUIDE',
                    'guides',
                    index,
                    id,
                    removeElementData
                  )}
                  large
                  btnPlus={elementsNumber.guideElements.length - 1 === index}
                  btnMinus={elementsNumber.guideElements.length !== 1}
                />
              );
            })}
          </div>
          <div className={classes['dinamic-input']}>
            <label>Locations Address</label>
            {elementsNumber.addressElements.map((nrGuide, index) => {
              const id = `address${index + 1}`;
              return (
                <Input
                  key={`address${nrGuide}`}
                  id={id}
                  type="text"
                  placeholder="place/street,city,country/state"
                  validators={[VALIDATOR_REQUIRE()]}
                  errorText="Enter an address."
                  fieldName="locationsAddress"
                  onInput={inputHandler}
                  onAddElement={addElementHandler.bind(null, 'ADDRESS')}
                  onRemoveElement={removeElementHandler.bind(
                    null,
                    'ADDRESS',
                    'locationsAddress',
                    index,
                    id,
                    removeElementData
                  )}
                  large
                  btnPlus={elementsNumber.addressElements.length - 1 === index}
                  btnMinus={elementsNumber.addressElements.length !== 1}
                />
              );
            })}
          </div>
          <Input
            id="description"
            type="text"
            placeholder="tour description"
            element="textarea"
            label="Tour Description"
            rows="16"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="enter a description."
            onInput={inputHandler}
            large
          />
          <ImageUpload
            id="imageCover"
            label="Image Cover"
            onInput={inputHandler}
            multiple={false}
            message="Please pick an image."
            textBtn="Pick Image"
            errorText="Please provide an image."
            required
          />
          <ImageUpload
            id="images"
            label="Tour Images"
            onInput={inputHandler}
            multiple={true}
            message="Please pick some images (max 3)."
            textBtn="Pick Images"
            errorText="Please provide some images."
            required
          />
          <Button
            type="submit"
            style={{
              position: 'sticky',
              width: '200px',
              padding: '12px 0',
              left: '45%',
              marginTop: '8%',
              fontWeight: 'bold',
            }}
            disabled={!formState.isValid}
          >
            Create Tour
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default NewTourPage;
