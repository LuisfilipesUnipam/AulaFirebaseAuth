import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';

export default function ProjectDetailsScreen({ route, navigation }) {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    console.log('ProjectDetailsScreen mounted with projectId:', projectId);
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      console.log('Loading project with ID:', projectId);
      const projectDoc = await getDoc(doc(db, 'projetos', projectId));
      if (projectDoc.exists()) {
        const projectData = { id: projectDoc.id, ...projectDoc.data() };
        console.log('Loaded project data:', projectData);
        setProject(projectData);
      }
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do projeto.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigation.navigate('ProjectForm', { projectId });
  };

  const handleEvaluate = () => {
    navigation.navigate('ProjectEvaluation', { projectId });
  };

  const handleDelete = async () => {
    console.log('Delete button pressed for project:', projectId);
    console.log('Current user:', user);
    console.log('Project data:', project);
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Attempting to delete project:', projectId);
              if (!projectId) {
                throw new Error('ID do projeto não encontrado');
              }
              const projectRef = doc(db, 'projetos', projectId);
              console.log('Project reference:', projectRef);
              await deleteDoc(projectRef);
              console.log('Project deleted successfully');
              Alert.alert('Sucesso', 'Projeto excluído com sucesso!');
              navigation.goBack();
            } catch (error) {
              console.error('Erro ao excluir projeto:', error);
              Alert.alert('Erro', 'Não foi possível excluir o projeto: ' + error.message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <Text>Projeto não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{project.titulo}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{project.descricao}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={styles.infoValue}>{project.status}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data de Início:</Text>
            <Text style={styles.infoValue}>{project.dataInicio}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data de Término:</Text>
            <Text style={styles.infoValue}>{project.dataFim}</Text>
          </View>
        </View>

        {project.avaliacao && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avaliação</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nota:</Text>
              <Text style={styles.infoValue}>{project.avaliacao.nota}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Comentários:</Text>
              <Text style={styles.infoValue}>{project.avaliacao.comentarios}</Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          {user.tipo === 'admin' && (
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <Text style={styles.buttonText}>Editar Projeto</Text>
            </TouchableOpacity>
          )}
          
          {user.tipo === 'avaliador' && project.status === 'concluido' && !project.avaliacao && (
            <TouchableOpacity style={styles.button} onPress={handleEvaluate}>
              <Text style={styles.buttonText}>Avaliar Projeto</Text>
            </TouchableOpacity>
          )}

          {user.tipo === 'aluno' && project.alunoId === user.uid && (
            <TouchableOpacity 
              style={[styles.button, styles.deleteButton]} 
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Excluir Projeto</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 