import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Animated, PanResponder } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHIP_SIZE = 50;
const BULLET_SIZE = 10;
const INITIAL_ENEMY_COUNT = 3;

const StackShipsBattle = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [enemyCount, setEnemyCount] = useState(INITIAL_ENEMY_COUNT);
  const playerShip = useRef(new Animated.ValueXY({ x: SCREEN_WIDTH / 2 - SHIP_SIZE / 2, y: SCREEN_HEIGHT - SHIP_SIZE * 2 })).current;
  const [enemyShips, setEnemyShips] = useState(
    Array(INITIAL_ENEMY_COUNT).fill().map(() => ({
      position: new Animated.ValueXY({ x: Math.random() * (SCREEN_WIDTH - SHIP_SIZE), y: Math.random() * (SCREEN_HEIGHT / 3) }),
      isAlive: true
    }))
  );
  const [bullets, setBullets] = useState([]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      playerShip.x.setValue(gesture.moveX - SHIP_SIZE / 2);
    },
  });

  useEffect(() => {
    moveEnemyShips();
  }, []);

  const moveEnemyShips = () => {
    enemyShips.forEach((ship, index) => {
      if (ship.isAlive) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(ship.position.x, {
              toValue: Math.random() * (SCREEN_WIDTH - SHIP_SIZE),
              duration: 2000 + index * 500,
              useNativeDriver: false,
            }),
            Animated.timing(ship.position.y, {
              toValue: Math.random() * (SCREEN_HEIGHT / 3),
              duration: 2000 + index * 500,
              useNativeDriver: false,
            }),
          ])
        ).start();
      }
    });
  };

  const shoot = () => {
    const newBullet = new Animated.ValueXY({ x: playerShip.x._value + SHIP_SIZE / 2 - BULLET_SIZE / 2, y: playerShip.y._value });
    setBullets(prevBullets => [...prevBullets, newBullet]);

    Animated.timing(newBullet.y, {
      toValue: -BULLET_SIZE,
      duration: 1000,
      useNativeDriver: false,
    }).start(() => {
      setBullets(prevBullets => prevBullets.filter(bullet => bullet !== newBullet));
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBullets(prevBullets => {
        const updatedBullets = [...prevBullets];
        const bulletsToRemove = [];

        updatedBullets.forEach((bullet) => {
          let bulletHit = false;
          enemyShips.forEach((ship, index) => {
            if (!bulletHit && ship.isAlive &&
              Math.abs(bullet.x._value - ship.position.x._value) < SHIP_SIZE &&
              Math.abs(bullet.y._value - ship.position.y._value) < SHIP_SIZE
            ) {
              setScore(prevScore => prevScore + 1);
              setEnemyCount(prevCount => prevCount - 1);
              setEnemyShips(prevShips => prevShips.map((s, i) => 
                i === index ? { ...s, isAlive: false } : s
              ));
              bulletHit = true;
              bulletsToRemove.push(bullet);
            }
          });
        });

        return updatedBullets.filter(bullet => !bulletsToRemove.includes(bullet));
      });

      if (enemyCount === 0) {
        setGameOver(true);
        clearInterval(interval);
      }

      enemyShips.forEach((ship) => {
        if (ship.isAlive &&
          Math.abs(ship.position.x._value - playerShip.x._value) < SHIP_SIZE &&
          Math.abs(ship.position.y._value - playerShip.y._value) < SHIP_SIZE
        ) {
          setGameOver(true);
          clearInterval(interval);
        }
      });
    }, 16);

    return () => clearInterval(interval);
  }, [enemyCount]);

  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.gameOverText}>{enemyCount === 0 ? "You Win!" : "Game Over"}</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.scoreText}>Score: {score}</Text>
      {enemyShips.map((ship, index) => (
        ship.isAlive && (
          <Animated.View key={index} style={[styles.enemyShip, ship.position.getLayout()]} />
        )
      ))}
      {bullets.map((bullet, index) => (
        <Animated.View key={index} style={[styles.bullet, bullet.getLayout()]} />
      ))}
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.playerShip, playerShip.getLayout()]}
      />
      <TouchableOpacity style={styles.shootButton} onPress={shoot}>
        <Text style={styles.shootButtonText}>Shoot</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StackShipsBattle;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB',
  },
  playerShip: {
    width: SHIP_SIZE,
    height: SHIP_SIZE,
    backgroundColor: 'blue',
    position: 'absolute',
  },
  enemyShip: {
    width: SHIP_SIZE,
    height: SHIP_SIZE,
    backgroundColor: 'red',
    position: 'absolute',
  },
  bullet: {
    width: BULLET_SIZE,
    height: BULLET_SIZE,
    backgroundColor: 'yellow',
    position: 'absolute',
  },
  shootButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  shootButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scoreText: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: SCREEN_HEIGHT / 3,
  },
});
