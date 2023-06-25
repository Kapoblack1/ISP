import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import AudioListScreenScroll from './component/AudioListScreen';
import BottomNavigation from './component/BottomNavigation';
import RadioListScreen from './RadioListScreen';
import RadioListScreen1 from './RadioListScreen1';
import { useNavigation } from '@react-navigation/native';

const Home = ({ route }) => {
  const { personId } = route.params;
  const [videos, setVideos] = useState([]);
  const [personName, setPersonName] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrl1, setImageUrl1] = useState('');
  const navigation = useNavigation();
  const registeredPersonId = personId;

  useEffect(() => {
    const imageRef = ref(FIREBASE_STORAGE, '/imagens/logo.png');
    const imageRef1 = ref(FIREBASE_STORAGE, '/imagens/person.png');
    subscribeToVideos();
    const fetchInformation = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'pessoa', personId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setPersonName(data.username);

        }
      } catch (error) {
        console.log('Error fetching person name:', error);
      }
    };
    fetchInformation();
    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.log('Error getting image URL from Firebase Storage:', error);
      });

    getDownloadURL(imageRef1)
      .then((url) => {
        setImageUrl1(url);
      })
      .catch((error) => {
        console.log('Error getting image URL from Firebase Storage:', error);
      });

  }, [personId]);


  const subscribeToVideos = async () => {
    try {
      const videosCollection = collection(FIREBASE_DB, 'videos');
      const videosQuery = query(videosCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(videosQuery);
      const videosData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videosData);
    } catch (error) {
      console.log('Error fetching videos:', error);
    }
  };

  const handleThumbnailPress = (videoURL) => {
    setSelectedVideo(videoURL);
  };

  const VideoItem = ({ item }) => {
    const handlePress = () => {
      handleThumbnailPress(item.videoURL);
    };

    return (
      <View style={{ marginRight: 14 }}>
        {selectedVideo === item.videoURL ? (
          <Video
            source={{ uri: item.videoURL }}
            style={{ width: 270, height: 200 }}
            resizeMode="contain"
            useNativeControls
          />
        ) : (
          <TouchableOpacity onPress={handlePress}>
            <Image source={{ uri: item.thumbnailURL }} style={{ width: 270, height: 200 }} />
          </TouchableOpacity>
        )}
        <Text> {item.description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: imageUrl }} style={styles.logo} />
        <Text style={styles.home}>Home</Text>
        <TouchableOpacity onPress={() => { navigation.navigate('User', { personId: registeredPersonId }) }}>
          <View style={styles.Person}>
            <Image source={{ uri: imageUrl1 }} style={styles.logo1} />
            <Text>{personName}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView style={[styles.scrolls, styles.space]}>
        <Text style={styles.title}>Videos</Text>
        <ScrollView horizontal style={[styles.scrolls, styles.space]}>
          {videos.map((item) => (
            <VideoItem key={item.id} item={item} />
          ))}
        </ScrollView>
        <Text style={styles.title}>Áudio</Text>
        <ScrollView horizontal style={styles.space}>
          <AudioListScreenScroll />
        </ScrollView>
        <Text style={styles.title}>Rádio</Text>
        <RadioListScreen1></RadioListScreen1>
        <View style={styles.bottomNavigationContainer}>

        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(23.1% 11.89% at 18.02% 8.11%, #FFFFFF 0.19%, rgba(255, 237, 86, 0.70) 100%)',
  },
  header: {
    flexDirection: 'row',
    height: 85,
    justifyContent: 'space-around',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(23.1% 11.89% at 18.02% 8.11%, #FFFFFF 0.19%, rgba(255, 237, 86, 0.70) 100%)',

  },
  bottomNavigationContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor:'#FFF7D1'
  },
  title: {
    fontSize: 24,
    padding: 10,
    fontWeight: 700,
  },
  scrolls: {
    paddingLeft: 10,
  },
  space: {
    paddingBottom: 20,
  },
  logo: {
    width: 40,
    height: 80,
    top: 15

  },
  home:{
    top: 13,
    right:-15
  },
  
  logo1: {
    width: 30,
    height: 30,
  },
  Person:{
    alignItems: 'center'

  }

});

export default Home;
