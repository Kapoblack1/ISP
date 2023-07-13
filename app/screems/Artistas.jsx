import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { getFirestore, collection, onSnapshot, query, getDocs, orderBy, doc, getDoc, where } from 'firebase/firestore';

export default function Artistas() {

  const [artists, setArtists] = useState([]);


  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const artistsCollection = collection(getFirestore(), 'pessoa');
      const querySnapshot = await getDocs(
        query(artistsCollection, where('upload', '==', 'true'))
      );
      const artistsData = querySnapshot.docs.map((doc) => doc.data());
      setArtists(artistsData);
    } catch (error) {
      console.error('Erro ao buscar os artistas:', error);
    }
  };
  


  return (
    <View style={{ flex: 1 }}>


      <FlatList
        data={artists}
        keyExtractor={(item) => item.email}
        renderItem={({ item }) => (
          <View style={styles.horizontalItem}>
            <Image
              source={{ uri: item.foto }}
              style={{ width: 100, height: 100, borderRadius: 8, margin: 10 }}
              resizeMode="cover"
              horizontal
              useNativeControls
            />
            <Text style={styles.horizontalTitle}>{item.username}</Text>

          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={true}
        indicatorStyle='white'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    marginTop: 70,
  },
  iconSearch: {
    marginRight: 5,
    marginTop: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    marginRight: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'grey',
    opacity: 0.5,
  },
  scrollContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5,
    marginTop: 30,
  },
  horizontalItem: {
    marginLeft: 10,
  },
  rectangularCover: {
    marginTop: 10,
    width: 150,
    height: 150,
    borderRadius: 0,
  },
  circularCover: {
    marginTop: 10,
    width: 100,
    height: 100,
    borderRadius: 75,
  },
  horizontalTitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',

  },
  horizontalArtist: {
    fontSize: 14,
    color: 'white',
  },
});