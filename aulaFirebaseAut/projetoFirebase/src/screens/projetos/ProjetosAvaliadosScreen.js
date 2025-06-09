import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';

export default function ProjetosAvaliadosScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      console.log('Loading evaluated projects'); // Debug log

      // Busca projetos que têm avaliação
      const projectsQuery = query(
        collection(db, 'projetos'),
        where('avaliacao', '!=', null)
      );

      const querySnapshot = await getDocs(projectsQuery);
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Found evaluated projects:', projectsList); // Debug log
      setProjects(projectsList);
    } catch (error) {
      console.error('Erro ao carregar projetos avaliados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os projetos avaliados: ' + error.message);
    }
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}
    >
      <Text style={styles.projectTitle}>{item.titulo}</Text>
      <Text style={styles.projectInfo}>Curso: {item.cursoId}</Text>
      <Text style={styles.projectInfo}>Aluno: {item.alunoNome}</Text>
      <Text style={styles.projectStatus}>Status: {item.status}</Text>
      <Text style={styles.evaluationInfo}>Nota: {item.avaliacao.nota}</Text>
      <Text style={styles.evaluationInfo}>Comentários: {item.avaliacao.comentarios}</Text>
      <Text style={styles.evaluationInfo}>Data: {new Date(item.avaliacao.dataAvaliacao).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projetos Avaliados</Text>
      </View>
      {projects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Não há projetos avaliados.</Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    padding: 16,
  },
  projectItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  projectInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  projectStatus: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  evaluationInfo: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 