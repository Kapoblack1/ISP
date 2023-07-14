import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from './component/BottomNavigation';

export default function PesquisaScreen({route}) {
  const { personId } = route.params;
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const navigation = useNavigation();

  const handleSearch = async () => {
    try {
      // Pesquisa de vídeos
      const videosRef = collection(FIREBASE_DB, 'videos');
      const videoQuerySnapshot = await getDocs(query(videosRef, where('titulo', '==', searchText)));

      const videoResults = [];
      videoQuerySnapshot.forEach((doc) => {
        const videoData = doc.data();
        videoResults.push(videoData);
      });

      // Pesquisa de áudios
      const audiosRef = collection(FIREBASE_DB, 'audio');
      const audioQuerySnapshot = await getDocs(query(audiosRef, where('titulo', '==', searchText)));

      const audioResults = [];
      audioQuerySnapshot.forEach((doc) => {
        const audioData = doc.data();
        audioResults.push(audioData);
      });

      setSearchResults([...videoResults, ...audioResults]);
      setSelectedAudio(null);
    } catch (error) {
      console.log('Erro ao realizar a pesquisa:', error);
    }
  };

  const handleAudioPress = (audio) => {
    setSelectedAudio(audio);
    navigation.navigate('Home', { audio1: audio, personId: personId  });
  };

  const Home = () => {
    navigation.navigate('Home', { personId: personId  });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={Home}>
          <Ionicons style={styles.iconBack} name="chevron-back-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.container1}>
        <Text style={styles.title}>Pesquisa</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua pesquisa"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={"white"}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Pesquisar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.resultsContainer}>
        {searchResults.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => handleAudioPress(item)}>
            <View style={styles.audioContainer}>
              <Image source={{ uri: item.imageDownloadURL }} style={styles.thumbnail} />
              <Text style={styles.audioTitle}>Titulo: { item.titulo}</Text>
              <Text style={styles.audioTitle}>Autor: {item.autor}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "rgb(18,18,18)",
  },
  container1: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    color:"white"
  },
  inputContainer: {
    marginBottom: 10,
    width: '80%',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'rgb(248,159,29)',
    borderRadius: 8,
    paddingHorizontal: 10,
    color:"white"
  },
  button: {
    width: '80%',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  resultsContainer: {
    marginTop: 20,
  },
  audioContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgb(248,159,29)',
    borderRadius: 10,
    padding: 10,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: "white"
  },
  audioPlayer: {
    width: '100%',
    height: 50,
    marginTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: '15%',
  },
});
