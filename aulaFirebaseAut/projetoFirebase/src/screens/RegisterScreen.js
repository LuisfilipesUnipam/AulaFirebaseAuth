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
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import auth from '../services/credenciaisFirebaseAuth';
import globalStyles from '../styles/globalStyles';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nome: '',
    periodo: '',
    curso: '',
    email: '',
    senha: '',
    tipo: 'aluno' // Definindo tipo como aluno por padrão
  });

  const handleChange = (field, value) =>
    setForm({ ...form, [field]: value });

  const handleSubmit = async () => {
    try {
      if (!form.nome || !form.email || !form.senha || !form.curso || !form.periodo) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      // 1) Primeiro cadastra no Auth para obter o UID
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.senha
      );
      
      // 2) Obtém o UID gerado
      const uid = userCredential.user.uid;
      
      // 3) Cadastra no Firestore usando o UID como ID do documento
      const db = getFirestore();
      await setDoc(doc(db, 'pessoa', uid), {
        nome: form.nome,
        periodo: form.periodo,
        curso: form.curso,
        email: form.email,
        tipo: 'aluno', // Forçando o tipo como aluno
        status: 'ativo',
        dataCriacao: new Date().toISOString(),
        projetos: [] // Array para armazenar os projetos do aluno
      });
      
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Este email já está em uso.');
      } else {
        Alert.alert('Erro', 'Falha no cadastro: ' + error.message);
      }
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/unipam_logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Cadastrar Aluno</Text>

      <Text style={styles.label}>Nome *</Text>
      <TextInput
        placeholder="Digite o seu Nome"
        style={styles.input}
        value={form.nome}
        onChangeText={(v) => handleChange('nome', v)}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Curso *</Text>
      <TextInput
        placeholder="Digite o seu Curso"
        style={styles.input}
        value={form.curso}
        onChangeText={(v) => handleChange('curso', v)}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Período *</Text>
      <TextInput
        placeholder="Digite o seu Período"
        style={styles.input}
        value={form.periodo}
        onChangeText={(v) => handleChange('periodo', v)}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Email *</Text>
      <TextInput
        placeholder="Digite o seu Email"
        style={styles.input}
        value={form.email}
        onChangeText={(v) => handleChange('email', v)}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha *</Text>
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