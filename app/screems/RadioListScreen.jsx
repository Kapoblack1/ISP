import React, { useEffect, useState } from 'react';
import { Text, View, Button, Image } from 'react-native';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { Audio } from 'expo-av';

const RadioListScreen = () => {
  const [radios, setRadios] = useState([]);

  useEffect(() => {
    const fetchRadios = async () => {
      try {
        const radiosCollection = collection(FIREBASE_DB, 'radios');
        const unsubscribe = onSnapshot(radiosCollection, (snapshot) => {
          const radioList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isPlaying: false,
            soundObject: null
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
      // Pausa a rádio atualmente em reprodução, se houver
      const playingRadio = radios.find((r) => r.isPlaying);
      if (playingRadio && playingRadio.soundObject) {
        await playingRadio.soundObject.pauseAsync();
        playingRadio.isPlaying = false;
      }

      // Reproduz a nova rádio selecionada
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

      setRadios([...radios]);
    } catch (error) {
      console.error('Erro ao reproduzir o áudio:', error);
    }
  };

  return (
    <View>
      <Text>Lista de Rádios:</Text>
      {radios.map((radio) => (
        <View key={radio.id}>
          <Text>Nome: {radio.name}</Text>
          <Text>Frequência: {radio.frequency}</Text>
          <Image source={{ uri: radio.thumbnailURL }} style={{ width: 100, height: 100 }} />
          <Button
            title={radio.isPlaying ? 'Pausar' : 'Reproduzir'}
            onPress={() => handlePlayRadio(radio)}
          />
        </View>
      ))}
    </View>
  );
};

export default RadioListScreen;
