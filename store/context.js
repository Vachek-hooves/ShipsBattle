import React, { useContext, useState, useEffect, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shipQuizData } from '../data/shipQuiz';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [quizData, setQuizData] = useState([]);

  useEffect(() => {
    const initQuizData = async () => {
      try {
        // Try to get the quiz data from AsyncStorage
        const storedQuizData = await AsyncStorage.getItem('shipQuizData');
        
        if (storedQuizData) {
          // If data exists in AsyncStorage, use it
          setQuizData(JSON.parse(storedQuizData));
        } else {
          // If no data in AsyncStorage, use the initial data and store it
          await AsyncStorage.setItem('shipQuizData', JSON.stringify(shipQuizData));
          setQuizData(shipQuizData);
        }
      } catch (error) {
        console.error('Error initializing quiz data:', error);
        // If there's an error, fallback to the initial data
        setQuizData(shipQuizData);
      }
    };

    initQuizData();
  }, []);

  const updateQuizData = async (newQuizData) => {
    try {
      await AsyncStorage.setItem('shipQuizData', JSON.stringify(newQuizData));
      setQuizData(newQuizData);
    } catch (error) {
      console.error('Error updating quiz data:', error);
    }
  };

  const value = {
    quizData,
    updateQuizData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContextProvider = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error('useAppContextProvider to be used in AppContextProvider');
  }
  return appContext;
};
