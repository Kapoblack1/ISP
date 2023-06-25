import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import AudioListScreenScroll from './component/AudioListScreen';
import BottomNavigation from './component/BottomNavigation';
import RadioListScreen from './RadioListScreen';
import RadioListScreen1 from './RadioListScreen1';

const Home = ({ route }) => {
  const { personId } = route.params;
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    subscribeToVideos();
  }, []);

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
      <ScrollView style={styles.scrolls}>
        <Text style={styles.title}>Videos</Text>
      <ScrollView horizontal>
        {videos.map((item) => (
          <VideoItem key={item.id} item={item} />
        ))}
      </ScrollView>
      <Text style={styles.title}>Áudio</Text>
      <ScrollView horizontal>
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
  },
  bottomNavigationContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  title:{
    fontSize: 20,
    padding: 10
  },
  scrolls:{
    paddingLeft: 10,
  }
  
});

export default Home;
