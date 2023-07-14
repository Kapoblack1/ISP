import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailRegex = /^(19|20)\d{6}@isptec.co.ao$/;
    return emailRegex.test(email);

  };

  function handleLogin() {
    navigation.navigate("Login1");
  }
  const handleRegister = async () => {

    if (validateEmail(email)) {

      try {
        // Verifica se já existe um usuário com o mesmo nome de usuário e senha na base de dados
        const querySnapshot = await getDocs(
          query(
            collection(FIREBASE_DB, 'pessoa'),
            where('email', '==', email),
            where('password', '==', password)
          )
        );

        if (!querySnapshot.empty) {
          console.log('Usuário já existe na base de dados');
          alert('Esta conta já existe.')
          return;
        }

        const defaultImageRef = ref(FIREBASE_STORAGE, '/imagens/person.png');
        const defaultImageUrl = await getDownloadURL(defaultImageRef);

        // Cria um novo documento na coleção 'pessoa' com os dados fornecidos
        const docRef = await addDoc(collection(FIREBASE_DB, 'pessoa'), {
          username,
          password,
          email,
          imageUrl: defaultImageUrl,
          uploaded: 'true',
        });
        console.log('Nova pessoa criada com ID:', docRef.id);
        navigation.navigate('Login1');
      } catch (error) {
        console.log('Erro ao criar uma nova pessoa:', error);
      }
    } else {
      alert('Formato de e-mail inválido. Por favor introduza um e-mail do formato ISPTEC.');

    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.logo} />
      ) : (
        <Text>Loading image...</Text>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>Registar</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={'white'}
            value={email}
            onChangeText={(text) => setEmail(text)}
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
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome do Usuario"
            placeholderTextColor={'white'}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "50%",
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: 'rgb(36,36,36)',
  },
  container1: {
    flex: 1,
  },
  containerLogo: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: 'rgb(36,36,36)',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: "white"
  },
  logo: {
    width: 200,
    height: 130,
  },
  card: {
    width: '90%',
    backgroundColor: 'rgb(0,0,0)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 50,
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: -30,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',

  },
  input: {

    height: 40,
    borderWidth: 1,
    borderColor: 'rgb(248,159,29)',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "white",


  },
  button: {
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
    fontWeight: 'bold',
  },
});

//rgb(36,36,36)
//rgb(18,18,18)
//rgb(0,0,0)

export default Register;