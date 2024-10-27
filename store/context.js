import React, { useContext, useState, useEffect, createContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { shipQuizData } from '../data/shipQuiz';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [quizData, setQuizData] = useState([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const initQuizData = async () => {
      try {
        const storedQuizData = await AsyncStorage.getItem('shipQuizData');
        
        if (storedQuizData) {
          const parsedQuizData = JSON.parse(storedQuizData);
          setQuizData(parsedQuizData);
          calculateTotalScore(parsedQuizData);
        } else {
          await AsyncStorage.setItem('shipQuizData', JSON.stringify(shipQuizData));
          setQuizData(shipQuizData);
          calculateTotalScore(shipQuizData);
        }
      } catch (error) {
        console.error('Error initializing quiz data:', error);
        setQuizData(shipQuizData);
        calculateTotalScore(shipQuizData);
      }
    };

    initQuizData();
  }, []);

  const calculateTotalScore = (data) => {
    const total = data.reduce((sum, quiz) => sum + (parseInt(quiz.score) || 0), 0);
    console.log('Calculated total score:', total);
    setTotalScore(total);
  };

  const updateQuizData = async (newQuizData) => {
    try {
      await AsyncStorage.setItem('shipQuizData', JSON.stringify(newQuizData));
      setQuizData(newQuizData);
      calculateTotalScore(newQuizData);
    } catch (error) {
      console.error('Error updating quiz data:', error);
    }
  };

  const saveQuizScore = async (quizId, score) => {
    try {
      const updatedQuizData = quizData.map(quiz => 
        quiz.id === quizId ? { ...quiz, score: score.toString(), isCompleted: true } : quiz
      );
      console.log('Saving quiz score:', quizId, score);
      await updateQuizData(updatedQuizData);
    } catch (error) {
      console.error('Error saving quiz score:', error);
    }
  };

  const value = {
    quizData,
    totalScore,
    updateQuizData,
    saveQuizScore,
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
