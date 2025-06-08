// src/screens/cursos/EditarCursoScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useCursos from '../../hooks/useCursos';

export default function EditarCursoScreen({ route, navigation }) {
  const { cursoId } = route.params;
  const [form, setForm] = useState({
    nome: '',
    duracao: '',
    descricao: '',
    coordenador: '',
    area: ''
  });
  const [initialLoading, setInitialLoading] = useState(true);
  
  const { getCursoById, updateCurso, loading } = useCursos();
  
  useEffect(() => {
    const loadCurso = async () => {
      try {
        const curso = await getCursoById(cursoId);
        if (curso) {
          setForm({
            nome: curso.nome || '',
            duracao: curso.duracao ? curso.duracao.toString() : '',
            descricao: curso.descricao || '',
            coordenador: curso.coordenador || '',
            area: curso.area || ''
          });
        } else {
          Alert.alert('Erro', 'Curso não encontrado');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do curso');
        navigation.goBack();
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadCurso();
  }, [cursoId]);
  
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  
  const handleSubmit = async () => {
    // Validação básica
    if (!form.nome || !form.duracao) {
      Alert.alert('Erro', 'Nome e duração são campos obrigatórios.');
      return;
    }
    
    try {
      await updateCurso(cursoId, form);
      Alert.alert(
        'Sucesso', 
        'Curso atualizado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o curso.');
    }
  };
  
  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#143D59" />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nome do Curso *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Sistemas de Informação"
          value={form.nome}
          onChangeText={(value) => handleChange('nome', value)}
        />
        
        <Text style={styles.label}>Duração (semestres) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 8"
          value={form.duracao}
          onChangeText={(value) => handleChange('duracao', value)}
          keyboardType="numeric"
        />
        
        <Text style={styles.label}>Área</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Tecnologia"
          value={form.area}
          onChangeText={(value) => handleChange('area', value)}
        />
        
        <Text style={styles.label}>Coordenador</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Prof. João Silva"
          value={form.coordenador}
          onChangeText={(value) => handleChange('coordenador', value)}
        />
        
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva o curso..."
          value={form.descricao}
          onChangeText={(value) => handleChange('descricao', value)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>Atualizar Curso</Text>
            </>
          )}
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
  formContainer: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#143D59',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  button: {
    backgroundColor: '#143D59',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});