import React, { useState, useEffect } from 'react';
import { Button, Text, View, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';

const RadioUploadScreen = () => {
  const [frequency, setFrequency] = useState('');
  const [name, setName] = useState('');
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  useEffect(() => {
    getPermission();
  }, []);

  const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão negada',
        'Desculpe, precisamos de permissão para acessar a biblioteca de mídia!'
      );
    }
  };

  const pickThumbnail = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        setSelectedThumbnail(result.uri);
      }
    } catch (error) {
      console.error('Erro ao escolher a thumbnail:', error);
    }
  };

  const uploadRadio = async () => {
    try {
      if (frequency && name && selectedThumbnail) {
        const thumbnailResponse = await fetch(selectedThumbnail);
        const thumbnailBlob = await thumbnailResponse.blob();

        const thumbnailStorageRef = ref(FIREBASE_STORAGE, `thumbnails/${name}`);
        await uploadBytes(thumbnailStorageRef, thumbnailBlob);
        const thumbnailURL = await getDownloadURL(thumbnailStorageRef);

        const radioData = {
          frequency,
          name,
          thumbnailURL
        };

        const radiosCollection = collection(FIREBASE_DB, 'radios');
        await addDoc(radiosCollection, radioData);

        console.log('Rádio enviado com sucesso!');
        setFrequency('');
        setName('');
        setSelectedThumbnail(null);
      }
    } catch (error) {
      console.error('Erro ao enviar o rádio:', error);
    }
  };

  return (
    <View>
      <Text>Frequência:</Text>
      <TextInput value={frequency} onChangeText={setFrequency} />
      <Text>Nome:</Text>
      <TextInput value={name} onChangeText={setName} />
      <Button title="Escolher Thumbnail" onPress={pickThumbnail} />
      {selectedThumbnail && (
        <View>
          <Text>Thumbnail selecionada:</Text>
          <Image source={{ uri: selectedThumbnail }} style={{ width: 200, height: 200 }} />
          <Button title="Enviar Rádio" onPress={uploadRadio} />
        </View>
      )}
    </View>
  );
};

export default RadioUploadScreen;
