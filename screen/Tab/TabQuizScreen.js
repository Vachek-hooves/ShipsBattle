import React from 'react';
import { StyleSheet, View, ImageBackground, TouchableOpacity, Text } from 'react-native';

const LevelMarker = ({ number, top, left }) => (
  <View style={[styles.marker, { top, left }]}>
    <Text style={styles.markerText}>{number}</Text>
  </View>
);

const TabQuizScreen = () => {
  const levels = [
    { number: 1, top: '15%', left: '20%' },
    { number: 2, top: '15%', left: '80%' },
    { number: 3, top: '32%', left: '65%' },
    { number: 4, top: '40%', left: '80%' },
    { number: 5, top: '45%', left: '50%' },
    { number: 6, top: '40%', left: '15%' },
    { number: 7, top: '60%', left: '20%' },
    { number: 8, top: '60%', left: '60%' },
    { number: 9, top: '80%', left: '20%' },
    { number: 10, top: '80%', left: '70%' },
  ];

  return (
    <ImageBackground 
      source={require('../../assets/image/bg/map.png')} 
      style={styles.image}
    >
      {levels.map((level) => (
        <TouchableOpacity
          key={level.number}
          style={[styles.levelArea, { top: level.top, left: level.left }]}
          onPress={() => console.log(`Level ${level.number} selected`)}
        >
          <LevelMarker number={level.number} top={0} left={0} />
        </TouchableOpacity>
      ))}
    </ImageBackground>
  );
};

export default TabQuizScreen;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  levelArea: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  marker: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
