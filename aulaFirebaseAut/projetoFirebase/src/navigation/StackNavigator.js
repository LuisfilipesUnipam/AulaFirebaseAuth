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

const Stack = createStackNavigator();

const StackNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen}/>
        <Stack.Screen name="Initial" component={InitialScreen}/>
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="UserList" component={UserListScreen}/>
        <Stack.Screen name="UserDetails" component={UserDetailsScreen}/>
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
    </Stack.Navigator>
);

export default StackNavigator;
