import TrackPlayer, { Capability, State } from 'react-native-track-player';

export let isPlayerInitialized = false;
let initializationPromise = null;

export const setupPlayer = async () => {
  if (isPlayerInitialized) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = new Promise(async (resolve, reject) => {
    try {
      let setupResult;
      try {
        const playbackState = await TrackPlayer.getPlaybackState();
        setupResult = playbackState.state;
      } catch (error) {
        // If getPlaybackState throws an error, the player is not initialized
        setupResult = State.None;
      }

      if (setupResult !== State.None) {
        console.log('Player already set up, skipping initialization');
        isPlayerInitialized = true;
        resolve();
        return;
      }

      try {
        await TrackPlayer.setupPlayer();
      } catch (setupError) {
        if (
          setupError.message.includes('The player has already been initialized')
        ) {
          console.log('Player was already initialized, continuing...');
          isPlayerInitialized = true;
          resolve();
          return;
        } else {
          throw setupError;
        }
      }

      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });

      await TrackPlayer.add({
        id: 'backgroundMusic',
        url: require('../assets/sound/polka.mp3'),
        title: 'Background Music',
        artist: 'Your App',
      });

      isPlayerInitialized = true;
      console.log('Track player set up successfully');
      resolve();
    } catch (error) {
      console.error('Error setting up player:', error);
      isPlayerInitialized = false;
      reject(error);
    } finally {
      initializationPromise = null;
    }
  });

  return initializationPromise;
};

export const playBackgroundMusic = async () => {
  await setupPlayer();
  try {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack === null) {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: 'backgroundMusic',
        url: require('../assets/sound/polka.mp3'),
        title: 'Background Music',
        artist: 'Your App',
      });
    }
    await TrackPlayer.play();
  } catch (error) {
    console.error('Error playing background music:', error);
    // If there's an error, try to re-initialize the player
    isPlayerInitialized = false;
    await setupPlayer();
    await TrackPlayer.add({
      id: 'backgroundMusic',
      url: require('../assets/sound/polka.mp3'),
      title: 'Background Music',
      artist: 'Your App',
    });
    await TrackPlayer.play();
  }
};

export const resetPlayer = async () => {
  if (!isPlayerInitialized) {
    return;
  }

  try {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
    isPlayerInitialized = false;
    console.log('Track player reset successfully');
  } catch (error) {
    console.error('Error resetting player:', error);
    isPlayerInitialized = false;
  }
};

export const toggleBackgroundMusic = async () => {
  await setupPlayer();
  try {
    const playbackState = await TrackPlayer.getPlaybackState();
    if (playbackState.state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  } catch (error) {
    console.error('Error toggling background music:', error);
    // If there's an error, try to re-initialize the player
    isPlayerInitialized = false;
    await playBackgroundMusic();
  }
};
