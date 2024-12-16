// Context.js
import React, { createContext, useState, useContext } from 'react';

// Create a new context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [changeT, setchangeT] = useState(false);

  // Function to update the value
  const updatechangeT = () => {
    setValue(!changeT);
  };

  return (
    <AppContext.Provider value={{ changeT, updatechangeT }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the context
export const useAppContext = () => {
  return useContext(AppContext);
};
