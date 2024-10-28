import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import IconMusic from './IconMusic';
import SoundIcon from './soundIcon';

const SoundControl = () => {
  const [playTrack, setPlayTrack] = useState(false);

  const soundToggleControl = async () => {
    await toggleBackgroundMusic();
    setPlayTrack((prev) => !prev);
    console.log(playSound);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={soundToggleControl}>
        {playTrack ? (
          <SoundIcon onPlay={playTrack} />
        ) : (
          <SoundIcon onPlay={playTrack} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SoundControl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
