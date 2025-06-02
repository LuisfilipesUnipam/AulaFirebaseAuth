// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import auth from '../services/credenciaisFirebaseAuth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import globalStyles from '../styles/globalStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      Alert.alert('Sucesso', 'Logado com sucesso!');
      navigation.navigate('Initial');
    } catch (error) {
      Alert.alert('Erro', 'Falha no login');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/unipam_logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Usuário</Text>
      <TextInput
        placeholder="Digite aqui o seu Usuário"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Digite aqui a sua Senha"
          style={styles.passwordInput}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

      </View>


      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>→ ENTRAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9EEF4',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#143D59',
    marginBottom: 30,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontSize: 12,
    color: '#555',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  passwordContainer: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 20,
  },
  passwordInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  hidePasswordText: {
    color: '#143D59',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 5,
    marginRight: 10,
  },
  forgotPasswordText: {
    color: '#143D59',
    fontSize: 12,
    marginBottom: 20,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonText: {
    color: '#143D59',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
