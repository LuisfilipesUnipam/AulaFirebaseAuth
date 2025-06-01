// src/screens/UserDetailsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet
} from 'react-native';
import useFirebase from '../hooks/useFirebase';
import globalStyles from '../styles/globalStyles';

export default function UserDetailsScreen({ route }) {
  const { id } = route.params;
  const [user, setUser] = useState(null);
  const { getUserById } = useFirebase();

  useEffect(() => {
    (async () => {
      const data = await getUserById(id);
      setUser(data);
    })();
  }, [id]);

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#143D59" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/unipam_logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Detalhes do Usuário</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Nome:</Text> {user.nome}</Text>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Período:</Text> {user.periodo}</Text>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Email:</Text> {user.email}</Text>
        {/* Não exiba senha em produção! */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#E9EEF4',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#143D59',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  detailLabel: {
    fontWeight: 'bold',
  },
});
