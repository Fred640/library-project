import React, { useEffect } from "react";
import classes from './Modal.module.css';

const Modal = ({ children, visible, setVisible }) => {
  const myClasses = [classes.myModal];
  
  if (visible) {
    myClasses.push(classes.active);
  }

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && visible) {
        setVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [visible, setVisible]);

  if (!visible) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      setVisible(false);
    }
  };

  return (
    <div 
      className={myClasses.join(" ")} 
      onClick={handleOverlayClick}
    >
      <div 
        className={classes.myModalContent} 
        onClick={(event) => event.stopPropagation()}
      >
        {children}

        {/* <button 
          className={classes.closeButton}
          onClick={() => setVisible(false)}
          aria-label="Закрыть"
        >
          ✕
        </button> */}
      </div>
    </div>
  );
};

export default Modal;