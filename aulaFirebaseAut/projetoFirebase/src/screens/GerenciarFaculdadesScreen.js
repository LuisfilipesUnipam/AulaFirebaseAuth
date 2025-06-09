import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import globalStyles from '../styles/globalStyles';

const GerenciarFaculdadesScreen = () => {
  const [faculdades, setFaculdades] = useState([]);
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFaculdades();
  }, []);

  const carregarFaculdades = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'faculdades'));
      const faculdadesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFaculdades(faculdadesList);
    } catch (error) {
      console.error('Erro ao carregar faculdades:', error);
      Alert.alert('Erro', 'Não foi possível carregar as faculdades.');
    } finally {
      setLoading(false);
    }
  };

  const adicionarFaculdade = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Por favor, insira o nome da faculdade.');
      return;
    }

    try {
      await addDoc(collection(db, 'faculdades'), {
        nome: nome.trim(),
        createdAt: new Date().toISOString()
      });

      setNome('');
      carregarFaculdades();
      Alert.alert('Sucesso', 'Faculdade adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar faculdade:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a faculdade.');
    }
  };

  const removerFaculdade = async (id) => {
    try {
      await deleteDoc(doc(db, 'faculdades', id));
      carregarFaculdades();
      Alert.alert('Sucesso', 'Faculdade removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover faculdade:', error);
      Alert.alert('Erro', 'Não foi possível remover a faculdade.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={globalStyles.listItem}>
      <Text style={globalStyles.listItemText}>{item.nome}</Text>
      <TouchableOpacity
        style={[globalStyles.button, { backgroundColor: '#dc3545' }]}
        onPress={() => removerFaculdade(item.id)}
      >
        <Text style={globalStyles.buttonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Gerenciar Faculdades</Text>

      <View style={globalStyles.form}>
        <TextInput
          style={globalStyles.input}
          placeholder="Nome da Faculdade"
          value={nome}
          onChangeText={setNome}
        />
        <TouchableOpacity
          style={globalStyles.button}
          onPress={adicionarFaculdade}
        >
          <Text style={globalStyles.buttonText}>Adicionar Faculdade</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={faculdades}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={globalStyles.list}
        ListEmptyComponent={
          <Text style={globalStyles.emptyText}>
            {loading ? 'Carregando...' : 'Nenhuma faculdade cadastrada.'}
          </Text>
        }
      />
    </View>
  );
};

export default GerenciarFaculdadesScreen; 