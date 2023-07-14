import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Button, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc, updateDoc, addDoc, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FirebaseConfig';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import { Ionicons } from '@expo/vector-icons';
import AudioUploadScreen from './AudioUploadScreen';
import VideoUploadScreen from './VideoUploadScreen';
import { ScrollView } from 'react-native-gesture-handler';

export default function Profile({ route }) {
  const navigation = useNavigation();
  const { personId } = route.params;
  const [personName, setPersonName] = useState('');
  const [button1Active, setButton1Active] = useState(false);
  const [button2Active, setButton2Active] = useState(false);
  const [button3Active, setButton3Active] = useState(false)
  const [personSurname, setPersonSurname] = useState('');
  const [person, setPerson] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'pessoa', personId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const personData = docSnapshot.data();
          setPerson(personData);
          setPersonName(personData.username);
          setProfileImageUrl(personData.foto || null);
        }
      } catch (error) {
        console.log('Error fetching person data:', error);
      }
    };

    fetchPersonData();
  }, [personId]);

  const handleChangeProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        const response = await fetch(selectedAsset.uri);
        const blob = await response.blob();

        // Generate a unique filename using a timestamp
        const filename = `${Date.now()}.jpg`;

        const storageRef = ref(FIREBASE_STORAGE, `profilePictures/${filename}`);
        const uploadTask = uploadBytes(storageRef, blob);

        await uploadTask;

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(storageRef);

        // Delete the previous profile picture from the storage
        if (profileImageUrl) {
          const previousImageRef = ref(FIREBASE_STORAGE, getFilenameFromURL(profileImageUrl));
          try {
            await deleteObject(previousImageRef);
          } catch (error) {
            console.log('Error deleting previous profile picture:', error);
          }
        }

        // Update the profileImageUrl state with the new image URL
        setProfileImageUrl(downloadURL);

        // Update the profile image URL in the database
        const docRef = doc(FIREBASE_DB, 'pessoa', personId);
        await updateDoc(docRef, {
          foto: downloadURL,
        });

        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.log('Error changing profile picture:', error);
      Alert.alert('Error', 'Failed to change profile picture');
    }
  };

  const getFilenameFromURL = (url) => {
    const startIndex = url.lastIndexOf('/') + 1;
    return url.substring(startIndex);
  };

  function logout() {
    navigation.navigate('Login1');
  }

  function Home() {
    navigation.navigate('Home', { personId: personId });
  }

  const handleButton1Click = () => {
    setButton1Active(true);
    setButton2Active(false);
    setButton3Active(false);
  };

  const handleButton2Click = () => {
    setButton1Active(false);
    setButton2Active(true);
    setButton3Active(false);
  };

  const handleButton3Click = () => {
    setButton1Active(false);
    setButton2Active(false);
    setButton3Active(true);
  };

  const Componente1 = () => {
    return (
      <View>
        <Text>Componente 1 Ativo</Text>
      </View>
    );
  };

  const Componente2 = () => {
    const [audios, setAudios] = useState([]);

    useEffect(() => {
      const fetchAudios = async () => {
        try {
          const audiosCollectionRef = collection(FIREBASE_DB, 'audio');
          const q = query(audiosCollectionRef, where('autor', '==', person.username), orderBy('timestamp', 'desc'));

          const unsubscribe = onSnapshot(q, (snapshot) => {
            const updatedAudios = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setAudios(updatedAudios);
          });

          return () => unsubscribe();
        } catch (error) {
          console.log('Error fetching audios:', error);
        }
      };

      fetchAudios();
    }, [person.username]);

    return (
      <View>
        {audios.map((audio) => (
          <Text key={audio.id}>{audio.name}</Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={Home}>
          <Ionicons style={styles.iconBack} name="chevron-back-outline" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={handleChangeProfilePicture}>
          <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.label}>{personName}</Text>
      </View>
      <View style={styles.buttons}>
        
        <TouchableOpacity
          style={[styles.button, button1Active && styles.activeButton]}
          onPress={handleButton1Click}
        >
          <Text style={styles.buttonText}>Upload áudio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, button3Active && styles.activeButton]}
          onPress={handleButton3Click}
        >
          <Text style={styles.buttonText}>Upload Video</Text>
        </TouchableOpacity>

      </View>
      <View>
        <ScrollView>
        {button3Active && <VideoUploadScreen person={person} />}
        {button1Active && <AudioUploadScreen person={person} personId={personId} />}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgb(36,36,36)',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: '15%',
  },
  options: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  info: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'grey',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 35,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: 'pink',
  },
  thumbnailButton: {
    backgroundColor: 'pink',
    width: 200,
    height: 35,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
  thumbnailButtonText: {
    color: 'white',
  },
  itemButton: {
    backgroundColor: 'pink',
    width: 200,
    height: 35,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
  },
  itemButtonText: {
    color: 'white',
  },
  uploadButton: {
    backgroundColor: 'pink',
    width: '80%',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    padding: 10,
  },
  activeButton: {
    backgroundColor: '#FE496C',
  },
  fundo: {
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderImage: {
    backgroundColor: 'pink',
    width: 120,
    height: 120,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgb(18,18,18)',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: 'rgb(248,159,29)',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});
