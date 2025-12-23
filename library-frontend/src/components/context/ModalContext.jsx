import React from 'react';

export const ModalContext = React.createContext({
  onClose: () => {},
  isOpen: false
});

export const ModalProvider = ({ children, value }) => {
  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};