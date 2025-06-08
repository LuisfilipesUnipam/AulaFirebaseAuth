import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import usePeriodos from '../../hooks/usePeriodos';

export default function GerenciarPeriodosScreen({ navigation }) {
  const [periodos, setPeriodos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { fetchPeriodos, deletePeriodo, loading } = usePeriodos();

  const loadPeriodos = async () => {
    try {
      setRefreshing(true);
      const periodosData = await fetchPeriodos();
      // Ordenar períodos por ano e semestre
      periodosData.sort((a, b) => {
        if (a.ano !== b.ano) return b.ano - a.ano;
        return b.semestre - a.semestre;
      });
      setPeriodos(periodosData);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os períodos.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadPeriodos();
    });

    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id, nome) => {
    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o período "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePeriodo(id);
              loadPeriodos();
              Alert.alert('Sucesso', 'Período excluído com sucesso!');
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

  const renderItem = ({ item }) => {
    const periodoNome = `${item.ano}.${item.semestre}`;
    const status = getPeriodoStatus(item);
    const statusColor = getStatusColor(status);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{periodoNome}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>
          
          <View style={styles.cardDates}>
            {item.dataInicio && (
              <Text style={styles.cardDate}>
                Início: {new Date(item.dataInicio.toDate()).toLocaleDateString('pt-BR')}
              </Text>
            )}
            {item.dataFim && (
              <Text style={styles.cardDate}>
                Fim: {new Date(item.dataFim.toDate()).toLocaleDateString('pt-BR')}
              </Text>
            )}
          </View>
          
          {item.descricao && (
            <Text style={styles.cardDescription} numberOfLines={2}>{item.descricao}</Text>
          )}
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('DetalhesPeriodo', { periodoId: item.id })}
          >
            <Ionicons name="eye-outline" size={22} color="#143D59" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditarPeriodo', { periodoId: item.id })}
          >
            <Ionicons name="create-outline" size={22} color="#143D59" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDelete(item.id, periodoNome)}
          >
            <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Períodos Acadêmicos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AdicionarPeriodo')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#143D59" />
        </View>
      ) : (
        <FlatList
          data={periodos}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={loadPeriodos}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Nenhum período cadastrado</Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => navigation.navigate('AdicionarPeriodo')}
              >
                <Text style={styles.emptyButtonText}>Adicionar Período</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9EEF4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#143D59',
  },
  addButton: {
    backgroundColor: '#143D59',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#143D59',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardDates: {
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 14,
    color: '#666',
  },
  cardDescription: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#143D59',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});