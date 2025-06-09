import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';

export default function ProjectListScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      console.log('Loading projects for user:', user); // Debug log

      let projectsQuery;
      if (user.tipo === 'admin') {
        projectsQuery = collection(db, 'projetos');
      } else if (user.tipo === 'aluno') {
        projectsQuery = query(collection(db, 'projetos'), where('alunoId', '==', user.uid));
      } else if (user.tipo === 'avaliador') {
        projectsQuery = query(collection(db, 'projetos'), where('avaliadorId', '==', user.uid));
      }

      console.log('Query:', projectsQuery); // Debug log

      const querySnapshot = await getDocs(projectsQuery);
      const projectsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log('Found projects:', projectsList); // Debug log
      setProjects(projectsList);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    }
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() => navigation.navigate('ProjectDetails', { projectId: item.id })}
    >
      <Text style={styles.projectTitle}>{item.titulo}</Text>
      <Text style={styles.projectInfo}>Curso: {item.cursoId}</Text>
      <Text style={styles.projectInfo}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projetos</Text>
        {user.tipo === 'admin' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('ProjectForm')}
          >
            <Text style={styles.addButtonText}>Novo Projeto</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={projects}
        renderItem={renderProjectItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    marginBottom: 8,
  },
  projectInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
}); 