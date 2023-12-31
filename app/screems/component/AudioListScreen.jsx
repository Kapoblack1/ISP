import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { collection, getDocs, query, getFirestore } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function AudioListScreen({ childToParent }) {
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
      const audiosCollection = collection(getFirestore(), 'audio');
      const querySnapshot = await getDocs(audiosCollection);
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
    <View style={styles.container}>
      <FlatList
        data={audios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleClick(item)}>
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.imageDownloadURL }} style={styles.itemImage} />
              <Text style={styles.itemTitle}>{item.titulo}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(36,36,36)',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
});
