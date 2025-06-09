// Atualização do StackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import UserListScreen from '../screens/UserListScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import InitialScreen from '../screens/InitialScreen';
import GerenciarCursosScreen from '../screens/cursos/GerenciarCursosScreen';
import AdicionarCursoScreen from '../screens/cursos/AdicionarCursoScreen';
import EditarCursoScreen from '../screens/cursos/EditarCursoScreen';
import DetalhesCursoScreen from '../screens/cursos/DetalhesCursoScreen';
import GerenciarPeriodosScreen from '../screens/periodos/GerenciarPeriodosScreen';
import AdicionarPeriodoScreen from '../screens/periodos/AdicionarPeriodoScreen';
import EditarPeriodoScreen from '../screens/periodos/EditarPeriodoScreen';
import DetalhesPeriodoScreen from '../screens/periodos/DetalhesPeriodoScreen';
// Novas importações para o módulo de usuários
import GerenciarUsuariosScreen from '../screens/usuarios/GerenciarUsuariosScreen';
import AdicionarUsuarioScreen from '../screens/usuarios/AdicionarUsuarioScreen';
import EditarUsuarioScreen from '../screens/usuarios/EditarUsuarioScreen';
import DetalhesUsuarioScreen from '../screens/usuarios/DetalhesUsuarioScreen';
// Novas importações para o módulo de projetos
import ProjectListScreen from '../screens/projetos/ProjectListScreen';
import ProjectFormScreen from '../screens/projetos/ProjectFormScreen';
import ProjectDetailsScreen from '../screens/projetos/ProjectDetailsScreen';
import ProjectEvaluationScreen from '../screens/projetos/ProjectEvaluationScreen';
import ProjetosParaAvaliarScreen from '../screens/projetos/ProjetosParaAvaliarScreen';
import ProjetosAvaliadosScreen from '../screens/projetos/ProjetosAvaliadosScreen';
import GerenciarFaculdadesScreen from '../screens/GerenciarFaculdadesScreen';

const Stack = createStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
            headerStyle: {
                backgroundColor: '#143D59',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }}
    >
        <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Início' }}
        />
        <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ title: 'Login' }}
        />
        <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ title: 'Cadastro' }}
        />
        <Stack.Screen 
            name="Initial" 
            component={InitialScreen}
            options={{ title: 'Portal' }}
        />
        <Stack.Screen 
            name="UserList" 
            component={UserListScreen}
            options={{ title: 'Lista de Usuários' }}
        />
        <Stack.Screen 
            name="UserDetails" 
            component={UserDetailsScreen}
            options={{ title: 'Detalhes do Usuário' }}
        />

        {/* Cursos */}
        <Stack.Screen 
            name="GerenciarCursos" 
            component={GerenciarCursosScreen}
            options={{ title: 'Gerenciar Cursos' }}
        />
        <Stack.Screen 
            name="AdicionarCurso" 
            component={AdicionarCursoScreen}
            options={{ title: 'Adicionar Curso' }}
        />
        <Stack.Screen 
            name="EditarCurso" 
            component={EditarCursoScreen}
            options={{ title: 'Editar Curso' }}
        />
        <Stack.Screen 
            name="DetalhesCurso" 
            component={DetalhesCursoScreen}
            options={{ title: 'Detalhes do Curso' }}
        />

        {/* Períodos */}
        <Stack.Screen 
            name="GerenciarPeriodos" 
            component={GerenciarPeriodosScreen}
            options={{ title: 'Gerenciar Períodos' }}
        />
        <Stack.Screen 
            name="AdicionarPeriodo" 
            component={AdicionarPeriodoScreen}
            options={{ title: 'Adicionar Período' }}
        />
        <Stack.Screen 
            name="EditarPeriodo" 
            component={EditarPeriodoScreen}
            options={{ title: 'Editar Período' }}
        />
        <Stack.Screen 
            name="DetalhesPeriodo" 
            component={DetalhesPeriodoScreen}
            options={{ title: 'Detalhes do Período' }}
        />

        {/* Usuários */}
        <Stack.Screen 
            name="GerenciarUsuarios" 
            component={GerenciarUsuariosScreen}
            options={{ title: 'Gerenciar Usuários' }}
        />
        <Stack.Screen 
            name="AdicionarUsuario" 
            component={AdicionarUsuarioScreen}
            options={{ title: 'Adicionar Usuário' }}
        />
        <Stack.Screen 
            name="EditarUsuario" 
            component={EditarUsuarioScreen}
            options={{ title: 'Editar Usuário' }}
        />
        <Stack.Screen 
            name="DetalhesUsuario" 
            component={DetalhesUsuarioScreen}
            options={{ title: 'Detalhes do Usuário' }}
        />

        {/* Projetos */}
        <Stack.Screen 
            name="ProjectList" 
            component={ProjectListScreen}
            options={{ title: 'Projetos' }}
        />
        <Stack.Screen 
            name="ProjectForm" 
            component={ProjectFormScreen}
            options={{ title: 'Formulário de Projeto' }}
        />
        <Stack.Screen 
            name="ProjectDetails" 
            component={ProjectDetailsScreen}
            options={{ title: 'Detalhes do Projeto' }}
        />
        <Stack.Screen 
            name="ProjectEvaluation" 
            component={ProjectEvaluationScreen}
            options={{ title: 'Avaliar Projeto' }}
        />
        <Stack.Screen 
            name="ProjetosParaAvaliar" 
            component={ProjetosParaAvaliarScreen}
            options={{ title: 'Projetos para Avaliar' }}
        />
        <Stack.Screen 
            name="ProjetosAvaliados" 
            component={ProjetosAvaliadosScreen}
            options={{ title: 'Projetos Avaliados' }}
        />

        {/* Faculdades */}
        <Stack.Screen 
            name="GerenciarFaculdades" 
            component={GerenciarFaculdadesScreen}
            options={{ title: 'Gerenciar Faculdades' }}
        />
    </Stack.Navigator>
);

export default StackNavigator;