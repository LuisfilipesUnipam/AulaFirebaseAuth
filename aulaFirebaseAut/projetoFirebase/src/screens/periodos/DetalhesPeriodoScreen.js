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
import usePeriodos from '../../hooks/usePeriodos';

export default function DetalhesPeriodoScreen({ route, navigation }) {
  const { periodoId } = route.params;
  const [periodo, setPeriodo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { getPeriodoById, deletePeriodo } = usePeriodos();
  
  useEffect(() => {
    const loadPeriodo = async () => {
      try {
        const periodoData = await getPeriodoById(periodoId);
        setPeriodo(periodoData);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do período');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    
    loadPeriodo();
  }, [periodoId]);
  
  const handleDelete = () => {
    const periodoNome = `${periodo.ano}.${periodo.semestre}`;
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o período "${periodoNome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePeriodo(periodoId);
              Alert.alert('Sucesso', 'Período excluído com sucesso!');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o período.');
            }
          }
        }
      ]
    );
  };
  
  const getPeriodoStatus = (periodo) => {
    const hoje = new Date();
    const dataInicio = periodo.dataInicio ? new Date(periodo.dataInicio.toDate()) : null;
    const dataFim = periodo.dataFim ? new Date(periodo.dataFim.toDate()) : null;
    
    if (!dataInicio || !dataFim) return 'Indefinido';
    
    if (hoje < dataInicio) return 'Não iniciado';
    if (hoje > dataFim) return 'Encerrado';
    return 'Em andamento';
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Em andamento': return '#4CAF50';
      case 'Não iniciado': return '#2196F3';
      case 'Encerrado': return '#F44336';
      default: return '#9E9E9E';
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#143D59" />
      </View>
    );
  }
  
  if (!periodo) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>Período não encontrado</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const periodoNome = `${periodo.ano}.${periodo.semestre}`;
  const status = getPeriodoStatus(periodo);
  const statusColor = getStatusColor(status);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar" size={40} color="#143D59" />
        </View>
        <Text style={styles.title}>Período {periodoNome}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Ano:</Text>
          <Text style={styles.infoValue}>{periodo.ano}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Semestre:</Text>
          <Text style={styles.infoValue}>{periodo.semestre}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de Início:</Text>
          <Text style={styles.infoValue}>
            {periodo.dataInicio ? new Date(periodo.dataInicio.toDate()).toLocaleDateString('pt-BR') : 'Não definida'}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de Término:</Text>
          <Text style={styles.infoValue}>
            {periodo.dataFim ? new Date(periodo.dataFim.toDate()).toLocaleDateString('pt-BR') : 'Não definida'}
          </Text>
        </View>
        
        {periodo.createdAt && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Cadastrado em:</Text>
            <Text style={styles.infoValue}>
              {new Date(periodo.createdAt.toDate()).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}
      </View>
      
      {periodo.descricao && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Descrição:</Text>
          <Text style={styles.descriptionText}>{periodo.descricao}</Text>
        </View>
      )}
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('EditarPeriodo', { periodoId })}
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
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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