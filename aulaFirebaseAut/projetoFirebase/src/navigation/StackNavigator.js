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

const Stack = createStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Initial" component={InitialScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="UserList" component={UserListScreen}/>
        <Stack.Screen name="UserDetails" component={UserDetailsScreen}/>
        
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
        
        {/* Usuários - Novas telas */}
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
    </Stack.Navigator>
);

export default StackNavigator;