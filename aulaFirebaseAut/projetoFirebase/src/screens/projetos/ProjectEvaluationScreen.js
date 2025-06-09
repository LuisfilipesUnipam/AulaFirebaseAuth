import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';

export default function ProjectEvaluationScreen({ route, navigation }) {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [evaluation, setEvaluation] = useState({
    nota: '',
    comentarios: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    loadProject();
  }, []);

  const loadProject = async () => {
    try {
      const projectDoc = await getDoc(doc(db, 'projetos', projectId));
      if (projectDoc.exists()) {
        setProject({ id: projectDoc.id, ...projectDoc.data() });
      }
    } catch (error) {
      console.error('Erro ao carregar projeto:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do projeto.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (!evaluation.nota || !evaluation.comentarios) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
      }

      const nota = parseFloat(evaluation.nota);
      if (isNaN(nota) || nota < 0 || nota > 10) {
        Alert.alert('Erro', 'A nota deve ser um número entre 0 e 10.');
        return;
      }

      const evaluationData = {
        ...evaluation,
        nota: nota,
        avaliadorId: user.uid,
        avaliadorNome: user.nome,
        dataAvaliacao: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'projetos', projectId), {
        avaliacao: evaluationData,
        status: 'avaliado',
      });

      Alert.alert('Sucesso', 'Avaliação registrada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      Alert.alert('Erro', 'Não foi possível salvar a avaliação.');
    }
  };

  if (!project) {
    return (
      <View style={styles.container}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Avaliar Projeto</Text>
        <Text style={styles.projectTitle}>{project.titulo}</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nota (0-10) *</Text>
          <TextInput
            style={styles.input}
            value={evaluation.nota}
            onChangeText={(text) => setEvaluation({ ...evaluation, nota: text })}
            placeholder="Digite a nota (0-10)"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Comentários *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={evaluation.comentarios}
            onChangeText={(text) => setEvaluation({ ...evaluation, comentarios: text })}
            placeholder="Digite seus comentários sobre o projeto"
            multiline
            numberOfLines={6}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar Avaliação</Text>
          </TouchableOpacity>
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
    marginBottom: 8,
    color: '#333',
  },
  projectTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 24,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
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