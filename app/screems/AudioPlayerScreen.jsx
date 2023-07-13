import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';

const AudioPlayerScreen = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const selectedAudio = route.params.audio;

  useEffect(() => {
    if (selectedAudio) {
      handlePlayAudio(selectedAudio.audioURL);
    } else {
      stopAudio();
    }
  }, [selectedAudio]);

  const handlePlayAudio = async (audioURL) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioURL });
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Erro ao reproduzir o áudio:', error);
    }
  };

  const handlePauseAudio = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Erro ao pausar o áudio:', error);
    }
  };

  const stopAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        setIsPlaying(false);
        await sound.unloadAsync();
        setSound(null);
      }
    } catch (error) {
      console.error('Erro ao parar o áudio:', error);
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <TouchableOpacity onPress={() => handlePauseAudio()}>
        <Image source={{ uri: selectedAudio.thumbnailURL }} style={{ width: 200, height: 200 }} />
      </TouchableOpacity>
      <Text>Name: {selectedAudio.name}</Text>
      <Text>Audio URL: {selectedAudio.audioURL}</Text>
      <Text>Thumbnail URL: {selectedAudio.thumbnailURL}</Text>
      <Text>Is Playing: {isPlaying ? 'Yes' : 'No'}</Text>
    </View>
  );
};

export default AudioPlayerScreen;
