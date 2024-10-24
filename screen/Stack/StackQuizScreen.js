import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAppContextProvider } from '../../store/context';

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
            <View style={styles.container}>
                <Text style={styles.resultText}>Quiz Completed!</Text>
                <Text style={styles.scoreText}>Your Score: {score}/{quizLevel.questions.length}</Text>
                <TouchableOpacity style={styles.button} onPress={restartQuiz}>
                    <Text style={styles.buttonText}>Restart Quiz</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={finishQuiz}>
                    <Text style={styles.buttonText}>Finish</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentQuestion = quizLevel.questions[currentQuestionIndex];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            {currentQuestion.options.map((option, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={styles.optionButton}
                    onPress={() => handleAnswer(option)}
                >
                    <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
            ))}
            <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1} of {quizLevel.questions.length}
            </Text>
        </ScrollView>
    );
};

export default StackQuizScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
    },
    optionText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    progressText: {
        marginTop: 20,
        fontSize: 16,
    },
    resultText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 20,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
    },
});
