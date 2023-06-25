import React, { useEffect, useState } from 'react';
import { Text, View, Button, Image, ScrollView } from 'react-native';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { Audio, Video } from 'expo-av';

const RadioListScreen1 = () => {
  const [radios, setRadios] = useState([]);
  const [currentRadio, setCurrentRadio] = useState(null);

  useEffect(() => {
    const fetchRadios = async () => {
      try {
        const radiosCollection = collection(FIREBASE_DB, 'radios');
        const unsubscribe = onSnapshot(radiosCollection, (snapshot) => {
          const radioList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isPlaying: false,
            soundObject: null,
            videoObject: null
          }));
          setRadios(radioList);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Erro ao buscar as rádios:', error);
      }
    };

    fetchRadios();
  }, []);

  const handlePlayRadio = async (radio) => {
    try {
      if (currentRadio && currentRadio.soundObject) {
        await currentRadio.soundObject.pauseAsync();
        currentRadio.isPlaying = false;
      }

      if (radio.id === currentRadio?.id) {
        // Clicou na mesma estação, pausa a reprodução
        setCurrentRadio(null);
        return;
      }

      if (radio.soundObject) {
        await radio.soundObject.playAsync();
        radio.isPlaying = true;
      } else {
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync({ uri: radio.frequency });
        await soundObject.playAsync();
        radio.soundObject = soundObject;
        radio.isPlaying = true;
      }

      setCurrentRadio(radio);
      setRadios([...radios]);
    } catch (error) {
      console.error('Erro ao reproduzir o áudio:', error);
    }
  };

  const handlePlayVideo = async (radio) => {
    try {
      if (currentRadio && currentRadio.videoObject) {
        await currentRadio.videoObject.pauseAsync();
        currentRadio.isVideoPlaying = false;
      }

      if (radio.id === currentRadio?.id) {
        // Clicou no mesmo vídeo, pausa a reprodução
        setCurrentRadio(null);
        return;
      }

      if (radio.videoObject) {
        await radio.videoObject.playAsync();
        radio.isVideoPlaying = true;
      } else {
        const videoObject = new Video.Video();
        await videoObject.loadAsync({ uri: radio.videoURL });
        await videoObject.playAsync();
        radio.videoObject = videoObject;
        radio.isVideoPlaying = true;
      }

      setCurrentRadio(radio);
      setRadios([...radios]);
    } catch (error) {
      console.error('Erro ao reproduzir o vídeo:', error);
    }
  };

  return (
    <ScrollView horizontal>
      <View>
        <Text>Lista de Rádios:</Text>
        {radios.map((radio) => (
          <View key={radio.id}>
            <Text>Nome: {radio.name}</Text>
            <Text>Frequência: {radio.frequency}</Text>
            <Image source={{ uri: radio.thumbnailURL }} style={{ width: 100, height: 100 }} onPress={() => handlePlayVideo(radio)} />
            <Button
              title={radio.isPlaying ? 'Pausar' : 'Reproduzir'}
              onPress={() => handlePlayRadio(radio)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default RadioListScreen1;
