import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import Login from './app/screems/Login';
import UserPage from './app/screems/UserPage';
import VideoUploadPage from './app/screems/VideoUpload';
import UploadScreen from './app/screems/UploadScreen';
import ImageUploadScreen from './app/screems/ImageUploadScreen';
import VideoUploadScreen from './app/screems/VideoUploadScreen';
import VideoListScreen from './app/screems/VideoListScreen';
import AudioUploadScreen from './app/screems/AudioUploadScreen';
import AudioListScreen from './app/screems/component/AudioListScreen';
import RadioListScreen from './app/screems/RadioListScreen'
import Login1 from './app/screems/Login1';
import Register from './app/screems/Register';
import Home from './app/screems/Home';
import VideoListScreenScroll from './app/screems/component/VideoListScreenScroll';
import RadioUploadScreen from './app/screems/RadioUploadScreen';
import RadioListScreen1 from './app/screems/RadioListScreen1';
import { Image, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import User from './app/screems/User';
import Artistas from './app/screems/Artistas';
import AudioDownloadScreen from './app/screems/AudioDownloadScreen';
import PesquisaScreen from './app/screems/PesquisaScreen';
import Search from './app/screems/Search';
import AudioPlayerScreen from './app/screems/AudioPlayerScreen';
import MusicPage from './app/screems/MusicPage';
import PlayerAudio from './app/screems/component/PlayerAudio';
import Profile1 from './app/screems/Profile1';

const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login1'>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: true }} />
        <Stack.Screen name="UserPage" component={UserPage} options={{ headerShown: true }} />
        <Stack.Screen name="User" component={User} options={{ headerShown: false }} />
        <Stack.Screen name="ImageUploadScreen" component={ImageUploadScreen} options={{ headerShown: true }} />
        <Stack.Screen name="VideoUpload" component={VideoUploadPage} options={{ headerShown: true }} />
        <Stack.Screen name="UploadScreen" component={UploadScreen} options={{ headerShown: true }} />
        <Stack.Screen name="VideoUploadScreen" component={VideoUploadScreen} options={{ headerShown: true }} />
        <Stack.Screen name="VideoListScreen" component={VideoListScreen}  options={{
            headerTitle: 'Videos',
            headerStyle: styles.headerStyle,
            headerTintColor: 'white',
            headerShown: true
          }} />
        <Stack.Screen name="AudioUploadScreen" component={AudioUploadScreen} options={{ headerShown: true }} />
        <Stack.Screen name="AudioListScreen" component={AudioListScreen} options={{ headerShown: true }} />
        <Stack.Screen name="RadioListScreen" component={RadioListScreen} options={{ headerShown: true }} />
        <Stack.Screen name="RadioListScreen1" component={RadioListScreen1} options={{ headerShown: true }} />
        <Stack.Screen name="RadioUploadScreen" component={RadioUploadScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Login1" component={Login1} options={{ headerShown: false }} />
        <Stack.Screen name="AudioDownloadScreen" component={AudioDownloadScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Artistas" component={Artistas} options={{ headerShown: true }} />
        <Stack.Screen name="MusicPage" component={MusicPage} options={{ headerShown: true }} />
        <Stack.Screen name="AudioPlayerScreen" component={AudioPlayerScreen} options={{ headerShown: true }} />
        <Stack.Screen name="PlayerAudio" component={PlayerAudio} options={{ headerShown: true }} />
        <Stack.Screen name="Profile1" component={Profile1} options={{ headerShown: false }} />
        <Stack.Screen name="PesquisaScreen" component={PesquisaScreen} options={{
            headerShown: false
          }} />

        <Stack.Screen name="Home" component={Home}
          options={{
            headerTitle: ' ',
            headerStyle: styles.headerStyle,
            headerLeft: null,
            headerTintColor: 'white',
            headerShown: false
          }} />
        <Stack.Screen name="VideoListScreenScroll" component={VideoListScreenScroll} options={{ headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: '#000',
    height: 100
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,  // Adicionado marginLeft para posicionar o logo no canto esquerdo
  },
  logo: {
    width: 40,
    height: 80,
    marginRight: 110,
    top: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo1: {
    width: 40,
    height: 40,
    marginLeft: 110,
  },
});

export default App;    