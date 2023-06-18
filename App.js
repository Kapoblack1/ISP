import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/screems/Login';
import UserPage from './app/screems/UserPage';
import VideoUploadPage from './app/screems/VideoUpload';
import UploadScreen from './app/screems/UploadScreen';
import ImageUploadScreen from './app/screems/ImageUploadScreen';
import VideoUploadScreen from './app/screems/VideoUploadScreen';
import VideoListScreen from './app/screems/VideoListScreen';

// Importe os componentes de tela que você deseja navegar



const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='VideoUploadScreen'>
        <Stack.Screen name="Login" component={Login} options={{headerShown:true}}/>
        <Stack.Screen name="UserPage" component={UserPage} options={{headerShown:true}}/>
        <Stack.Screen name="ImageUploadScreen" component={ImageUploadScreen} options={{headerShown:true}}/>
        <Stack.Screen name="VideoUpload" component={VideoUploadPage} options={{headerShown:true}}/>
        <Stack.Screen name="UploadScreen" component={UploadScreen} options={{headerShown:true}}/>
        <Stack.Screen name="VideoUploadScreen" component={VideoUploadScreen} options={{headerShown:true}}/>
        <Stack.Screen name="VideoListScreen" component={VideoListScreen} options={{headerShown:true}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;