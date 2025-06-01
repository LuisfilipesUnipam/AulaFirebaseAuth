// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import auth from '../services/credenciaisFirebaseAuth';
import useFirebase from '../hooks/useFirebase';
import globalStyles from '../styles/globalStyles';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '',
    periodo: '',
    email: '',
    senha: ''
  });
  const { addUser } = useFirebase();

  const handleChange = (field, value) =>
    setForm({ ...form, [field]: value });

  const handleSubmit = async () => {
    try {
      // 1) cadastra no Firestore
      await addUser(form);
      // 2) cadastra no Auth
      await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.senha
      );
      Alert.alert('Sucesso', 'Usuário cadastrado!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Falha no cadastro');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/unipam_logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Cadastrar Usuário</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        placeholder="Digite o seu Nome"
        style={styles.input}
        value={form.nome}
        onChangeText={(v) => handleChange('nome', v)}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Período</Text>
      <TextInput
        placeholder="Digite o seu Período"
        style={styles.input}
        value={form.periodo}
        onChangeText={(v) => handleChange('periodo', v)}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Digite o seu Email"
        style={styles.input}
        value={form.email}
        onChangeText={(v) => handleChange('email', v)}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        placeholder="Digite a sua Senha"
        style={styles.input}
        secureTextEntry
        value={form.senha}
        onChangeText={(v) => handleChange('senha', v)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
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
    marginTop: 10,
  },
  buttonText: {
    color: '#143D59',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});
