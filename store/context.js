import {useContext, useState, useEffect, createContext} from 'react';

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {
  const value = {};

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContextProvider = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error('useAppContextProvider to be used in AppContextProvider');
  }
  return appContext;
};
