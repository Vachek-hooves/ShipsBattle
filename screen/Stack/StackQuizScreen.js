import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ImageBackground } from 'react-native';
import { useAppContextProvider } from '../../store/context';
import LinearGradient from 'react-native-linear-gradient';


const StackQuizScreen = ({ route, navigation }) => {
    const { quizData, updateQuizData } = useAppContextProvider();
    const { levelNumber } = route.params;
    const quizLevel = quizData.find(quiz => quiz.id === levelNumber);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    useEffect(() => {
        navigation.setOptions({ title: quizLevel.quizName });
    }, []);

    const handleAnswer = (selectedAnswer) => {
        const currentQuestion = quizLevel.questions[currentQuestionIndex];
        if (selectedAnswer === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestionIndex + 1 < quizLevel.questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResult(true);
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResult(false);
    };

    const finishQuiz = () => {
        const updatedQuizData = quizData.map(quiz => 
            quiz.id === levelNumber ? { ...quiz, isCompleted: true } : quiz
        );
        updateQuizData(updatedQuizData);
        navigation.goBack();
    };

    if (!quizLevel) {
        return (
            <View style={styles.container}>
                <Text>Quiz level not found</Text>
            </View>
        );
    }

    if (showResult) {
        return (
            <ImageBackground source={quizLevel.admiralInfo.image} style={styles.backgroundImage} blurRadius={20}>
                <View style={styles.container}>
                    <Text style={styles.resultText}>Quiz Completed!</Text>
                    <Text style={styles.scoreText}>Your Score: {score}/{quizLevel.questions.length}</Text>
                    <OptionButton option="Restart Quiz" onPress={restartQuiz} />
                    <OptionButton option="Finish" onPress={finishQuiz} />
                </View>
            </ImageBackground>
        );
    }

    const currentQuestion = quizLevel.questions[currentQuestionIndex];
    


    return (
        <ImageBackground source={quizLevel.admiralInfo.image} style={styles.backgroundImage} blurRadius={20}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
                {currentQuestion.options.map((option, index) => (
                    <OptionButton 
                        key={index}
                        option={option}
                        onPress={() => handleAnswer(option)}
                    />
                ))}
                <Text style={styles.progressText}>
                    Question {currentQuestionIndex + 1} of {quizLevel.questions.length}
                </Text>
            </ScrollView>
        </ImageBackground>
    );
};

export default StackQuizScreen;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(9, 9, 0, 0.7)',
    },
    questionText: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#ffffff',
    },
    optionButton: {
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: 300,
        alignItems: 'center',
        elevation: 3, // Add a slight shadow for depth
    },
    optionText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '600',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    progressText: {
        marginTop: 30,
        fontSize: 16,
        color: '#ffffff',
    },
    resultText: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#ffffff',
    },
    scoreText: {
        fontSize: 24,
        marginBottom: 30,
        color: '#ffffff',
    },
});

const OptionButton = ({ option, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <LinearGradient
            colors={['#006994', '#00a86b', '#3cb371', '#20b2aa']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.optionButton}
        >
            <Text style={styles.optionText}>{option}</Text>
        </LinearGradient>
    </TouchableOpacity>
);
