import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';
import Button from './Button';

import './Modal.css';

const ModalContent = props => {
  let footer, title;
  if (props.deleteWarning) {
    title = 'Warning';
    footer = (
      <div className="footer">
        <Button
          type="button"
          className="btn-delete"
          onClick={props.onDelete}
          style={{ marginLeft: '35%' }}
        >
          Delete
        </Button>
        <Button
          type="button"
          className="btn-cancel"
          onClick={props.onCancel}
          style={{ marginLeft: '10%' }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  if (props.closeAccountWarning) {
    title = 'Warning';
    footer = (
      <div className="footer">
        <Button
          type="button"
          className="btn-delete"
          onClick={props.onClose}
          style={{ marginLeft: '33%', width: '110px' }}
        >
          Close Account
        </Button>
        <Button
          type="button"
          className="btn-cancel"
          onClick={props.onCancel}
          style={{ marginLeft: '10%' }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  if (props.error) {
    title = 'An Error Occured';
    footer = (
      <div className="footer">
        <Button
          type="button"
          onClick={props.onClear}
          className="btn-okay"
          style={{ marginLeft: '42%', marginTop: '2.5%' }}
        >
          Okay
        </Button>
      </div>
    );
  }

  const content = (
    <div className="modal">
      <div className="header">
        <h2>{title}</h2>
      </div>
      <div className="content">{props.content}</div>
      {footer}
    </div>
  );

  return ReactDOM.createPortal(content, document.getElementById('modal'));
};

const Modal = props => {
  return (
    <React.Fragment>
      {props.showModal && (
        <Backdrop onClick={props.onClear || props.onCancel} />
      )}
      <CSSTransition
        in={props.showModal}
        timeout={500}
        classNames="modal"
        mountOnEnter
        unmountOnExit
      >
        <ModalContent {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
