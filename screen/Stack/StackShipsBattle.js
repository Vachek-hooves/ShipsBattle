import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  Image,
  ImageBackground,
  Alert,
  Switch,
} from 'react-native';
import Sound from 'react-native-sound';
import { battleShips } from '../../data/battleShips';
import { useAppContextProvider } from '../../store/context';
import { useNavigation } from '@react-navigation/native';

// Enable playback in silence mode
Sound.setCategory('Playback');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHIP_SIZE = 50;
const BULLET_SIZE = 10;
const INITIAL_ENEMY_COUNT = 3;

const StackShipsBattle = () => {
  const navigation = useNavigation();
  const { totalScore, updateTotalScore } = useAppContextProvider();
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [enemyCount, setEnemyCount] = useState(INITIAL_ENEMY_COUNT);
  const [shootCount, setShootCount] = useState(3);
  const [useGameScore, setUseGameScore] = useState(false);
  const [finalTotalScore, setFinalTotalScore] = useState(totalScore);
  const playerShip = useRef(
    new Animated.ValueXY({
      x: SCREEN_WIDTH / 2 - SHIP_SIZE / 2,
      y: SCREEN_HEIGHT - SHIP_SIZE * 2,
    })
  ).current;
  const [enemyShips, setEnemyShips] = useState(
    Array(INITIAL_ENEMY_COUNT)
      .fill()
      .map(() => ({
        position: new Animated.ValueXY({
          x: Math.random() * (SCREEN_WIDTH - SHIP_SIZE),
          y: Math.random() * (SCREEN_HEIGHT / 3),
        }),
        isAlive: true,
        speed: Math.random() * 0.5 + 0.5, // Random speed between 0.5 and 1
        direction: Math.random() * 2 * Math.PI, // Random direction in radians
      }))
  );
  const [bullets, setBullets] = useState([]);
  const shotSoundEffect = useRef(null);
  const explosionSoundEffect = useRef(null);

  const updateScore = useCallback((points) => {
    setScore(prevScore => prevScore + points);
  }, []);

  const handleGameCompletion = useCallback(() => {
    if (!gameOver) {
      const newTotalScore = totalScore + score;
      setGameOver(true);
      setFinalTotalScore(newTotalScore);
      updateTotalScore(newTotalScore);
    }
  }, [totalScore, score, updateTotalScore, gameOver]);

  useEffect(() => {
    // Load the sound files
    Sound.setCategory('Playback');
    shotSoundEffect.current = new Sound(
      require('../../assets/sound/uiSound/shot.mp3'),
      (error) => {
        if (error) {
          console.log('failed to load the shot sound', error);
          return;
        }
        console.log('successfully loaded the shot sound');
      }
    );

    explosionSoundEffect.current = new Sound(
      require('../../assets/sound/uiSound/shipExplosion.mp3'),
      (error) => {
        if (error) {
          console.log('failed to load the explosion sound', error);
          return;
        }
        console.log('successfully loaded the explosion sound');
      }
    );

    return () => {
      if (shotSoundEffect.current) {
        shotSoundEffect.current.release();
      }
      if (explosionSoundEffect.current) {
        explosionSoundEffect.current.release();
      }
    };
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      playerShip.x.setValue(gesture.moveX - SHIP_SIZE / 2);
    },
  });

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setEnemyShips((prevShips) =>
        prevShips.map((ship) => {
          if (!ship.isAlive) return ship;

          const newX =
            ship.position.x._value + Math.cos(ship.direction) * ship.speed;
          const newY =
            ship.position.y._value + Math.sin(ship.direction) * ship.speed;

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
            y: Math.max(100, Math.min(newY, SCREEN_HEIGHT / 2)),
          });

          return {
            ...ship,
            direction: newDirection,
            // Occasionally change direction
            ...(Math.random() < 0.02 && {
              direction: Math.random() * 2 * Math.PI,
            }),
          };
        })
      );
    }, 16); // Update every frame (60 FPS)

    return () => clearInterval(moveInterval);
  }, []);

  const shoot = () => {
    if (shootCount > 0) {
      setShootCount(prevCount => prevCount - 1);
      const newBullet = new Animated.ValueXY({
        x: playerShip.x._value + SHIP_SIZE / 2 - BULLET_SIZE / 2,
        y: playerShip.y._value,
      });
      setBullets((prevBullets) => [...prevBullets, newBullet]);

      // Play the shot sound
      if (shotSoundEffect.current) {
        shotSoundEffect.current.play((success) => {
          if (!success) {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }

      Animated.timing(newBullet.y, {
        toValue: -BULLET_SIZE,
        duration: 1000,
        useNativeDriver: false,
      }).start(() => {
        setBullets((prevBullets) =>
          prevBullets.filter((bullet) => bullet !== newBullet)
        );
      });
    } else {
      Alert.alert("No more shots", "Buy more shots or end the game.");
    }
  };

  const buyShot = () => {
    const currentScore = useGameScore ? score : totalScore;
    if (currentScore >= 10) {
      if (useGameScore) {
        setScore(prevScore => prevScore - 10);
      } else {
        updateTotalScore(totalScore - 10);
      }
      setShootCount(prevCount => prevCount + 1);
    } else {
      Alert.alert("Not enough score", `You need 10 points in your ${useGameScore ? 'game' : 'total'} score to buy a shot.`);
    }
  };

  const convertScoreToShots = () => {
    const shotsToAdd = Math.floor(score / 5);
    if (shotsToAdd > 0) {
      setScore(prevScore => prevScore % 5);
      setShootCount(prevCount => prevCount + shotsToAdd);
      Alert.alert("Shots Added", `Converted ${shotsToAdd * 5} points to ${shotsToAdd} shots.`);
    } else {
      Alert.alert("Not Enough Score", "You need at least 5 points to convert to a shot.");
    }
  };

  const exitGame = () => {
    Alert.alert(
      "Exit Game",
      "Are you sure you want to exit? Your current game progress will be lost.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Exit", 
          onPress: () => {
            updateTotalScore(totalScore + score);
            navigation.goBack();
          }
        }
      ]
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBullets((prevBullets) => {
        const updatedBullets = [...prevBullets];
        const bulletsToRemove = [];

        updatedBullets.forEach((bullet) => {
          let bulletHit = false;
          enemyShips.forEach((ship, index) => {
            if (
              !bulletHit &&
              ship.isAlive &&
              Math.abs(bullet.x._value - ship.position.x._value) < SHIP_SIZE &&
              Math.abs(bullet.y._value - ship.position.y._value) < SHIP_SIZE
            ) {
              updateScore(5);
              setEnemyCount((prevCount) => prevCount - 1);
              setEnemyShips((prevShips) =>
                prevShips.map((s, i) =>
                  i === index ? { ...s, isAlive: false } : s
                )
              );
              bulletHit = true;
              bulletsToRemove.push(bullet);

              // Play the explosion sound
              if (explosionSoundEffect.current) {
                explosionSoundEffect.current.play((success) => {
                  if (!success) {
                    console.log(
                      'explosion playback failed due to audio decoding errors'
                    );
                  }
                });
              }
            }
          });
        });

        return updatedBullets.filter(
          (bullet) => !bulletsToRemove.includes(bullet)
        );
      });

      if (enemyCount === 0) {
        handleGameCompletion();
        clearInterval(interval);
      }

      enemyShips.forEach((ship) => {
        if (
          ship.isAlive &&
          Math.abs(ship.position.x._value - playerShip.x._value) < SHIP_SIZE &&
          Math.abs(ship.position.y._value - playerShip.y._value) < SHIP_SIZE
        ) {
          handleGameCompletion();
          clearInterval(interval);
        }
      });
    }, 16);

    return () => clearInterval(interval);
  }, [enemyCount, updateScore, handleGameCompletion]);

  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.gameOverText}>
          {enemyCount === 0 ? 'You Win!' : 'Game Over'}
        </Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.totalScoreText}>Total Score: {finalTotalScore}</Text>
        <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
          <Text style={styles.exitButtonText}>Exit Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/image/bg/battleMap.png')}
        style={styles.backgroundImage}
      >
        <Text style={styles.scoreText}>Game Score: {score}</Text>
        <Text style={styles.shootCountText}>Shots left: {shootCount}</Text>
        <Text style={styles.totalScoreText}>Total Score: {totalScore}</Text>
        {enemyShips.map(
          (ship, index) =>
            ship.isAlive && (
              <Animated.View
                key={index}
                style={[styles.enemyShip, ship.position.getLayout()]}
              >
                <Image
                  source={battleShips[0].enemyShip}
                  style={styles.enemyShipImage}
                />
              </Animated.View>
            )
        )}
        {bullets.map((bullet, index) => (
          <Animated.View
            key={index}
            style={[styles.bullet, bullet.getLayout()]}
          />
        ))}
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.playerShip, playerShip.getLayout()]}
        >
          <Image
            source={battleShips[0].playerShip}
            style={styles.playerShipImage}
          />
        </Animated.View>
        <TouchableOpacity style={styles.shootButton} onPress={shoot}>
          <Text style={styles.shootButtonText}>Shoot</Text>
        </TouchableOpacity>
        <View style={styles.buyButtonContainer}>
          <TouchableOpacity style={styles.buyButton} onPress={buyShot}>
            <Text style={styles.buyButtonText}>Buy Shot (10 pts)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.convertButton} onPress={convertScoreToShots}>
            <Text style={styles.convertButtonText}>Convert Score to Shots</Text>
          </TouchableOpacity>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Use Game Score</Text>
            <Switch
              value={useGameScore}
              onValueChange={setUseGameScore}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.exitButton} onPress={exitGame}>
          <Text style={styles.exitButtonText}>Exit Game</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

export default StackShipsBattle;

const styles = StyleSheet.create({
  container: {
    // paddingTop: 60,
    flex: 1,
    backgroundColor: '#87CEEB',
    // paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  enemyShipImage: {
    width: SHIP_SIZE + 50,
    height: SHIP_SIZE + 50,
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
  playerShipImage: {
    width: SHIP_SIZE + 50,
    height: SHIP_SIZE + 50,
  },
  enemyShip: {
    width: SHIP_SIZE,
    height: SHIP_SIZE,
    backgroundColor: 'red',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
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
  buyButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  shootCountText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1000,
  },
  totalScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1000,
  },
  buyButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleText: {
    color: 'white',
    marginRight: 10,
  },
  exitButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  exitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  convertButton: {
    backgroundColor: 'purple',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  convertButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
