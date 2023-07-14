import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc, where } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';

export default function VideoListScreen({ person }) {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    subscribeToVideos();
  }, []);

  const subscribeToVideos = () => {
    const videosCollection = collection(FIREBASE_DB, 'videos');

    const videosQuery = query(videosCollection, where('autor', '==', person.username), orderBy('createdAt', 'desc'));

    onSnapshot(videosQuery, (snapshot) => {
      const videosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videosData);
    });
  };

  const handleThumbnailPress = (video) => {
    setSelectedVideo(video);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      </View>
      <ScrollView style={styles.container}>
        {videos.map((video) => (
          <View key={video.id} style={styles.videoContainer}>
            <TouchableOpacity onPress={() => handleThumbnailPress(video)}>
              <View style={styles.thumbnailContainer}>
                {selectedVideo && selectedVideo.id === video.id ? null : (
                  <Image source={{ uri: video.thumbnailURL }} style={styles.thumbnail} />
                )}
                {selectedVideo && selectedVideo.id === video.id ? null : (
                  <Ionicons name="play" size={50} color="white" style={styles.playIcon} />
                )}
              </View>
              <Text style={styles.videoTitle}>{video.titulo}</Text>
            </TouchableOpacity>
            {selectedVideo && selectedVideo.id === video.id && (
              <>
                <Video
                  source={{ uri: video.videoURL }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                />
              </>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(36,36,36)',
    padding: 10,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    marginTop: '15%',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
    paddingTop: 15,
    paddingLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  videoContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgb(248,159,29)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
  },
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  video: {
    width: '100%',
    height: 200,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
  },
});
