// src/screens/InitialScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function InitialScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user) {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'pessoa', user.uid));
          
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log('Documento do usuário não encontrado');
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const renderAdminOptions = () => (
    <>
      <Text style={styles.sectionTitle}>Gerenciamento</Text>
      <View style={styles.optionsGrid}>
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('GerenciarFaculdades')}>
          <Ionicons name="business-outline" size={32} color="#143D59" />
          <Text style={styles.optionText}>Faculdades</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('GerenciarCursos')}>
          <Ionicons name="school-outline" size={32} color="#143D59" />
          <Text style={styles.optionText}>Cursos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('GerenciarPeriodos')}>
          <Ionicons name="calendar-outline" size={32} color="#143D59" />
          <Text style={styles.optionText}>Períodos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('GerenciarUsuarios')}>
          <Ionicons name="people-outline" size={32} color="#143D59" />
          <Text style={styles.optionText}>Usuários</Text>
        </TouchableOpacity>
      </View>
    </>
  );
  
  const renderAlunoOptions = () => (
    <>
      <Text style={styles.sectionTitle}>Projetos</Text>
      <View style={styles.optionsGrid}>
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('ProjectList')}>
          <Ionicons name="folder-outline" size={32} color="#143D59" />
          <Text style={styles.optionText}>Meus Projetos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('ProjectForm')}>
          <Ionicons name="add-circle-outline" size={32} color="#143D59" />
          <Text style={styles.optionText}>Novo Projeto</Text>
        </TouchableOpacity>
      </View>
    </>
  );
  
  const renderAvaliadorOptions = () => (
    <>
      <Text style={styles.sectionTitle}>Avaliação</Text>
      <View style={styles.optionsGrid}>
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('ProjetosParaAvaliar')}>
          <Ionicons name="checkmark-circle-outline" size={32} color="#143D59" />
          <Text style={styles.optionText}>Avaliar Projetos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('ProjetosAvaliados')}>
          <Ionicons name="list-circle-outline" size={32} color="#143D59" />
          <Text style={styles.optionText}>Projetos Avaliados</Text>
        </TouchableOpacity>
      </View>
    </>
  );
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/unipam_logo.png')}
          style={styles.logo}
        />
        <View style={styles.headerTextContainer}>
          <Text style={styles.welcomeText}>Bem-vindo(a),</Text>
          <Text style={styles.userName}>{userData?.nome || 'Usuário'}</Text>
          <Text style={styles.userType}>
            {userData?.tipo === 'aluno' ? 'Aluno' : 
             userData?.tipo === 'avaliador' ? 'Avaliador' : 
             userData?.tipo === 'admin' ? 'Administrador' : 'Usuário'}
          </Text>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {userData?.tipo === 'admin' && renderAdminOptions()}
        {userData?.tipo === 'aluno' && renderAlunoOptions()}
        {userData?.tipo === 'avaliador' && renderAvaliadorOptions()}
        
        <Text style={styles.sectionTitle}>Geral</Text>
        <View style={styles.optionsGrid}>
          <TouchableOpacity style={styles.optionCard} onPress={() => navigation.navigate('Perfil')}>
            <Ionicons name="person-outline" size={32} color="#143D59" />
            <Text style={styles.optionText}>Meu Perfil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={() => {
              getAuth().signOut();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }}
          >
            <Ionicons name="log-out-outline" size={32} color="#143D59" />
            <Text style={styles.optionText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#143D59',
  },
  userType: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#143D59',
    marginTop: 20,
    marginBottom: 15,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 120,
  },
  optionText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    color: '#143D59',
    textAlign: 'center',
  },
});