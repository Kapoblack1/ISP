import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async ()=>{
    setLoading(true);
    try{
      const reponse = await signInWithEmailAndPassword(auth, email, password);
      console.log(reponse);
      alert('Check your email')
    } catch (error:any){
      console.log(error);
      alert('Sign in failed: '+error.message)
    } finally {
      setLoading(false);
    }
  }

  const signUp = async ()=>{
    setLoading(true);
    try{
      const reponse = await createUserWithEmailAndPassword(auth, email, password);
      console.log(reponse);
      alert('Check your email')
    } catch (error:any){
      console.log(error);
      alert('Sign in failed: '+error.message)
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput value={email} style={styles.input} placeholder='Email' autoCapitalize='none' onChangeText={(text)=>{setEmail(text)}}/>
      <TextInput value={password} style={styles.input} placeholder='password'secureTextEntry={true} autoCapitalize='none' onChangeText={(text)=>{setpassword(text)}}/>

     
        <Button title='Login' onPress={signIn}/>
        <Button title='Create account' onPress={signUp}/>


  </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input:{

  },
});
