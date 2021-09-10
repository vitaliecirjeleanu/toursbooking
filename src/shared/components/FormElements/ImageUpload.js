import React, { useState, useRef, useEffect } from 'react';

import Button from '../UIElements/Button';

import classes from './ImageUpload.module.css';

const ImageUpload = props => {
  const filePickerRef = useRef();
  const [files, setFiles] = useState();
  const [previewUrls, setPreviewUrls] = useState();
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const { required, onInput, id } = props;

  useEffect(() => {
    if (!files || files.length > 3) return;

    if (files.length === 2 || files.length === 3) {
      setPreviewUrls([]);
      Object.keys(files).forEach(file => {
        const fileReader = new FileReader();
        fileReader.onload = () =>
          setPreviewUrls(prevState => [...prevState, fileReader.result]);
        fileReader.readAsDataURL(files[file]);
      });
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => setPreviewUrls(fileReader.result);
    fileReader.readAsDataURL(files);
  }, [files]);

  useEffect(() => {
    if (!required) {
      setIsValid(true);
      onInput(id, true, true);
    }
  }, [required, onInput, id]);

  const pickedHandler = e => {
    let pickedFile;
    let fileIsValid = isValid;

    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFiles(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else if (
      e.target.files &&
      (e.target.files.length === 2 || e.target.files.length === 3)
    ) {
      setPreviewUrls([]);
      pickedFile = e.target.files;
      setFiles(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else if (files && e.target.files.length === 0) {
      pickedFile = files;
      setFiles(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    onInput(id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
    if (!files) {
      setTimeout(() => setIsTouched(true), 1000);
    } else {
      setIsTouched(false);
    }
  };

  let userImage;
  if (props.image === 'default.jpg') {
    userImage = `${process.env.REACT_APP_FILES_URL}/uploads/images/users/${props.image}`;
  } else {
    userImage = `${process.env.REACT_APP_FILES_URL}/${props.image}`;
  }

  let previewContent;
  if (files && files.length > 1) {
    previewContent = (
      <div className={classes['images-preview']}>
        {previewUrls &&
          previewUrls.map((url, i) => (
            <div key={`img${i + 1}`} className={classes['preview-item']}>
              <img src={url} alt="preview" />
            </div>
          ))}
        {!previewUrls && <p>{props.message}</p>}
      </div>
    );
  } else {
    previewContent = (
      <div
        className={
          props.small
            ? classes['image-preview-small-form']
            : classes['image-preview']
        }
        style={props.imgStyle}
      >
        {previewUrls && <img src={previewUrls} alt="preview" />}
        {!previewUrls && !props.message && (
          <img src={userImage} alt="preview" />
        )}
        {!previewUrls && <p>{props.message}</p>}
      </div>
    );
  }

  return (
    <div
      className={
        props.small
          ? classes['image-container-small-form']
          : classes['image-container']
      }
    >
      {props.label && <label>{props.label}</label>}
      <div
        className={
          props.small ? classes['content-small-form'] : classes.content
        }
        style={props.style}
      >
        <input
          ref={filePickerRef}
          type="file"
          multiple={props.multiple}
          id={id}
          style={{ display: 'none' }}
          accept=".jpg, .jpeg, .png"
          onChange={pickedHandler}
        />
        {previewContent}
        <Button
          type="button"
          onClick={pickImageHandler}
          className="btn-okay"
          style={{ fontWeight: 'normal', width: '80px', padding: '8px 0' }}
        >
          {props.textBtn}
        </Button>
        {props.required && !isValid && isTouched && (
          <p className={classes.error}>{props.errorText}</p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
