import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Animated, PanResponder,Image } from 'react-native';
import { battleShips } from '../../data/battleShips';

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
      isAlive: true,
      speed: Math.random() * 0.5 + 0.5, // Random speed between 0.5 and 1
      direction: Math.random() * 2 * Math.PI // Random direction in radians
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
    const moveInterval = setInterval(() => {
      setEnemyShips(prevShips => 
        prevShips.map(ship => {
          if (!ship.isAlive) return ship;

          const newX = ship.position.x._value + Math.cos(ship.direction) * ship.speed;
          const newY = ship.position.y._value + Math.sin(ship.direction) * ship.speed;

          // Bounce off the edges
          let newDirection = ship.direction;
          if (newX <= 0 || newX >= SCREEN_WIDTH - SHIP_SIZE) {
            newDirection = Math.PI - newDirection;
          }
          if (newY <= 100 || newY >= SCREEN_HEIGHT / 2) {
            newDirection = -newDirection;
          }

          ship.position.setValue({ 
            x: Math.max(0, Math.min(newX, SCREEN_WIDTH - SHIP_SIZE)),
            y: Math.max(100, Math.min(newY, SCREEN_HEIGHT / 2))
          });

          return {
            ...ship,
            direction: newDirection,
            // Occasionally change direction
            ...(Math.random() < 0.02 && { direction: Math.random() * 2 * Math.PI })
          };
        })
      );
    }, 16); // Update every frame (60 FPS)

    return () => clearInterval(moveInterval);
  }, []);

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
      >
        <Image source={battleShips[0].image} style={styles.playerShipImage} />

      </Animated.View>
      <TouchableOpacity style={styles.shootButton} onPress={shoot}>
        <Text style={styles.shootButtonText}>Shoot</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StackShipsBattle;

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flex: 1,
    backgroundColor: '#87CEEB',
    paddingHorizontal: 20,
  },
  playerShip: {
    width: SHIP_SIZE,
    height: SHIP_SIZE,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 60,
  },
  playerShipImage:{
    width: SHIP_SIZE+50,
    height: SHIP_SIZE+50,
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
    backgroundColor: 'black',
    position: 'absolute',
    borderRadius: BULLET_SIZE / 2,

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
    // position: 'absolute',
    // top: 20,
    // left: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1000,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: SCREEN_HEIGHT / 3,
  },
});
