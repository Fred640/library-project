import React, { useEffect } from "react";
import classes from './Modal.module.css';
import { ModalContext } from '../../context/ModalContext.jsx';
import { useContext } from "react";
const Modal = ({ children, visible, setVisible }) => {
  const myClasses = [classes.myModal];
  const modalContext = useContext(ModalContext);
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
    <ModalContext.Provider value={{ setVisible }}>
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
    </ModalContext.Provider>
  );
};

export default Modal