import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import usePeriodos from '../../hooks/usePeriodos';

export default function AdicionarPeriodoScreen({ navigation }) {
  const [form, setForm] = useState({
    ano: new Date().getFullYear().toString(),
    semestre: '1',
    descricao: '',
    dataInicio: new Date(),
    dataFim: new Date(new Date().setMonth(new Date().getMonth() + 6)),
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState('date');
  const [currentDateField, setCurrentDateField] = useState(null);
  
  const { addPeriodo, loading } = usePeriodos();
  
  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  
  const showDatepicker = (field) => {
    setShowDatePicker(true);
    setDatePickerMode('date');
    setCurrentDateField(field);
  };
  
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type === 'dismissed') {
      return;
    }
    
    if (selectedDate) {
      setForm({ ...form, [currentDateField]: selectedDate });
    }
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR');
  };
  
  const handleSubmit = async () => {
    // Validação básica
    if (!form.ano || !form.semestre) {
      Alert.alert('Erro', 'Ano e semestre são campos obrigatórios.');
      return;
    }
    
    if (form.dataFim < form.dataInicio) {
      Alert.alert('Erro', 'A data de término deve ser posterior à data de início.');
      return;
    }
    
    try {
      await addPeriodo(form);
      Alert.alert(
        'Sucesso', 
        'Período cadastrado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o período.');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Ano *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2025"
              value={form.ano}
              onChangeText={(value) => handleChange('ano', value)}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
          
          <View style={styles.halfField}>
            <Text style={styles.label}>Semestre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 1"
              value={form.semestre}
              onChangeText={(value) => handleChange('semestre', value)}
              keyboardType="numeric"
              maxLength={1}
            />
          </View>
        </View>
        
        <Text style={styles.label}>Data de Início</Text>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => showDatepicker('dataInicio')}
        >
          <Text style={styles.dateText}>{formatDate(form.dataInicio)}</Text>
          <Ionicons name="calendar-outline" size={20} color="#143D59" />
        </TouchableOpacity>
        
        <Text style={styles.label}>Data de Término</Text>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => showDatepicker('dataFim')}
        >
          <Text style={styles.dateText}>{formatDate(form.dataFim)}</Text>
          <Ionicons name="calendar-outline" size={20} color="#143D59" />
        </TouchableOpacity>
        
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descreva o período acadêmico..."
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
              <Text style={styles.buttonText}>Salvar Período</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      
      {showDatePicker && (
        <DateTimePicker
          value={form[currentDateField]}
          mode={datePickerMode}
          display="default"
          onChange={onDateChange}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9EEF4',
  },
  formContainer: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
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
  dateInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
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