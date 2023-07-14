import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, Image, FlatList, StyleSheet, Button, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { Video } from 'expo-av';
import { v4 as uuidv4 } from 'uuid';

const VideoUploadScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUri, setVideoUri] = useState('');
  const [thumbnailUri, setThumbnailUri] = useState('');
  const [thumbnailURL, setThumbnailURL] = useState('');
  const [videos, setVideos] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    getPermission();
    subscribeToVideos();
  }, []);

  const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Sorry, we need media library permissions to make this work!'
      );
    }
  };

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setVideoUri(result.uri);
      }
    } catch (error) {
      console.log('Error picking video:', error);
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleThumbnailSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        setThumbnailUri(result.uri);
      }
    } catch (error) {
      console.log('Error selecting thumbnail:', error);
    }
  };

  const handleUploadPress = async () => {
    if (title && description && videoUri && thumbnailUri) {
      try {
        const thumbnailResponse = await fetch(thumbnailUri);
        const thumbnailBlob = await thumbnailResponse.blob();

        const videoResponse = await fetch(videoUri);
        const videoBlob = await videoResponse.blob();

        // Generate unique filenames for the thumbnail and video
        const thumbnailExtension = thumbnailUri.split('.').pop();
        const thumbnailFilename = `${uuidv4()}.${thumbnailExtension}`;

        const videoExtension = videoUri.split('.').pop();
        const videoFilename = `${uuidv4()}.${videoExtension}`;

        // Upload the thumbnail to "thumbnails" folder in Firebase Storage
        const thumbnailStorageRef = ref(FIREBASE_STORAGE, `thumbnails/${thumbnailFilename}`);
        await uploadBytes(thumbnailStorageRef, thumbnailBlob);

        // Get the download URL of the thumbnail
        const thumbnailURL = await getDownloadURL(thumbnailStorageRef);

        // Upload the video to "videos" folder in Firebase Storage
        const videoStorageRef = ref(FIREBASE_STORAGE, `videos/${videoFilename}`);
        const videoSnapshot = await uploadBytes(videoStorageRef, videoBlob);

        // Get the download URL of the video
        const videoURL = await getDownloadURL(videoSnapshot.ref);

        // Save the paths, URLs, title, and description to Firestore
        const videoData = {
          titulo: title,
          description,
          thumbnailPath: thumbnailStorageRef.fullPath,
          thumbnailURL,
          videoPath: videoStorageRef.fullPath,
          videoURL,
          createdAt: new Date(),
        };

        const videosCollection = collection(FIREBASE_DB, 'videos');
        await addDoc(videosCollection, videoData);

        console.log('Video successfully uploaded to the database!');
        setTitle('');
        setDescription('');
        setVideoUri('');
        setThumbnailUri('');
        setThumbnailURL('');
      } catch (error) {
        console.log('Error uploading video to the database:', error);
      }
    } else {
      console.log('Please fill in all fields before uploading the video.');
    }
  };

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
      <ScrollView>
      <View style={{ marginBottom: 16 }}>
        {selectedVideo === item.videoURL ? (
          <Video
            source={{ uri: item.videoURL }}
            style={{ width: 150, height: 200 }}
            resizeMode="contain"
            useNativeControls
          />
        ) : (
          <TouchableOpacity onPress={handlePress}>
            <Image source={{ uri: item.thumbnailURL }} style={{ width: 200, height: 200 }} />
          </TouchableOpacity>
        )}
      </View>
      </ScrollView>
    );
  };

  return (
    <ScrollView>
    <View style={{ flex: 1, alignContent: "center", alignItems: "center" }}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Selecione o título"
        style={styles.input}
        placeholderTextColor={"white"}
      />
      <TouchableOpacity onPress={pickVideo} style={styles.button1}>
        <Text style={{ color: 'white' }}>Selecione Video</Text>
      </TouchableOpacity>
      {videoUri && (
        <View style={{ width: 100, height: 100 }}>
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={{ flex: 1 }}
            resizeMode="contain"
          />
        </View>
      )}
      <TouchableOpacity onPress={handleTogglePlay} style={styles.button1}>
        <Text style={{ color: 'white' }}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleThumbnailSelection} style={styles.button1}>
        <Text style={{ color: 'white' }}>Selecione a thumbnail</Text>
      </TouchableOpacity>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Selecione a descrição"
        style={styles.input}
        placeholderTextColor={"white"}
      />
      <TouchableOpacity onPress={handleUploadPress} style={styles.button1}>
        <Text style={{ color: 'white' }}>Upload Video</Text>
      </TouchableOpacity>
    </View>
   </ScrollView>
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
  }
});

export default VideoUploadScreen;
