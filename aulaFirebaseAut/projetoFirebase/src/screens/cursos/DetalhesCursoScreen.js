// src/screens/cursos/DetalhesCursoScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCursos from '../../hooks/useCursos';

export default function DetalhesCursoScreen({ route, navigation }) {
  const { cursoId } = route.params;
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { getCursoById, deleteCurso } = useCursos();
  
  useEffect(() => {
    const loadCurso = async () => {
      try {
        const cursoData = await getCursoById(cursoId);
        setCurso(cursoData);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do curso');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    
    loadCurso();
  }, [cursoId]);
  
  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o curso "${curso.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCurso(cursoId);
              Alert.alert('Sucesso', 'Curso excluído com sucesso!');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o curso.');
            }
          }
        }
      ]
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#143D59" />
      </View>
    );
  }
  
  if (!curso) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>Curso não encontrado</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="school" size={40} color="#143D59" />
        </View>
        <Text style={styles.title}>{curso.nome}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Duração:</Text>
          <Text style={styles.infoValue}>{curso.duracao} {parseInt(curso.duracao) === 1 ? 'semestre' : 'semestres'}</Text>
        </View>
        
        {curso.area && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Área:</Text>
            <Text style={styles.infoValue}>{curso.area}</Text>
          </View>
        )}
        
        {curso.coordenador && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Coordenador:</Text>
            <Text style={styles.infoValue}>{curso.coordenador}</Text>
          </View>
        )}
        
        {curso.createdAt && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Cadastrado em:</Text>
            <Text style={styles.infoValue}>
              {new Date(curso.createdAt.toDate()).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}
      </View>
      
      {curso.descricao && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Descrição:</Text>
          <Text style={styles.descriptionText}>{curso.descricao}</Text>
        </View>
      )}
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditarCurso', { cursoId })}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9EEF4',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9EEF4',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E9EEF4',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#143D59',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E9EEF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#143D59',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#143D59',
    width: 120,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#143D59',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#143D59',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});