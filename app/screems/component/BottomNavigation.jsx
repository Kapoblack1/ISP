import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';

const BottomNavigation = ({personId}) => {
  const [activeTab, setActiveTab] = useState('');
  const navigation = useNavigation();
  const handleHomePress = () => {
    console.log('Home Pressed');
    setActiveTab('home');
  };

  const handleSearchPress = () => {
    console.log('Search Pressed');
    setActiveTab('search');
    navigation.navigate('PesquisaScreen', { personId: personId });
  };

  const handleVideoPress = () => {
    console.log('Video Pressed');
    setActiveTab('video');
    navigation.navigate('VideoListScreen');
  };

  const handleAudioPress = () => {
    console.log('Audio Pressed');
    setActiveTab('audio');
  };

  const handleRadioPress = () => {
    console.log('Radio Pressed');
    setActiveTab('radio');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab]}
        onPress={handleHomePress}
      >
        <Ionicons name="home" size={24} color={activeTab === 'home' ? 'rgb(248,159,29)' : 'rgb(248,159,29)'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab]}
        onPress={handleVideoPress}
      >
        <Ionicons name="videocam" size={24} color={activeTab === 'video' ? 'rgb(248,159,29)' : 'rgb(248,159,29)'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab]}
        onPress={handleSearchPress}
      >
        <Ionicons name="search" size={24} color={activeTab === 'search' ? 'rgb(248,159,29)' : 'rgb(248,159,29)'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab]}
        onPress={handleRadioPress}
      >
        <Ionicons name="radio" size={24} color={activeTab === 'radio' ? 'rgb(248,159,29)' : 'rgb(248,159,29)'} />
      </TouchableOpacity>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#000',
    backgroundColor: 'rgb(36,36,36)'
  },
  tab: {
    flex: 1,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
});

export default BottomNavigation;
