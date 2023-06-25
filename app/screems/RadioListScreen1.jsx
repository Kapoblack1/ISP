import React, { useEffect, useState } from 'react';
import { Text, View, Button, Image, FlatList } from 'react-native';
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

  const renderRadioItem = ({ item }) => (
    <View key={item.id} style={{ marginRight: 20 }}>
      <Image
        source={{ uri: item.thumbnailURL }}
        style={{ width: 150, height: 150 }}
        onPress={() => handlePlayVideo(item)}
      />
       <Text>{item.name}</Text>
      <Button
        title={item.isPlaying ? 'Pausar' : 'Reproduzir'}
        onPress={() => handlePlayRadio(item)}
      ></Button>

    </View>
  );

  return (
    <FlatList
      data={radios}
      keyExtractor={(item) => item.id}
      renderItem={renderRadioItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={120} // Define o intervalo entre os itens do carrossel
      contentContainerStyle={{ paddingHorizontal: 10 }}
    />
  );
};

export default RadioListScreen1;
