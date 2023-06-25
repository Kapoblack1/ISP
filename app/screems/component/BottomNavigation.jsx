import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleHomePress = () => {
    console.log('Home Pressed');
    setActiveTab('home');
  };

  const handleVideoPress = () => {
    console.log('Video Pressed');
    setActiveTab('video');
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
        <Ionicons name="home" size={24} color={activeTab === 'home' ? 'red' : '#888888'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab]}
        onPress={handleVideoPress}
      >
        <Ionicons name="videocam" size={24} color={activeTab === 'video' ? 'red' : '#888888'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab]}
        onPress={handleAudioPress}
      >
        <Ionicons
          name="musical-notes"
          size={24}
          color={activeTab === 'audio' ? 'red' : '#888888'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab]}
        onPress={handleRadioPress}
      >
        <Ionicons name="radio" size={24} color={activeTab === 'radio' ? 'red' : '#888888'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    backgroundColor: 'linear-gradient(263.1% 11.89% at 18.02% 9.11%, #FFFFFF 0.19%, rgba(255, 231, 110, 2.90) 100%)'
  },
  tab: {
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
});

export default BottomNavigation;
