import React, { useEffect, useState } from 'react';
import { ScrollView, Image, Text, TouchableOpacity, View , StyleSheet} from 'react-native';
import { collection, getDocs, query, getFirestore } from 'firebase/firestore';
import { Audio } from 'expo-av';

const AudioListScreenScroll = () => {
  const [audios, setAudios] = useState([]);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsplaying] = useState(false);
  const [musicInfo, setMusicInfo] = useState(null);

  useEffect(() => {
    fetchAudios();
  }, []);

  const fetchAudios = async () => {
    try {
      const audiosCollection = collection(getFirestore(), 'audios');
      const querySnapshot = await getDocs(audiosCollection);
      const audiosData = querySnapshot.docs.map((doc) => doc.data());
      setAudios(audiosData);
    } catch (error) {
      console.error('Erro ao buscar os áudios:', error);
    }
  };

  const handlePlayAudio = async (audioURL) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        return;
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioURL });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Erro ao reproduzir o áudio:', error);
    }
  };

  const handleThumbnailClick = (music) => {
    setMusicInfo({
      name: music.name,
      thumbnailURL: music.thumbnailURL,
      audioURL: music.audioURL,
    });
    setIsplaying(true);
  };

  const AudioItem = ({ item }) => {
    const handlePress = () => {
      handlePlayAudio(item.audioURL);
    };

    const handleThumbnailPress = () => {
      if (sound && sound.isPlaying) {
        sound.pauseAsync();
      }
    };

    return (
      <View style={{ marginRight: 16 }}>
        <TouchableOpacity onPress={handlePress}>
          <Image source={{ uri: item.thumbnailURL }} style={{ width: 200, height: 200 }} />
        </TouchableOpacity>
        <Text>Name: {item.name}</Text>
      </View>
    );
  };

  return (
    <View >
      <ScrollView horizontal style={styles.container}>
        {audios.map((item) => (
          <AudioItem key={item.audioURL} item={item} />
        ))}
      </ScrollView>
      {musicInfo && (
        <View style={{ marginBottom: 6 }}>
          <TouchableOpacity onPress={() => setIsplaying(!isPlaying)}>
            <Image source={{ uri: musicInfo.thumbnailURL }} style={{ width: 200, height: 200 }} />
          </TouchableOpacity>
          <Text>Name: {musicInfo.name}</Text>
          <Text>Is Playing: {isPlaying ? 'Yes' : 'No'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
 
})
export default AudioListScreenScroll;
