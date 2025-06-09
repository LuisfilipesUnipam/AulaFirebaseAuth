import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../hooks/useAuth';

export default function ProjectFormScreen({ route, navigation }) {
  const { projectId } = route.params || {};
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    cursoId: '',
    status: 'pendente',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
  });
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar cursos
      const cursosSnapshot = await getDocs(collection(db, 'cursos'));
      setCursos(cursosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Se estiver editando, carregar dados do projeto
      if (projectId) {
        const projectDoc = await getDoc(doc(db, 'projetos', projectId));
        if (projectDoc.exists()) {
          setFormData({ id: projectDoc.id, ...projectDoc.data() });
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados necessários.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.titulo || !formData.cursoId) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      console.log('Current user:', user); // Debug log

      const projectData = {
        ...formData,
        alunoId: user.uid,
        alunoNome: user.nome,
        updatedAt: new Date().toISOString(),
      };

      console.log('Project data to save:', projectData); // Debug log

      if (projectId) {
        await setDoc(doc(db, 'projetos', projectId), projectData);
      } else {
        projectData.createdAt = new Date().toISOString();
        const newProjectRef = doc(collection(db, 'projetos'));
        await setDoc(newProjectRef, projectData);
        console.log('New project created with ID:', newProjectRef.id); // Debug log
      }

      Alert.alert('Sucesso', 'Projeto salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar projeto:', error);
      Alert.alert('Erro', 'Não foi possível salvar o projeto.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={formData.titulo}
          onChangeText={(text) => setFormData({ ...formData, titulo: text })}
          placeholder="Digite o título do projeto"
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.descricao}
          onChangeText={(text) => setFormData({ ...formData, descricao: text })}
          placeholder="Digite a descrição do projeto"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Curso *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.cursoId}
            onValueChange={(value) => setFormData({ ...formData, cursoId: value })}
          >
            <Picker.Item label="Selecione um curso" value="" />
            {cursos.map((curso) => (
              <Picker.Item key={curso.id} label={curso.nome} value={curso.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Data de Início</Text>
        <TextInput
          style={styles.input}
          value={formData.dataInicio}
          onChangeText={(text) => setFormData({ ...formData, dataInicio: text })}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Data de Término</Text>
        <TextInput
          style={styles.input}
          value={formData.dataFim}
          onChangeText={(text) => setFormData({ ...formData, dataFim: text })}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <Picker.Item label="Pendente" value="pendente" />
            <Picker.Item label="Em Andamento" value="em_andamento" />
            <Picker.Item label="Concluído" value="concluido" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Salvar Projeto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 