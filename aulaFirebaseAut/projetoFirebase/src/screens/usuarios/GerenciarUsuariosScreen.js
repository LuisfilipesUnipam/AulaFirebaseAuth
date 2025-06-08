import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFirebase from '../../hooks/useFirebase';

const GerenciarUsuariosScreen = ({ navigation }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { fetchUsers, loading } = useFirebase();

  const loadUsuarios = async () => {
    try {
      setRefreshing(true);
      const data = await fetchUsers();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
    
    // Atualizar a lista quando voltar para esta tela
    const unsubscribe = navigation.addListener('focus', () => {
      loadUsuarios();
    });

    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('DetalhesUsuario', { userId: item.id })}
    >
      <View style={styles.itemContent}>
        <View>
          <Text style={styles.itemName}>{item.nome}</Text>
          <Text style={styles.itemEmail}>{item.email}</Text>
          <Text style={styles.itemRole}>Função: {item.role}</Text>
          <Text style={[styles.itemStatus, 
            { color: item.status === 'ativo' ? 'green' : 'red' }]}>
            Status: {item.status}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AdicionarUsuario')}
      >
        <Text style={styles.addButtonText}>Adicionar Usuário</Text>
      </TouchableOpacity>

      <FlatList
        data={usuarios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={loadUsuarios}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum usuário cadastrado</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 5,
    marginBottom: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default GerenciarUsuariosScreen;