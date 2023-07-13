import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { ref, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_STORAGE } from '../../../FirebaseConfig';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';

const PlayerAudio = ({ audio }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [playerHeight, setPlayerHeight] = useState(70);
  const [imageSize, setImageSize] = useState(new Animated.Value(50));
  const [panY] = useState(new Animated.Value(-5));
  const [infoContainerPosition] = useState(new Animated.Value(0));
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const imageRef = ref(FIREBASE_STORAGE, '/imagens/logo.png');
    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.log('Error getting image URL from Firebase Storage:', error);
      });
  }, []);

  const onPanGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: panY } }],
    { useNativeDriver: true }
  );

  useEffect(() => {
    if (audio) {
      loadAudio();
    }
  }, [audio]);

  const loadAudio = async () => {
    try {
      if (!loading) {
        setLoading(true);

        // Stop the previous audio if it is playing
        stopAudio();

        const { sound: audioSound } = await Audio.Sound.createAsync(
          { uri: audio.audioURL },
          { shouldPlay: true },
          updatePlaybackStatus
        );

        setLoading(false);
        setSound(audioSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const stopAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const handlePlayAudio = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleSliderChange = async (value) => {
    try {
      if (sound) {
        await sound.setPositionAsync(value);
        setPosition(value);
      }
    } catch (error) {
      console.error('Error changing slider position:', error);
    }
  };

  const updatePlaybackStatus = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY } = event.nativeEvent;
      const windowHeight = Dimensions.get('window').height;
      if (translationY < -50) {
        setIsExpanded(true);
        Animated.spring(panY, {
          toValue: 0,
          velocity: 10,
          tension: 2,
          friction: 8,
          useNativeDriver: true,
        }).start();
        Animated.spring(imageSize, {
          toValue: 200,
          velocity: 10,
          tension: 2,
          friction: 8,
          useNativeDriver: false,
        }).start();
        setPlayerHeight(windowHeight);
      } else {
        setIsExpanded(false);
        Animated.spring(panY, {
          toValue: -5,
          velocity: 7,
          tension: 2,
          friction: 8,
          useNativeDriver: true,
        }).start();
        Animated.spring(imageSize, {
          toValue: 60,
          velocity: 7,
          tension: 2,
          friction: 8,
          useNativeDriver: false,
        }).start();
        setPlayerHeight(70);
      }
    }
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        onGestureEvent={onPanGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.playerContainer,
            { height: playerHeight, transform: [{ translateY: panY }] },
          ]}
        >
          <View style={styles.contentContainer}>
            {isExpanded && (
              <TouchableOpacity onPress={handlePlayAudio} disabled={loading} style={styles.playButton}>
                {loading ? (
                  <ActivityIndicator size="large" color="rgb(248,159,29)" />
                ) : isPlaying ? (
                  <Ionicons name="pause-sharp" size={30} color="rgb(248,159,29)" />
                ) : (
                  <Ionicons name="play-sharp" size={30} color="rgb(248,159,29)" />
                )}
              </TouchableOpacity>
            )}
            <Animated.Image
              style={[
                styles.albumCover,
                { width: imageSize, height: imageSize },
                isExpanded && styles.centeredAlbumCover,
              ]}
              source={
                audio.imageDownloadURL ? { uri: audio.imageDownloadURL } : null
              }
            />
            <Animated.View style={[styles.songInfoContainer, { marginLeft: isExpanded ? 10 : 0 }]}>
              {audio.titulo && (
                <Text style={styles.songTitle}>{audio.titulo}</Text>
              )}
              {audio.autor && (
                <Text style={styles.artistName}>{audio.autor}</Text>
              )}
            </Animated.View>
          </View>
          {isExpanded && (
            <View style={styles.sliderContainer}>
              <Slider
                value={position}
                minimumValue={0}
                maximumValue={duration}
                thumbTintColor="rgb(248, 159, 29)"
                minimumTrackTintColor="rgb(248, 159, 29)"
                maximumTrackTintColor="grey"
                thumbStyle={styles.sliderThumb}
                trackStyle={styles.sliderTrack}
                onValueChange={handleSliderChange}
              />
              <View style={styles.durationContainer}>
                <Text style={styles.durationText}>{formatTime(position)}</Text>
                <Text style={styles.durationText}>{formatTime(duration)}</Text>
              </View>
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const formatTime = (timeInMillis) => {
  const totalSeconds = Math.floor(timeInMillis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: '15%',
  },
  playerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(18,18,18)',
    borderTopWidth: 1,
    borderTopColor: 'rgb(248,159,29)',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  centeredAlbumCover: {
    alignSelf: 'center',
  },
  songInfoContainer: {
    flex: 1,
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  artistName: {
    fontSize: 14,
    color: '#888888',
  },
  playButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sliderContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  sliderThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgb(248,159,29)',
  },
  sliderTrack: {
    height: 2,
    borderRadius: 1,
    backgroundColor: 'grey',
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  durationText: {
    fontSize: 12,
    color: 'white',
  },
});
export default PlayerAudio;