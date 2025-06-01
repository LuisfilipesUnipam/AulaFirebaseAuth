// src/screens/UserListScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet
} from 'react-native';
import useFirebase from '../hooks/useFirebase';
import globalStyles from '../styles/globalStyles';

export default function UserListScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const { fetchUsers, deleteUser } = useFirebase();

  useEffect(() => {
    (async () => {
      const data = await fetchUsers();
      setUsers(data);
    })();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((u) => u.filter((x) => x.id !== id));
      Alert.alert('Sucesso', 'Usuário excluído');
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemText}>{item.nome}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate('UserDetails', { id: item.id })
          }
        >
          <Text style={styles.viewButtonText}>Ver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/unipam_logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Lista de Usuários</Text>
      <FlatList
        data={users}
        keyExtractor={(x) => x.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E9EEF4', 
    paddingTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#143D59', 
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  viewButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#143D59',
    borderWidth: 1,
    marginLeft: 10,
  },
  viewButtonText: {
    color: '#143D59',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#d9534f', 
    borderWidth: 1,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#d9534f',
    fontSize: 12,
  },
});
