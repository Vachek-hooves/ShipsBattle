import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { useAppContextProvider } from '../../store/context';
import LinearGradient from 'react-native-linear-gradient';
import { shipQuizData } from '../../data/shipQuiz'; // Import the local data

const StackQuizScreen = ({ route, navigation }) => {
  const { quizData, saveQuizScore, unlockNextLevel } = useAppContextProvider();
  const { levelNumber } = route.params;
  const quizLevel = quizData.find((quiz) => quiz.id === levelNumber);
  const localQuizLevel = shipQuizData.find((quiz) => quiz.id === levelNumber); // Get local data
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: quizLevel?.quizName || 'Quiz' });
    // Check if quizLevel is loaded
    if (quizLevel) {
      setIsLoading(false);
    }
  }, [quizLevel]);

  const handleAnswer = (selectedAnswer) => {
    const currentQuestion = quizLevel.questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }

    if (currentQuestionIndex + 1 < quizLevel.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizCompletion();
    }
  };

  const handleQuizCompletion = () => {
    setShowResult(true);
    const finalScore = score;  // Remove the +1 here
    saveQuizScore(levelNumber, finalScore);
    console.log(`Quiz completed. Level: ${levelNumber}, Score: ${finalScore}`);
    
    // Check if the user answered 10 or more questions correctly
    if (finalScore >= 10) {
      unlockNextLevel(levelNumber);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
  };

  const finishQuiz = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!quizLevel) {
    return (
      <View style={styles.container}>
        <Text>Quiz level not found</Text>
      </View>
    );
  }

  if (showResult) {
    return (
      <ImageBackground
        source={localQuizLevel.admiralInfo.image}
        style={styles.backgroundImage}
        blurRadius={20}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.resultContainer}
        >
          <View style={styles.resultContent}>
            <Text style={styles.resultTitle}>Quiz Completed!</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>
                Your Score: {score}/{quizLevel.questions.length}
              </Text>
              <Text style={styles.scoreSubtext}>
                {score >= 10 ? '🏆 Admiral Rank Achieved!' : '📚 Keep Learning!'}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <OptionButton option="Try Again" onPress={restartQuiz} />
              <OptionButton option="Return to Fleet" onPress={finishQuiz} />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }

  const currentQuestion = quizLevel.questions[currentQuestionIndex];
  console.log(quizLevel.admiralInfo.image);

  return (
    <ImageBackground
      source={localQuizLevel.admiralInfo.image}
      style={styles.backgroundImage}
      blurRadius={30}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.85)']}
        style={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionNumber}>
              Question {currentQuestionIndex + 1}/{quizLevel.questions.length}
            </Text>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>
          
          {currentQuestion.options.map((option, index) => (
            <OptionButton
              key={index}
              option={option}
              onPress={() => handleAnswer(option)}
            />
          ))}
        </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
};

export default StackQuizScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContainer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#DAA520',
    shadowColor: '#DAA520',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  questionNumber: {
    color: '#DAA520',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  questionText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    letterSpacing: 0.5,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultContent: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DAA520',
  },
  resultTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  scoreSubtext: {
    fontSize: 20,
    color: '#DAA520',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
});

const OptionButton = ({ option, onPress }) => (
  <TouchableOpacity 
    style={optionButtonStyles.optionButtonContainer} 
    onPress={onPress}
  >
    <LinearGradient
      colors={['rgba(26, 26, 26, 0.9)', 'rgba(51, 51, 51, 0.9)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={optionButtonStyles.optionButton}
    >
      <Text style={optionButtonStyles.optionText}>{option}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const optionButtonStyles = StyleSheet.create({
  optionButtonContainer: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DAA520',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    letterSpacing: 0.5,
  },
});
