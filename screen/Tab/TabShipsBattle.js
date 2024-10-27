import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, FlatList, Dimensions } from 'react-native';
import { battleShips } from '../../data/battleShips';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.8;

const ShipCard = ({ ship, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    <ImageBackground source={ship.enemyShip} style={styles.cardBackground}>
      <View style={styles.cardContent}>
        <Text style={styles.cardText}>Ship Level: {ship.id}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const TabShipsBattle = ({ navigation }) => {
  const startBattle = (shipLevel) => {
    navigation.navigate('StackShipsBattle', { shipLevel });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/image/bg/shipsBatlle.png')} style={styles.backgroundImage} blurRadius={20}>
        <Text style={styles.title}>Choose Your Battle</Text>
        <FlatList
          data={battleShips}
          renderItem={({ item }) => (
            <ShipCard ship={item} onPress={() => startBattle(item.id)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.cardList}
        />
      </ImageBackground>
    </View>
  );
};

export default TabShipsBattle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  cardList: {
    alignItems: 'center',
  },
  card: {
    width: cardWidth,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
