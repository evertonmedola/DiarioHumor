import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListagem from '../screens/TelaListagem';
import TelaFormulario from '../screens/TelaFormulario';
import TelaDetalhes from '../screens/TelaDetalhes';

const Stack = createNativeStackNavigator();

// Pilha de navegação única: Listagem é a tela inicial.
// Formulario recebe { registroId } opcional (presença = modo edição).
// Detalhes recebe { registroId } obrigatório.
export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Listagem">
      <Stack.Screen
        name="Listagem"
        component={TelaListagem}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Formulario"
        component={TelaFormulario}
        options={{ title: 'Novo registro' }}
      />
      <Stack.Screen
        name="Detalhes"
        component={TelaDetalhes}
        options={{ title: 'Detalhes' }}
      />
    </Stack.Navigator>
  );
}
