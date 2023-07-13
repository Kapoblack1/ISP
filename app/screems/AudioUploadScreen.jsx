import React, { useState } from 'react';
import { Button, Text, View, Image, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AudioUploadScreen = ({ person, personId }) => {
  const { username } = person;
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [description, setDescription] = useState('');
  const [titulo, setTitulo] = useState('');
  const [est, setEst] = useState('');
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [imageDownloadURL, setImageDownloadURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const uploadAudio = async () => {
    try {
      if (selectedAudio && selectedThumbnail) {
        setLoading(true);

        const audioStorageRef = ref(FIREBASE_STORAGE, `audios/${selectedAudio.name}`);
        const audioResponse = await fetch(selectedAudio.uri);
        const audioBlob = await audioResponse.blob();
        await uploadBytes(audioStorageRef, audioBlob);
        const audioURL = await getDownloadURL(audioStorageRef);

        const thumbnailStorageRef = ref(FIREBASE_STORAGE, `thumbnails/${selectedThumbnail.name}`);
        const thumbnailResponse = await fetch(selectedThumbnail.uri);
        const thumbnailBlob = await thumbnailResponse.blob();
        await uploadBytes(thumbnailStorageRef, thumbnailBlob);
        const thumbnailURL = await getDownloadURL(thumbnailStorageRef);
        setImageDownloadURL(thumbnailURL);

        const audioData = {
          name: selectedAudio.name,
          timestamp: serverTimestamp(),
          audioURL,
          thumbnailURL,
          description,
          titulo,
          est: est,
          autor: person.username,
          tipo: 'Áudio',
          dia,
          mes,
          ano,
          imageDownloadURL,
        };

        const audiosCollection = collection(FIREBASE_DB, 'audio');
        await addDoc(audiosCollection, audioData);

        console.log('Áudio enviado com sucesso!');
        setLoading(false);
        setUploadSuccess(true);
      }
    } catch (error) {
      console.error('Erro ao enviar o áudio:', error);
      setLoading(false);
    }
  };

  const pickAudio = async () => {
    try {
      const { uri, name } = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
      setSelectedAudio({ uri, name });
    } catch (error) {
      console.error('Erro ao escolher o áudio:', error);
    }
  };

  const pickThumbnail = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.cancelled) {
        setSelectedThumbnail({ uri: result.uri, name: result.uri.split('/').pop() });
        const thumbnailStorageRef = ref(FIREBASE_STORAGE, `thumbnails/${result.uri.split('/').pop()}`);
        const thumbnailResponse = await fetch(result.uri);
        const thumbnailBlob = await thumbnailResponse.blob();
        await uploadBytes(thumbnailStorageRef, thumbnailBlob);
        const thumbnailURL = await getDownloadURL(thumbnailStorageRef);
        setImageDownloadURL(thumbnailURL);
      }
    } catch (error) {
      console.error('Erro ao escolher a thumbnail:', error);
    }
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    setDia(currentDate.getDate().toString());
    setMes((currentDate.getMonth() + 1).toString());
    setAno(currentDate.getFullYear().toString());
  };

  return (
    <View>
      <Button title="Escolher Áudio" titleStyle={{ color: 'white' }} onPress={pickAudio} />
      {selectedAudio && (
        <View>
          <Text style={{ color: 'white' }}>Áudio selecionado: {selectedAudio.name}</Text>
          <Button title="Escolher Thumbnail" onPress={pickThumbnail} titleStyle={{ color: 'white' }}/>
          {selectedThumbnail && (
            <View>
              <Text style={{ color: 'white' }}>Thumbnail selecionada: {selectedThumbnail.name}</Text>
              <TextInput
                placeholder="Descrição"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                placeholderTextColor="white"
              />
              <TextInput
                placeholder="Título"
                value={titulo}
                onChangeText={setTitulo}
                style={styles.input}
                placeholderTextColor="white"
              />
              <TextInput
                placeholder="Estilo"
                value={est}
                onChangeText={setEst}
                style={styles.input}
                placeholderTextColor="white"
              />
              <Button title="Obter Data Atual" onPress={getCurrentDate} />
              <Text style={{ color: 'white' }}>Data: {`${dia}/${mes}/${ano}`}</Text>
              {loading ? (
                <ActivityIndicator size="large" color="rgb(248,159,29)" />
              ) : (
                <Button title="Enviar Áudio" onPress={uploadAudio} />
              )}
              {uploadSuccess && (
                Alert.alert('Sucesso', 'Áudio enviado com sucesso!', [{ text: 'OK', onPress: () => setUploadSuccess(false) }])
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'rgb(248,159,29)',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: 'white',
    margin: 10,
  },
  button1: {
    width: '100%',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgb(0,0,0)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgb(248,159,29)',
    color: "white",
  },
});

export default AudioUploadScreen;
