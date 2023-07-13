import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STORAGE } from '../../FirebaseConfig';

const AudioDownloadScreen = () => {
  const [audioURL, setAudioURL] = useState('');

  useEffect(() => {
    // Função para obter a URL de download do arquivo de áudio do Firebase Storage
    const getAudioDownloadURL = async () => {
      const storageRef = ref(getStorage(), 'caminho_do_arquivo_de_audio');
      const url = await getDownloadURL(storageRef);
      setAudioURL(url);
    };

    getAudioDownloadURL();
  }, []);

  const handleDownload = async () => {
    if (audioURL) {
      const fileUri = FileSystem.documentDirectory + 'audio.mp3';
      await FileSystem.downloadAsync(audioURL, fileUri);
      console.log('Áudio baixado com sucesso:', fileUri);
    }
  };

  return (
    <View>
      <Button title="Download do Áudio" onPress={handleDownload} />
    </View>
  );
};

export default AudioDownloadScreen;
