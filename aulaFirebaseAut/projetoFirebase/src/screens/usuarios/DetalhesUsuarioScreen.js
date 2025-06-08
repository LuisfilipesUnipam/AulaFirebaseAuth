// screens/usuarios/DetalhesUsuarioScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFirebase from '../../hooks/useFirebase';

const DetalhesUsuarioScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [usuario, setUsuario] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [periodos, setPeriodos] = useState([]);
  const [cursosUsuario, setCursosUsuario] = useState([]);
  const [periodosUsuario, setPeriodosUsuario] = useState([]);
  const [isActive, setIsActive] = useState(true);
  
  const { 
    getUserById, 
    fetchCursos, 
    fetchPeriodos, 
    changeUserStatus, 
    loading,
    updateUser
  } = useFirebase();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar dados do usuário
        const userData = await getUserById(userId);
        setUsuario(userData);
        setIsActive(userData.status === 'ativo');
        
        // Carregar cursos e períodos
        const cursosData = await fetchCursos();
        const periodosData = await fetchPeriodos();
        
        setCursos(cursosData);
        setPeriodos(periodosData);
        
        // Filtrar cursos e períodos do usuário
        const userCursos = userData.cursos || [];
        const userPeriodos = userData.periodos || [];
        
        setCursosUsuario(userCursos);
        setPeriodosUsuario(userPeriodos);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário');
      }
    };
    
    loadData();
  }, [userId]);

  const handleStatusChange = async (value) => {
    try {
      setIsActive(value);
      const newStatus = value ? 'ativo' : 'inativo';
      await changeUserStatus(userId, newStatus);
      
      // Atualizar o estado local
      setUsuario(prev => ({...prev, status: newStatus}));
      
      Alert.alert('Sucesso', `Status alterado para ${newStatus}`);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      Alert.alert('Erro', 'Não foi possível alterar o status do usuário');
      setIsActive(!value); // Reverter o switch em caso de erro
    }
  };

  const handleCursoToggle = async (cursoId) => {
    try {
      const newCursos = [...cursosUsuario];
      
      if (newCursos.includes(cursoId)) {
        // Remover curso
        const index = newCursos.indexOf(cursoId);
        newCursos.splice(index, 1);
      } else {
        // Adicionar curso
        newCursos.push(cursoId);
      }
      
      setCursosUsuario(newCursos);
      await updateUser(userId, { cursos: newCursos });
    } catch (error) {
      console.error('Erro ao atualizar cursos:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os cursos do usuário');
    }
  };

  const handlePeriodoToggle = async (periodoId) => {
    try {
      const newPeriodos = [...periodosUsuario];
      
      if (newPeriodos.includes(periodoId)) {
        // Remover período
        const index = newPeriodos.indexOf(periodoId);
        newPeriodos.splice(index, 1);
      } else {
        // Adicionar período
        newPeriodos.push(periodoId);
      }
      
      setPeriodosUsuario(newPeriodos);
      await updateUser(userId, { periodos: newPeriodos });
    } catch (error) {
      console.error('Erro ao atualizar períodos:', error);
      Alert.alert('Erro', 'Não foi possível atualizar os períodos do usuário');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUser(userId);
              Alert.alert('Sucesso', 'Usuário excluído com sucesso');
              navigation.goBack();
            } catch (error) {
              console.error('Erro ao excluir usuário:', error);
              Alert.alert('Erro', 'Não foi possível excluir o usuário');
            }
          }
        }
      ]
    );
  };

  if (!usuario || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{usuario.nome}</Text>
        <Text style={styles.subtitle}>{usuario.email}</Text>
        <Text style={styles.role}>Função: {usuario.role}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Status</Text>
          <Switch
            value={isActive}
            onValueChange={handleStatusChange}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isActive ? '#0066CC' : '#f4f3f4'}
          />
        </View>
        <Text style={styles.statusText}>
          {isActive ? 'Ativo' : 'Inativo'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cursos</Text>
        {cursos.length > 0 ? (
          cursos.map(curso => (
            <View key={curso.id} style={styles.itemRow}>
              <Text style={styles.itemText}>{curso.nome}</Text>
              <Switch
                value={cursosUsuario.includes(curso.id)}
                onValueChange={() => handleCursoToggle(curso.id)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={cursosUsuario.includes(curso.id) ? '#0066CC' : '#f4f3f4'}
              />
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum curso disponível</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Períodos</Text>
        {periodos.length > 0 ? (
          periodos.map(periodo => (
            <View key={periodo.id} style={styles.itemRow}>
              <Text style={styles.itemText}>{periodo.nome}</Text>
              <Switch
                value={periodosUsuario.includes(periodo.id)}
                onValueChange={() => handlePeriodoToggle(periodo.id)}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={periodosUsuario.includes(periodo.id) ? '#0066CC' : '#f4f3f4'}
              />
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum período disponível</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditarUsuario', { userId })}
        >
          <Text style={styles.buttonText}>Editar Usuário</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Excluir Usuário</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#0066CC',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  buttonContainer: {
    margin: 10,
    marginBottom: 30,
  },
  editButton: {
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DetalhesUsuarioScreen;