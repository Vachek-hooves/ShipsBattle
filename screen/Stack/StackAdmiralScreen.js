import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { shipQuizData } from '../../data/shipQuiz';

const { width } = Dimensions.get('window');
const imageHeight = width * 1.4;

export default function StackAdmiralScreen() {
  const route = useRoute();
  const { admiral, quizId } = route.params;
  
  const originalQuiz = shipQuizData.find(quiz => quiz.id === quizId);
  const admiralImage = originalQuiz?.admiralInfo?.image;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground 
          source={admiralImage}
          style={styles.headerImage}
        >
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
            style={styles.headerGradient}
          >
            <Text style={styles.name}>{admiral.name}</Text>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <LinearGradient
            colors={['#1a2a6c', '#b21f1f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.content}
          >
            {/* <View style={styles.medalIcon}>
              <Image 
                source={require('../../assets/icons/medal.png')} 
                style={styles.medalImage}
                resizeMode="contain"
              />
            </View> */}

            <View style={styles.quoteContainer}>
              <Text style={styles.quote}>"{admiral.famousQuote}"</Text>
              <View style={styles.quoteLine} />
            </View>

            <Text style={styles.description}>{admiral.description}</Text>

            <View style={styles.achievementsContainer}>
              <Text style={styles.achievementsTitle}>Notable Achievements</Text>
              <View style={styles.achievementsList}>
                <View style={styles.achievementItem}>
                  <View style={styles.achievementDot} />
                  <Text style={styles.achievementText}>Naval Commander</Text>
                </View>
                <View style={styles.achievementItem}>
                  <View style={styles.achievementDot} />
                  <Text style={styles.achievementText}>Strategic Genius</Text>
                </View>
                <View style={styles.achievementItem}>
                  <View style={styles.achievementDot} />
                  <Text style={styles.achievementText}>Battle Veteran</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerImage: {
    width: width,
    height: imageHeight,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  contentContainer: {
    marginTop: -50,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    paddingTop: 40,
    minHeight: 500,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 120,
  },
  medalIcon: {
    position: 'absolute',
    top: -30,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: '#4ECDC4',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  medalImage: {
    width: 35,
    height: 35,
    tintColor: '#fff',
  },
  quoteContainer: {
    marginBottom: 30,
  },
  quote: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#4ECDC4',
    lineHeight: 28,
    marginBottom: 10,
  },
  quoteLine: {
    width: 100,
    height: 3,
    backgroundColor: '#4ECDC4',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'justify',
  },
  achievementsContainer: {
    marginTop: 20,
  },
  achievementsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  achievementsList: {
    marginLeft: 10,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
    marginRight: 10,
  },
  achievementText: {
    fontSize: 16,
    color: '#fff',
  },
});
