import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { shipQuizData } from '../../data/shipQuiz';

export default function StackAdmiralScreen() {
  const route = useRoute();
  const { admiral, quizId } = route.params;
  
  const originalQuiz = shipQuizData.find(quiz => quiz.id === quizId);
  const admiralImage = originalQuiz?.admiralInfo?.image;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image 
            source={admiralImage}
            style={styles.admiralImage}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Text style={styles.name}>{admiral.name}</Text>
            <Text style={styles.description}>{admiral.description}</Text>
            <View style={styles.quoteContainer}>
              <Text style={styles.quote}>"{admiral.famousQuote}"</Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  admiralImage: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  content: {
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  quoteContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#4ECDC4',
    paddingLeft: 15,
    marginTop: 20,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#4ECDC4',
    lineHeight: 24,
  },
});
