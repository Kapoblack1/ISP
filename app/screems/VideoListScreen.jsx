import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { getFirestore, collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { Video } from 'expo-av';

const VideoListScreen = () => {
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
      <View style={{ marginBottom: 16 }}>
        {selectedVideo === item.videoURL ? (
          <Video
            source={{ uri: item.videoURL }}
            style={{ width: 300, height: 300 }}
            resizeMode="contain"
            useNativeControls
          />
        ) : (
          <TouchableOpacity onPress={handlePress}>
            <Image source={{ uri: item.thumbnailURL }} style={{ width: 200, height: 200 }} />
          </TouchableOpacity>
        )}
        <Text>Description: {item.description}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VideoItem item={item} />}
      />
    </View>
  );
};

export default VideoListScreen;
