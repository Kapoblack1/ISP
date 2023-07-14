import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { collection, getDocs, query, getFirestore, where } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function AudioListScreen1({ childToParent }) {
  const [audios, setAudios] = useState([]);

  const navigation = useNavigation();

  const handleClick = (item) => {
    childToParent(item);
  }

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    try {
      const firestore = getFirestore();
      const audiosCollection = collection(firestore, 'audio');
      const querySnapshot = await getDocs(query(audiosCollection, where('tipo', '==', 'Áudio')));
      const audiosData = querySnapshot.docs.map((doc) => doc.data());
      setAudios(audiosData);
    } catch (error) {
      console.error('Erro ao buscar os áudios:', error);
    }
  };

  function goToMusicPage(item) {
    navigation.navigate('MusicPage', { item });
  }

  return (
    <View>
      <FlatList
        data={audios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity onPress={() => handleClick(item)}>
              <Image source={{ uri: item.imageDownloadURL }} style={styles.item} />
              <Text style={styles.titulo}>{item.titulo}</Text>
            </TouchableOpacity>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: 150,
    height: 150,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  horizontalArtist: {
    fontSize: 14,
    color: 'pink',
    marginLeft: 10,
  },
  titulo: {
    color: 'white'
  },
});
