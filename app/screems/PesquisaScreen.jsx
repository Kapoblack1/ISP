import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';

export default function PesquisaScreen(){
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      // Realiza a consulta no Firestore para buscar vídeos com o nome correspondef4nte ao texto de pesquisa
      const videosRef = collection(FIREBASE_DB, 'videos');
      const querySnapshot = await getDocs(
        query(videosRef, where('titulo', '==', searchText))
      );      

      // Processa os resultados da pesquisa
      const results = [];
      querySnapshot.forEach((doc) => {
        const videoData = doc.data();
        results.push(videoData);
      });

      setSearchResults(results);
    } catch (error) {
      console.log('Erro ao realizar a pesquisa:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesquisa</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua pesquisa"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Pesquisar</Text>
      </TouchableOpacity>
      <View style={styles.resultsContainer}>
        {searchResults.map((video, index) => (
          <Text key={index}>{video.titulo}</Text>
          // Renderize os detalhes do vídeo conforme necessário
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
    width: '80%',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
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
});

