import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const Login1 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const navigation = useNavigation();

  function handleRegister() {
    navigation.navigate('Register');
    console.log('Navigating to the registration page...');
  }

  useEffect(() => {
    const imageRef = ref(FIREBASE_STORAGE, '/imagens/logo.png');
    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.log('Error getting image URL from Firebase Storage:', error);
      });
  }, []);

  const handleLogin = async () => {
    try {
      const q = query(
        collection(FIREBASE_DB, 'pessoa'),
        where('email', '==', email),
        where('password', '==', password)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.size > 0) {
        const registeredPersonId = querySnapshot.docs[0].id;

        // Validar o domínio do email
        const validEmailDomain = email.endsWith('@isptec.co.ao');
        if (validEmailDomain) {
          navigation.navigate('Home', { personId: registeredPersonId });
        } else {
          alert('Invalid email domain');
        }
      } else {
        alert('The user does not exist');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <KeyboardAvoidingView  style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.logo} />
      ) : (
        <Text>Loading image...</Text>
      )}
      <View style={styles.card}>
        <Text style={styles.title}>ISPMIDIA</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={'white'}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={'white'}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.button1} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.registerText}>
           Não tem conta?{' '}
            <Text style={styles.registerLink} onPress={handleRegister}>
              Registar agora
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: "rgb(36,36,36)",
  },
  container1: {
    flex: 1,
  },
  logo: {
    width: 200,
    height: 130,
    marginBottom: 30,
  },
  card: {
    width: '80%',
    backgroundColor: 'rgb(0,0,0)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 50,
    shadowOffset: {
      width: 3,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
    marginTop: -30,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    color:"white"
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'rgb(248,159,29)',
    borderRadius: 8,
    paddingHorizontal: 10,
    color:"white"
  },
  button: {
    width: '100%',
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgb(0,0,0)',
    borderRadius: 0,
  },
  button1: {
    width: '100%',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgb(36,36,36)',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  registerText: {
    marginTop: -5,
    color:"white"
  },
  registerLink: {
    fontWeight: 'bold',
    color: 'rgb(248,159,29)',
  },
});
//rgb(36,36,36)
//rgb(18,18,18)
//rgb(0,0,0)

export default Login1;