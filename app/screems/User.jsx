import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { FIREBASE_DB, FIREBASE_STORAGE } from '../../FirebaseConfig';
import ImageUploadScreen from './ImageUploadScreen';
import * as ImagePicker from 'expo-image-picker';

const User = ({ route }) => {
  const { personId } = route.params;
  const [personName, setPersonName] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const getPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão negada',
        'Desculpe, precisamos da permissão da biblioteca de mídia para funcionar!'
      );
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.uri);
      }
    } catch (error) {
      console.log('Erro ao selecionar a imagem:', error);
    }
  };

  useEffect(() => {
    const fetchInformation = async () => {
      try {
        const docRef = doc(FIREBASE_DB, 'pessoa', personId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setPersonName(data.username);
          setProfileImageUrl(data.foto || null);
        }
      } catch (error) {
        console.log('Erro ao buscar o nome da pessoa:', error);
      }
    };

    getPermission();
    fetchInformation();
  }, [personId]);

  const uploadImage = async () => {
    if (!image) {
      Alert.alert('Erro', 'Nenhuma imagem selecionada');
      return;
    }

    setUploading(true);

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      alert('Respose',response)
      // Gerar um nome de arquivo único usando um timestamp
      const filename = `${Date.now()}.jpg`;
      alert('filename',filename)
      const storageRef = ref(FIREBASE_STORAGE, `fotoPerfil/${filename}`);
      const uploadTask = uploadBytes(storageRef, blob);
      
      await uploadTask;
      alert('uploadTask',uploadTask)
      try {
        const docRef = doc(FIREBASE_DB, 'pessoa', personId);
        await updateDoc(docRef, {
          foto: photoUrl,
        });
      } catch (error) {
        console.log('Erro ao atualizar a foto da pessoa:', error);
      }
      alert('photoUrl',photoUrl)
      
      const photoUrl = await storageRef.getDownloadURL();
      updatePersonPhoto(photoUrl);
      alert(ola)
      Alert.alert('Sucesso', 'Imagem enviada com sucesso!');
      setImage(null);
    } catch (error) {
      console.log('Erro ao enviar a imagem:', error);
      Alert.alert('Erro', 'Falha ao enviar a imagem');
    }

    setUploading(false);
  };

  const updatePersonPhoto = async (photoUrl) => {
    try {
      const docRef = doc(FIREBASE_DB, 'pessoa', personId);
      await updateDoc(docRef, {
        foto: photoUrl,
      });
    } catch (error) {
      console.log('Erro ao atualizar a foto da pessoa:', error);
    }
  };

  return (
    <View>
      <Text>{personName}</Text>
      <TouchableOpacity onPress={pickImage}>
        <Image source={require('./teste.jpg')} style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <TouchableOpacity onPress={uploadImage} disabled={uploading}>
        <Text>{uploading ? 'Enviando...' : 'Enviar Imagem'}</Text>
      </TouchableOpacity>
      {showImageUpload && <ImageUploadScreen />}
    </View>
  );
};

export default User;
