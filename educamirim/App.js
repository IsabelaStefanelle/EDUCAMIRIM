//Aqui gatinhas o App.js é o ponto de entrada do aplicativo. Ele define a navegação entre telas e o tema geral do app.
//Comecei importando as bibliotecas necessárias para a navegação e as telas que vamos usar.
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListScreen from './src/screens/ListScreen';
import DetailScreen from './src/screens/DetailScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen
          name="Lista"
          component={ListScreen}
          options={{ title: 'Lista de Atividades' }}
        />
        <Stack.Screen
          name="Detalhe"
          component={DetailScreen}
          options={{ title: 'Detalhes da Atividade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;






    